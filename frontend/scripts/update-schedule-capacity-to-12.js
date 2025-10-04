import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateScheduleCapacityTo12() {
  try {
    console.log('🔧 Updating schedule capacity from 15 to 12 spots...\n');

    // Update all teacher schedules
    const updatedSchedules = await prisma.teacherSchedule.updateMany({
      where: {
        maxBookings: 15
      },
      data: {
        maxBookings: 12
      }
    });

    console.log(`✅ Updated ${updatedSchedules.count} teacher schedules to 12 spots`);

    // Update all schedule slots
    const updatedSlots = await prisma.teacherScheduleSlot.updateMany({
      where: {
        maxBookings: 15
      },
      data: {
        maxBookings: 12
      }
    });

    console.log(`✅ Updated ${updatedSlots.count} schedule slots to 12 spots`);

    // Verify the changes
    const schedulesWith12 = await prisma.teacherSchedule.count({
      where: {
        maxBookings: 12
      }
    });

    const slotsWith12 = await prisma.teacherScheduleSlot.count({
      where: {
        maxBookings: 12
      }
    });

    console.log(`\n📊 Verification:`);
    console.log(`  - Schedules with 12 spots: ${schedulesWith12}`);
    console.log(`  - Slots with 12 spots: ${slotsWith12}`);

    // Show some sample schedules
    const sampleSchedules = await prisma.teacherSchedule.findMany({
      include: {
        teacher: true,
        serviceType: true,
        venue: true
      },
      take: 5
    });

    console.log(`\n📅 Sample schedules with updated capacity:`);
    sampleSchedules.forEach(schedule => {
      const time = schedule.startTime.toTimeString().slice(0, 5);
      console.log(`  - ${schedule.dayOfWeek} ${time} - ${schedule.serviceType.name} (${schedule.teacher.name}) - ${schedule.maxBookings} spots`);
    });

    console.log('\n🎉 Schedule capacity updated to 12 spots successfully!');

  } catch (error) {
    console.error('❌ Error updating schedule capacity:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateScheduleCapacityTo12()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
