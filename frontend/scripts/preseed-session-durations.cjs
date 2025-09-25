/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('Ensuring canonical session_durations with ids 1..4');
    await prisma.$executeRawUnsafe(`
      INSERT INTO "session_durations" (id, name, duration_minutes, description, is_active, created_at, updated_at)
      VALUES
        (1, '1 Hour', 60, 'Standard 1-hour wellness class', true, now(), now()),
        (2, '90 Minutes', 90, 'Extended wellness session', true, now(), now()),
        (3, '120 Minutes', 120, 'Comprehensive wellness session', true, now(), now()),
        (4, '150 Minutes', 150, 'Intensive wellness session', true, now(), now())
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        duration_minutes = EXCLUDED.duration_minutes,
        description = EXCLUDED.description,
        is_active = EXCLUDED.is_active,
        updated_at = now();
    `);
    console.log('Session durations ready.');
  } catch (err) {
    console.error('Preseed failed:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();


