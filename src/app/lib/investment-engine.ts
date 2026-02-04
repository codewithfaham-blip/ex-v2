import { db } from "@/lib/db";

export async function distributeDailyProfits() {
  // 1. Sab active deposits dhundo
  const activeDeposits = await db.deposit.findMany({
    where: { status: "ACTIVE" },
  });

  for (const deposit of activeDeposits) {
    // Farz karein profit 2% daily hai
    const profit = deposit.amount * 0.02;

    // 2. User ka balance update karein
    await db.user.update({
      where: { id: deposit.userId },
      data: {
        balance: { increment: profit }
      }
    });

    console.log(`Profit of ${profit} added to user ${deposit.userId}`);
  }
}