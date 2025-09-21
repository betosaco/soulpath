import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixScheduleTimes() {
  try {
    console.log('🕐 Fixing schedule times to be stored correctly in UTC...\n');

    // Delete all existing schedule slots
    await prisma.teacherScheduleSlot.deleteMany({});
    console.log('✅ Deleted all existing schedule slots');

    // Get all recurring schedules
    const schedules = await prisma.teacherSchedule.findMany({
      include: {
        teacher: true,
        serviceType: true,
        venue: true
      }
    });

    console.log(`📋 Found ${schedules.length} recurring schedules`);

    // Generate slots for the next 4 weeks (28 days)
    const today = new Date();
    const slots = [];

    for (let i = 0; i < 28; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Find schedules for this day of the week
      const daySchedules = schedules.filter(schedule => 
        schedule.dayOfWeek === dayOfWeek
      );

      for (const schedule of daySchedules) {
        // Get the time from the schedule (which is stored as UTC)
        const scheduleTime = schedule.startTime;
        const hours = scheduleTime.getUTCHours();
        const minutes = scheduleTime.getUTCMinutes();

        // Create the start time for the specific date in UTC
        const startTime = new Date(date);
        startTime.setUTCHours(hours, minutes, 0, 0);

        const endTime = new Date(startTime);
        endTime.setUTCHours(startTime.getUTCHours() + 1); // 1 hour sessions

        slots.push({
          teacherScheduleId: schedule.id,
          startTime: startTime,
          endTime: endTime,
          isAvailable: true,
          bookedCount: 0,
          maxBookings: 15
        });
      }
    }

    console.log(`📅 Generated ${slots.length} schedule slots`);

    // Insert all slots
    await prisma.teacherScheduleSlot.createMany({
      data: slots,
      skipDuplicates: true
    });
    console.log(`✅ Created ${slots.length} schedule slots`);

    // Show Sunday slots with correct time conversion
    const sundaySlots = await prisma.teacherScheduleSlot.findMany({
      where: {
        teacherSchedule: {
          dayOfWeek: 'Sunday'
        }
      },
      include: {
        teacherSchedule: {
          include: {
            serviceType: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      },
      take: 4
    });

    console.log('\n📅 Sunday slots (first 4) with correct EST times:');
    sundaySlots.forEach(slot => {
      // Convert UTC to EST (UTC-5)
      const estTime = new Date(slot.startTime.getTime() - (5 * 60 * 60 * 1000));
      const date = estTime.toISOString().split('T')[0];
      const time = estTime.toTimeString().slice(0, 5);
      console.log(`- ${date} at ${time} EST: ${slot.teacherSchedule.serviceType.name}`);
    });

  } catch (error) {
    console.error('❌ Error fixing schedule times:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixScheduleTimes()
  .then(() => {
    console.log('\n🎉 Schedule times fixed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Schedule times fix failed:', error);
    process.exit(1);
  });
