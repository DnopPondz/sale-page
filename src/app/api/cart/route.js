import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ items: [] });
  const cart = await prisma.cart.upsert({ where: { userId: s.user.id }, update: {}, create: { userId: s.user.id } });
  const items = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: { product: true },
    orderBy: { createdAt: 'asc' }
  });
  return NextResponse.json({ items });
}

export async function POST(req) {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { productId, options = {}, qty = 1, unitPrice = 0 } = await req.json();
  const cart = await prisma.cart.upsert({ where: { userId: s.user.id }, update: {}, create: { userId: s.user.id } });
  const item = await prisma.cartItem.create({
    data: { cartId: cart.id, productId, optionSelections: options, qty, unitPriceSnapshot: unitPrice }
  });
  return NextResponse.json(item, { status: 201 });
}
