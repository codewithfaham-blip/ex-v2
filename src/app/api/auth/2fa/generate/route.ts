import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { authenticator } from "otplib";
import qrcode from "qrcode";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const userEmail = session?.user?.email;

    if (!userEmail || userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(userEmail, "Exotic Cash", secret);
    const qrCodeUrl = await qrcode.toDataURL(otpauth);

    // Temp save secret to verifiy next step (or just send it to client to send back? better to save pending?)
    // For simplicity, we can just send it to the client and require them to send it back with the code to verify & save.
    // OR we can save it to the DB but mark 2FA as disabled until verified.
    
    await db.user.update({
      where: { email: userEmail },
      data: { twoFactorSecret: secret } // Saved but isTwoFactorEnabled is still false
    });

    return NextResponse.json({ secret, qrCodeUrl });
  } catch (error: any) {
    console.error("2FA Generate Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
