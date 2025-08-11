// src/app/api/products/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const where = { status: 'active' };
  if (q) {
    where.OR = [
      { name_en: { contains: q, mode: 'insensitive' } },
      { name_th: { contains: q, mode: 'insensitive' } },
    ];
  }
  const items = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(items);
}
