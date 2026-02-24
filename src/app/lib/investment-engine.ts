import { db } from "@/lib/db";

export async function distributeDailyProfits() {
  // 1. Sab active deposits dhundo taake unka profit calculate ho sake
  const activeDeposits = await db.deposit.findMany({
    where: { status: "ACTIVE" },
  });

  for (const deposit of activeDeposits) {
    // Plan-based Profit Rates
    let rate = 0.01; // Default 1%
    if (deposit.planName === "Basic Starter") rate = 0.015;
    if (deposit.planName === "Basic") rate = 0.025;
    if (deposit.planName === "Standard") rate = 0.05;

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