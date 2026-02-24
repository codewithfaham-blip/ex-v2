import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { authenticator } from "otplib";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const userEmail = session?.user?.email;

    if (!userEmail || userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await req.json();

    const user = await db.user.findUnique({ where: { email: userEmail } });
    if (!user || !user.twoFactorSecret) {
       return NextResponse.json({ error: "2FA setup not initiated" }, { status: 400 });
    }

    const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid OTP Code" }, { status: 400 });
    }

    await db.user.update({
      where: { email: userEmail },
      data: { isTwoFactorEnabled: true }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("2FA Verify Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
