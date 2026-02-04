import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, address } = await req.json();

    if (!amount || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: (session.user as any).id },
    });

    if (!user || user.balance < parseFloat(amount)) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Use a transaction to ensure atomic update
    const result = await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: { balance: { decrement: parseFloat(amount) } },
      }),
      db.withdrawal.create({
        data: {
          amount: parseFloat(amount),
          address,
          status: "PENDING",
          userId: user.id,
        },
      }),
    ]);

    return NextResponse.json(result[1]);
  } catch (error) {
    console.error("Withdrawal API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
