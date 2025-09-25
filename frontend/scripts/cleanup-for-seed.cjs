/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('Cleaning tables before seed...');
    // Order matters due to FKs
    await prisma.$transaction([
      prisma.rate.deleteMany({}),
      prisma.teacherScheduleSlot.deleteMany({}),
      prisma.teacherSchedule.deleteMany({}),
      prisma.booking.deleteMany({}),
      prisma.serviceType.deleteMany({}),
      prisma.sessionDuration.deleteMany({}),
    ]);
    console.log('Cleanup complete.');
  } catch (err) {
    console.error('Cleanup failed:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();


