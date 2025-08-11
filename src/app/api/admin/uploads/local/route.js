import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(req) {
  const s = await getServerSession(authOptions);
  if (!s || s.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ message: 'file required' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase();
    const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
    const filePath = path.join(uploadsDir, name);

    await writeFile(filePath, buffer);
    const publicUrl = `/uploads/${name}`;
    return NextResponse.json({ fileUrl: publicUrl });
  } catch (e) {
    console.error('LOCAL_UPLOAD_ERROR', e);
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}
