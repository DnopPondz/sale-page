import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(_req, ctx) {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ message:'Unauthorized' }, { status:401 });
  const { id } = await ctx.params;
  const o = await prisma.order.findUnique({
    where: { id },
    include: { payment: true, items: true }
  });
  if (!o || o.userId !== s.user.id) return NextResponse.json({ message:'Not found' }, { status:404 });
  return NextResponse.json(o);
}
