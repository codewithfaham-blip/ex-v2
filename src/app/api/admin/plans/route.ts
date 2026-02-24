import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// List all plans for admin
export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const plans = await db.plan.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

// Create new plan
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const plan = await db.plan.create({
      data: {
        name: body.name,
        minAmount: parseFloat(body.minAmount),
        maxAmount: parseFloat(body.maxAmount),
        roi: parseFloat(body.roi),
        duration: body.duration,
        icon: body.icon || "Zap",
        popular: body.popular || false,
        active: body.active !== undefined ? body.active : true,
      }
    });
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}
