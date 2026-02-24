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

    const { amount, gateway, transactionId, slipImage } = await req.json();

    if (!amount || !gateway || !transactionId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check uniqueness of Transaction ID
    const existing = await db.deposit.findUnique({
      where: { transactionId }
    });

    if (existing) {
      return NextResponse.json({ error: "Transaction ID already used" }, { status: 400 });
    }

    const deposit = await db.deposit.create({
      data: {
        userId: (session.user as any).id,
        amount: parseFloat(amount),
        gateway,
        transactionId,
        slipImage,
        status: "PENDING",
      }
    });

    return NextResponse.json({ success: true, deposit });
  } catch (error) {
    console.error("Deposit error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
