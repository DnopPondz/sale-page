import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function PATCH(req, ctx) {
  const s = await getServerSession(authOptions);
  if (!s || s.user.role!=='admin') return NextResponse.json({ message:'Unauthorized' }, { status:401 });

  const { id } = await ctx.params;        // 👈 ต้อง await
  const body = await req.json();

  const p = await prisma.product.update({
    where:{ id },
    data: {
      name_en: body.name_en,
      name_th: body.name_th,
      description_en: body.description_en,
      description_th: body.description_th,
      images: body.images,
      basePrice: body.basePrice,
      status: body.status,
      badgeNew: body.badgeNew,
      badgeRecommended: body.badgeRecommended
    }
  });
  return NextResponse.json(p);
}

export async function DELETE(_req, ctx) {
  const s = await getServerSession(authOptions);
  if (!s || s.user.role!=='admin') return NextResponse.json({ message:'Unauthorized' }, { status:401 });

  const { id } = await ctx.params;        // 👈 ต้อง await
  await prisma.product.delete({ where:{ id }});
  return NextResponse.json({ ok:true });
}
