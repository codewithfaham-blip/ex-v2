import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  
  console.log(`[API] PUT Plan Request by ${user?.email} (Role: ${user?.role})`);

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized: Admin privileges required" }, { status: 401 });
  }

  const { id } = await params;

  if (!id || id === 'undefined') {
    return NextResponse.json({ error: "Missing or invalid plan ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    console.log(`[API] Updating plan ${id} with:`, body);

    // Verify plan exists before update
    const existingPlan = await db.plan.findUnique({ where: { id } });
    if (!existingPlan) {
      console.error(`❌ Plan ${id} not found in database`);
      return NextResponse.json({ error: "Plan not found in database" }, { status: 404 });
    }

    const plan = await db.plan.update({
      where: { id },
      data: {
        name: body.name,
        minAmount: parseFloat(body.minAmount) || 0,
        maxAmount: parseFloat(body.maxAmount) || 0,
        roi: parseFloat(body.roi) || 0,
        duration: body.duration,
        icon: body.icon || "Zap",
        popular: body.popular === true,
        active: body.active === true,
      }
    });

    console.log(`✅ Plan ${id} updated successfully: ${plan.name}`);
    return NextResponse.json(plan);
  } catch (error: any) {
    console.error("❌ Update plan error:", error);
    return NextResponse.json({ 
      error: "Failed to update plan", 
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  console.log(`[API] DELETE Plan Request by ${user?.email} (Role: ${user?.role})`);

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized: Admin privileges required" }, { status: 401 });
  }

  const { id } = await params;

  if (!id || id === 'undefined') {
    return NextResponse.json({ error: "Missing or invalid plan ID" }, { status: 400 });
  }

  try {
    // Check if plan exists
    const existingPlan = await db.plan.findUnique({ where: { id } });
    if (!existingPlan) {
        return NextResponse.json({ error: "Plan already removed or never existed" }, { status: 404 });
    }

    await db.plan.delete({
      where: { id }
    });

    console.log(`✅ Plan ${id} deleted successfully`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Delete plan error:", error);
    return NextResponse.json({ 
        error: "Failed to delete plan",
        details: error.message
    }, { status: 500 });
  }
}
