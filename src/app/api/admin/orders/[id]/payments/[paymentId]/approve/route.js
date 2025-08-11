import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(_req, ctx) {
  const s = await getServerSession(authOptions);
  if (!s || s.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { id, paymentId } = await ctx.params;

  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: 'APPROVED', verifiedBy: s.user.id, verifiedAt: new Date() },
  });

  const order = await prisma.order.update({
    where: { id },
    data: { paymentStatus: 'PAID', status: 'ACCEPTED' },
  });

  return NextResponse.json({ payment, order });
}
