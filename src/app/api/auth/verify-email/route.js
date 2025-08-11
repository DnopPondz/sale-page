import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';

async function verifyToken(token) {
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
  );
  await prisma.user.update({
    where: { id: payload.sub },
    data: { emailVerifiedAt: new Date() },
  });
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    if (!token) return NextResponse.json({ message: 'Missing token' }, { status: 400 });

    await verifyToken(token);

    // มี i18n → ใส่ prefix locale (สมมุติใช้ en)
    return NextResponse.redirect(new URL('/en/verify-email?status=ok', req.url));
  } catch (e) {
    console.error('VERIFY_ERROR(GET)', e);
    return NextResponse.redirect(new URL('/en/verify-email?status=fail', req.url));
  }
}

export async function POST(req) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ message: 'Missing token' }, { status: 400 });

    await verifyToken(token);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('VERIFY_ERROR(POST)', e);
    return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
  }
}