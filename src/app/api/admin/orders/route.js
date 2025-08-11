import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return NextResponse.json({ message:'Unauthorized' }, { status:401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;

  const where = {};
  if (status) where.status = status;

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { payment: true, user: { select: { email: true, firstName: true, lastName: true } } }
  });

  return NextResponse.json(orders);
}
