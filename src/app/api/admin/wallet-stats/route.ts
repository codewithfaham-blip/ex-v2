import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [deposits, withdrawals, pending] = await Promise.all([
      db.deposit.aggregate({
        _sum: { amount: true },
        where: { status: "COMPLETED" }
      }),
      db.withdrawal.aggregate({
        _sum: { amount: true },
        where: { status: "COMPLETED" }
      }),
      db.deposit.count({
        where: { status: "PENDING" }
      })
    ]);

    return NextResponse.json({
      totalDeposited: deposits._sum.amount || 0,
      totalWithdrawn: withdrawals._sum.amount || 0,
      pendingPayments: pending
    });
  } catch (error) {
    console.error("Wallet stats error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
