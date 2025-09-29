import { readFile } from 'fs/promises';
import { put } from '@vercel/blob';
import { PrismaClient } from '@prisma/client';

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
if (!TOKEN) {
  console.error('Missing BLOB_READ_WRITE_TOKEN');
  process.exit(1);
}

const LOCAL_PATH = 'public/policies/Text20250929122933.mp4';
const DEST_PATH = 'policies/Text20250929122933.mp4';

async function main() {
  const buf = await readFile(LOCAL_PATH);
  const file = new File([buf], 'Text20250929122933.mp4', { type: 'video/mp4' });
  const { url } = await put(DEST_PATH, file, {
    access: 'public',
    token: TOKEN,
    contentType: 'video/mp4',
    addRandomSuffix: false,
  });
  console.log(url);
  // Update policy video URL in DB
  const prisma = new PrismaClient();
  try {
    const existing = await prisma.policy.findFirst({ where: { contentType: 'video' } });
    if (existing) {
      await prisma.policy.update({ where: { id: existing.id }, data: { contentUrl: url } });
      console.log('Updated policy video URL in DB');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


