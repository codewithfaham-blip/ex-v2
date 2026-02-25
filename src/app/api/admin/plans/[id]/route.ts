import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { notifyPlanChange } from "@/lib/planSync";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  
  console.log(`[API] PUT Plan Request by ${user?.email} (Role: ${user?.role})`);

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized: Admin privileges required" }, { status: 401 });
  }

  const { id } = params;

  if (!id || id === 'undefined') {
    return NextResponse.json({ error: "Missing or invalid plan ID" }, { status: 400 });
  }

  try {
    const body = await req.json();

    // Verify plan exists before update
    const existingPlan = await db.plan.findUnique({ where: { id } });
    if (!existingPlan) {
      console.error(`❌ Plan ${id} not found in database`);
      return NextResponse.json({ error: "Plan not found in database" }, { status: 404 });
    }

    const updateData = {
      name: body.name,
      minAmount: parseFloat(body.minAmount) || 0,
      maxAmount: parseFloat(body.maxAmount) || 0,
      roi: parseFloat(body.roi) || 0,
      duration: body.duration,
      icon: body.icon || "Zap",
      popular: body.popular === true,
      active: body.active === true,
    };
    
    console.log(`[API] Updating plan ${id} with data:`, updateData);

    // Update the plan
    const plan = await db.plan.update({
      where: { id },
      data: updateData,
    });

    // Update all UserPlan records with this planId to reflect ROI changes
    const usersWithThisPlan = await db.userPlan.findMany({
      where: { planId: id, status: "ACTIVE" }
    });

    if (usersWithThisPlan.length > 0) {
      // Update ROI for all active user plans with this plan
      await db.userPlan.updateMany({
        where: { planId: id, status: "ACTIVE" },
        data: {
          roi: parseFloat(body.roi) || existingPlan.roi,
          duration: body.duration || existingPlan.duration,
          updatedAt: new Date()
        }
      });

      console.log(`✅ Updated ${usersWithThisPlan.length} user plans with new ROI and duration for plan ${id}`);
    }

    console.log(`✅ Plan ${id} updated successfully: ${plan.name}`);
    
    // Broadcast plan update to all subscribers
    notifyPlanChange({
      type: 'UPDATE',
      planId: id,
      planData: plan,
      timestamp: Date.now(),
      adminEmail: user?.email
    });

    return NextResponse.json({
      success: true,
      plan,
      affectedUserPlans: usersWithThisPlan.length,
      message: `Plan updated and ${usersWithThisPlan.length} user plans affected`
    });
  } catch (error: any) {
    console.error("❌ Update plan error:", error);
    return NextResponse.json({ 
      error: "Failed to update plan", 
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  console.log(`[API] DELETE Plan Request by ${user?.email} (Role: ${user?.role})`);

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized: Admin privileges required" }, { status: 401 });
  }

  const { id } = await params;

  if (!id || id === 'undefined') {
    return NextResponse.json({ error: "Missing or invalid plan ID" }, { status: 400 });
  }

  try {
    // Check if plan exists
    const existingPlan = await db.plan.findUnique({ where: { id } });
    if (!existingPlan) {
        return NextResponse.json({ error: "Plan already removed or never existed" }, { status: 404 });
    }

    // Count users with this plan
    const userCount = await db.userPlan.count({
      where: { planId: id }
    });

    // Delete all associated UserPlan records
    if (userCount > 0) {
      await db.userPlan.deleteMany({
        where: { planId: id }
      });
      console.log(`✅ Deleted ${userCount} user plan associations for plan ${id}`);
    }

    // Delete the plan
    await db.plan.delete({
      where: { id }
    });

    console.log(`✅ Plan ${id} deleted successfully with ${userCount} user associations removed`);
    
    // Broadcast plan deletion to all subscribers
    notifyPlanChange({
      type: 'DELETE',
      planId: id,
      timestamp: Date.now(),
      adminEmail: user?.email
    });

    return NextResponse.json({ 
      success: true,
      message: `Plan deleted. Removed from ${userCount} users' plans.`
    });
  } catch (error: any) {
    console.error("❌ Delete plan error:", error);
    return NextResponse.json({ 
        error: "Failed to delete plan",
        details: error.message
    }, { status: 500 });
  }
}
    }, { status: 500 });
  }
}
