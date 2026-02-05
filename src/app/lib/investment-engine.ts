import { db } from "@/lib/db";

export async function distributeDailyProfits() {
  // 1. Sab approved deposits dhundo (Kyunki status APPROVED hai, ACTIVE nahi)
  const activeDeposits = await db.deposit.findMany({
    where: { status: "APPROVED" }, // <-- Yahan APPROVED kar diya
  });

  for (const deposit of activeDeposits) {
    // 2% Daily Profit Logic
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