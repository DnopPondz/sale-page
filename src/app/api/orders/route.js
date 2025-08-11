import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json([]);
  const orders = await prisma.order.findMany({
    where: { userId: s.user.id },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(orders);
}
