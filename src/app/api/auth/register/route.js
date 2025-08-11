import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { hash } from "bcrypt";
import { SignJWT } from "jose";
import { sendMail } from "@/lib/mailer";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { firstName, lastName, phone, email, password } = schema.parse(body);
    const normalizedEmail = email.toLowerCase();

    const exists = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (exists)
      return NextResponse.json({ message: "Email exists" }, { status: 409 });

    const passwordHash = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        phone: phone ?? null,
        email: normalizedEmail,
        passwordHash,
      },
    });

    const token = await new SignJWT({ sub: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2d")
      .sign(new TextEncoder().encode(process.env.NEXTAUTH_SECRET));

 const base = process.env.NEXTAUTH_URL.replace(/\/$/, '');
const link = `${base}/api/auth/verify-email?token=${token}`; // เรียก GET API ตรงๆ


    const { previewUrl } = await sendMail({
      to: user.email,
      subject: "Verify your email",
      html: `Click <a href="${link}">verify your email</a>`,
    });
    if (previewUrl) console.log("📨 Dev preview:", previewUrl);
    else console.log("DEV verify link:", link);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("REGISTER_ERROR", err);
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 }
    );
  }
}
