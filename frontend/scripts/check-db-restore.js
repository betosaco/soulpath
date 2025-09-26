/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const [users, teachers, slots, bookings, templates, resetTokens] = await Promise.all([
      prisma.user.count(),
      prisma.teacher.count(),
      prisma.teacherScheduleSlot.count(),
      prisma.booking.count(),
      prisma.communicationTemplate.count(),
      prisma.passwordResetToken.count(),
    ]);

    console.log(JSON.stringify({
      users,
      teachers,
      teacherScheduleSlots: slots,
      bookings,
      communicationTemplates: templates,
      passwordResetTokens: resetTokens,
    }, null, 2));
  } catch (err) {
    console.error('DB check failed:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();


