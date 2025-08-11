import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function PATCH(req, ctx) {
  const s = await getServerSession(authOptions);
  if (!s || s.user.role!=='admin') return NextResponse.json({ message:'Unauthorized' }, { status:401 });

  const { id } = await ctx.params;      // 👈 ต้อง await
  const body = await req.json();

  const u = await prisma.user.update({
    where:{ id },
    data: { role: body.role, status: body.status }
  });
  return NextResponse.json(u);
}
