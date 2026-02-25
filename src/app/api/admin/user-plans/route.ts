import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Get all user plans with plan IDs (Admin only)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized: Admin privileges required" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const planId = searchParams.get("planId");
    const status = searchParams.get("status");

    // Build filter conditions
    const whereCondition: any = {};
    if (userId) whereCondition.userId = userId;
    if (planId) whereCondition.planId = planId;
    if (status) whereCondition.status = status;

    const userPlans = await db.userPlan.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            balance: true
          }
        },
        plan: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({
      total: userPlans.length,
      data: userPlans
    });
  } catch (error) {
    console.error("Fetch user plans error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Get specific user's plans with plan IDs (Admin only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized: Admin privileges required" }, { status: 401 });
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const userPlans = await db.userPlan.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            balance: true
          }
        },
        plan: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const userDetails = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        balance: true,
        createdAt: true,
        role: true
      }
    });

    return NextResponse.json({
      user: userDetails,
      plans: userPlans,
      totalPlans: userPlans.length
    });
  } catch (error) {
    console.error("Fetch user plans error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
