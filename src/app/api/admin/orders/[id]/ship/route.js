import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(_req, ctx) {
  const s = await getServerSession(authOptions);
  if (!s || s.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await ctx.params;
  const o = await prisma.order.update({
    where: { id },
    data: { status: 'SHIPPED' },
  });
  return NextResponse.json(o);
}
