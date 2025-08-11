import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req, ctx) {
  const s = await getServerSession(authOptions);
  if (!s || s.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { id, paymentId } = await ctx.params;
  const { reason = '' } = await req.json().catch(() => ({ reason: '' }));

  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: 'REJECTED', verifiedBy: s.user.id, verifiedAt: new Date(), bankRef: reason || null },
  });

  const order = await prisma.order.update({
    where: { id },
    data: { paymentStatus: 'UNPAID', status: 'PENDING' },
  });

  return NextResponse.json({ payment, order });
}
