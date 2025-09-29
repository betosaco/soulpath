import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'Missing file' }, { status: 400 });
    }

    const desiredName = (form.get('name') as string) || file.name || 'policy-video.mp4';
    const path = `policies/${desiredName}`;

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Missing BLOB_READ_WRITE_TOKEN' }, { status: 500 });
    }

    const { url } = await put(path, file, {
      access: 'public',
      token,
      contentType: file.type || 'video/mp4',
      addRandomSuffix: false,
    });

    // Update the video policy URL if one exists
    const existing = await prisma.policy.findFirst({ where: { contentType: 'video' } });
    if (existing) {
      await prisma.policy.update({ where: { id: existing.id }, data: { contentUrl: url } });
    }

    return NextResponse.json({ success: true, url });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Upload failed' }, { status: 500 });
  }
}


