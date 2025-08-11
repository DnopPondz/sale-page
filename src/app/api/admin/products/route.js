import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';


function reqAdmin(session){ return !!session && session.user.role==='admin'; }

export async function GET() {
  const products = await prisma.product.findMany({ orderBy:{ createdAt:'desc' }});
  return NextResponse.json(products);
}

export async function POST(req) {
  const s = await getServerSession(authOptions);
  if (!reqAdmin(s)) return NextResponse.json({ message:'Unauthorized' }, { status:401 });
  const body = await req.json();
  const p = await prisma.product.create({
    data: {
      name_en: body.name_en, name_th: body.name_th,
      description_en: body.description_en || '', description_th: body.description_th || '',
      images: body.images || [],
      basePrice: body.basePrice || 0,
      status: 'active',
      badgeNew: !!body.badgeNew, badgeRecommended: !!body.badgeRecommended,
    },
  });
  return NextResponse.json(p, { status:201 });
}


