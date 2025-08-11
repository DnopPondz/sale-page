import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function PATCH(req, ctx) {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ message:'Unauthorized' }, { status:401 });
  const { id } = await ctx.params;
  const { qty } = await req.json();
  const updated = await prisma.cartItem.update({ where: { id }, data: { qty }});
  return NextResponse.json(updated);
}

export async function DELETE(_req, ctx) {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ message:'Unauthorized' }, { status:401 });
  const { id } = await ctx.params;
  await prisma.cartItem.delete({ where: { id }});
  return NextResponse.json({ ok:true });
}
