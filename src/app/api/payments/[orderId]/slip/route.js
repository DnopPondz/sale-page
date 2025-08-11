import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(req, ctx) {
  const s = await getServerSession(authOptions);
  if (!s) return NextResponse.json({ message:'Unauthorized' }, { status:401 });

  const { orderId } = await ctx.params;
  const order = await prisma.order.findUnique({ where: { id: orderId }});
  if (!order || order.userId !== s.user.id) return NextResponse.json({ message:'Not found' }, { status:404 });

  const form = await req.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string') return NextResponse.json({ message:'file required' }, { status:400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const dir = path.join(process.cwd(), 'public', 'slips');
  await mkdir(dir, { recursive: true });
  const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase();
  const name = `${order.id}-${Date.now()}-${crypto.randomBytes(5).toString('hex')}.${ext}`;
  await writeFile(path.join(dir, name), buffer);

  const publicUrl = `/slips/${name}`;

  await prisma.payment.update({ where: { orderId: order.id }, data: { slipUrl: publicUrl, status: 'PENDING_REVIEW' }});
  await prisma.order.update({ where: { id: order.id }, data: { status: 'AWAITING_CONFIRMATION' }});

  return NextResponse.json({ ok:true, fileUrl: publicUrl });
}
