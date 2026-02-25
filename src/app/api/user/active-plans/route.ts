import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Get active plans from UserPlan model (new system with plan IDs)
    const userPlans = await db.userPlan.findMany({
      where: {
        userId,
        status: "ACTIVE"
      },
      include: {
        plan: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Also get legacy deposit-based plans for backward compatibility
    const activePlans = await db.deposit.findMany({
      where: {
        userId,
        status: "ACTIVE",
        planName: {
            not: "Manual Deposit"
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({
      userPlans: userPlans.map(up => ({
        id: up.id,
        planId: up.planId,
        userId: up.userId,
        planName: up.plan.name,
        amount: up.amount,
        roi: up.roi,
        duration: up.duration,
        status: up.status,
        startDate: up.startDate,
        endDate: up.endDate,
        createdAt: up.createdAt,
        updatedAt: up.updatedAt,
        plan: up.plan
      })),
      legacyPlans: activePlans,
      total: userPlans.length + activePlans.length
    });
  } catch (error) {
    console.error("Fetch active plans error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
