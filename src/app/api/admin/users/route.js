import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy:{ createdAt:'desc' },
    select: { id:true, email:true, firstName:true, lastName:true, role:true, status:true, createdAt:true }
  });
  return NextResponse.json(users);
}
