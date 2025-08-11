import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUploadUrl } from '@/lib/s3';

export async function POST(req) {
  const s = await getServerSession(authOptions);
  if (!s || s.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { filename, contentType = 'image/jpeg' } = await req.json().catch(() => ({}));
  if (!filename) {
    return NextResponse.json({ message: 'filename required' }, { status: 400 });
  }

  const safeName = filename.replace(/[^a-zA-Z0-9._-]+/g, '_');
  const key = `products/${Date.now()}-${safeName}`;
  const { url, publicUrl } = await getUploadUrl(key, contentType);
  return NextResponse.json({ uploadUrl: url, fileUrl: publicUrl });
}
