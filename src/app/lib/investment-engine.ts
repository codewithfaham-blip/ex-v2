import { db } from "@/lib/db";

export async function distributeDailyProfits() {
  // 1. Sab active deposits dhundo taake unka profit calculate ho sake
  const activeDeposits = await db.deposit.findMany({
    where: { status: "ACTIVE" },
  });

  for (const deposit of activeDeposits) {
    // Plan-based Profit Rates
    let rate = 0.02; // Default 2%
    if (deposit.planName === "Infrastructure Node") rate = 0.03;
    if (deposit.planName === "Intelligence Terminal") rate = 0.04;
    if (deposit.planName === "Quantum Access") rate = 0.05;

    const profit = deposit.amount * rate;

    // 2. User ka balance update karein atomically
    await db.user.update({
      where: { id: deposit.userId },
      data: {
        balance: { increment: profit }
      }
    });

    console.log(`[ENGINE] Profit of ${profit} (${(rate*100).toFixed(0)}%) added to user ${deposit.userId} for plan ${deposit.planName}`);
  }
}