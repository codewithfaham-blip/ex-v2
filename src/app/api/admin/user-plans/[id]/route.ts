import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Get a specific user plan with plan ID details
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized: Admin privileges required" }, { status: 401 });
    }

    const { id } = await params;

    const userPlan = await db.userPlan.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            balance: true,
            createdAt: true
          }
        },
        plan: true
      }
    });

    if (!userPlan) {
      return NextResponse.json({ error: "User plan not found" }, { status: 404 });
    }

    return NextResponse.json(userPlan);
  } catch (error) {
    console.error("Fetch user plan error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Update a specific user plan (admin only)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized: Admin privileges required" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Verify the user plan exists
    const existingUserPlan = await db.userPlan.findUnique({
      where: { id },
      include: { plan: true }
    });

    if (!existingUserPlan) {
      return NextResponse.json({ error: "User plan not found" }, { status: 404 });
    }

    const updateData: any = {};

    // Update allowed fields
    if (body.status) updateData.status = body.status;
    if (body.amount !== undefined) updateData.amount = parseFloat(body.amount);
    if (body.roi !== undefined) updateData.roi = parseFloat(body.roi);
    if (body.duration) updateData.duration = body.duration;
    if (body.endDate) updateData.endDate = new Date(body.endDate);

    updateData.updatedAt = new Date();

    const updatedUserPlan = await db.userPlan.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        plan: true
      }
    });

    console.log(`✅ User plan ${id} updated by admin ${user?.email}:`, updateData);

    return NextResponse.json({
      success: true,
      userPlan: updatedUserPlan,
      message: "User plan updated successfully"
    });
  } catch (error: any) {
    console.error("Update user plan error:", error);
    return NextResponse.json({
      error: "Failed to update user plan",
      details: error.message
    }, { status: 500 });
  }
}

// Delete/Cancel a specific user plan (admin only)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized: Admin privileges required" }, { status: 401 });
    }

    const { id } = await params;

    // Verify the user plan exists
    const userPlan = await db.userPlan.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    if (!userPlan) {
      return NextResponse.json({ error: "User plan not found" }, { status: 404 });
    }

    // Delete the user plan
    await db.userPlan.delete({
      where: { id }
    });

    console.log(`✅ User plan ${id} deleted by admin ${user?.email} for user ${userPlan.user.email}`);

    return NextResponse.json({
      success: true,
      message: `User plan cancelled for ${userPlan.user.email}`,
      deletedUserPlan: userPlan
    });
  } catch (error: any) {
    console.error("Delete user plan error:", error);
    return NextResponse.json({
      error: "Failed to delete user plan",
      details: error.message
    }, { status: 500 });
  }
}
