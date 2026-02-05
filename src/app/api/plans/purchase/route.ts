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

    const { planName, amount } = await req.json();

    if (!planName || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Deduct balance and create an ACTIVE deposit record
    const result = await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: { balance: { decrement: parseFloat(amount) } }
      }),
      db.deposit.create({
        data: {
          userId: user.id,
          amount: parseFloat(amount),
          planName: planName,
          gateway: "Internal Balance",
          status: "ACTIVE", // Automatically start earning profit
          transactionId: `PLAN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        }
      })
    ]);

    return NextResponse.json({ success: true, message: "Plan activated successfully" });

  } catch (error) {
    console.error("Plan purchase error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
