import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planName, amount: rawAmount } = await req.json();
    const amount = parseFloat(rawAmount);

    // 1. Strict Plan Validation
    const VALID_PLANS: Record<string, { min: number; max: number }> = {
      "Basic Starter": { min: 10, max: 99 },
      "Basic": { min: 100, max: 499 },
      "Standard": { min: 500, max: 1000 }
    };

    const plan = VALID_PLANS[planName];
    if (!plan || amount < plan.min || amount > plan.max) {
      return NextResponse.json({ error: "Invalid plan or amount out of range" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Atomic Update with condition (though Prisma decrement does this internally, we wrap in transaction)
    try {
      if (user.balance < amount) {
        return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
      }

      await db.$transaction([
        db.user.update({
          where: { id: user.id, balance: { gte: amount } }, // Extra check for safety
          data: { balance: { decrement: amount } }
        }),
        db.deposit.create({
          data: {
            userId: user.id,
            amount: amount,
            planName: planName,
            gateway: "Internal Balance",
            status: "ACTIVE",
            transactionId: `PLAN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          }
        })
      ]);
    } catch (error) {
       return NextResponse.json({ error: "Transaction failed. Possible balance mismatch." }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Plan activated successfully" });

  } catch (error) {
    console.error("Plan purchase error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
