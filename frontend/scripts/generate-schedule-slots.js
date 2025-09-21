import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function generateScheduleSlots() {
  try {
    console.log('📅 Generating schedule slots for the next 4 weeks...\n');

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
        // Convert UTC time to EST for the specific date
        const startTime = new Date(date);
        const scheduleStartTime = schedule.startTime;
        startTime.setUTCHours(scheduleStartTime.getUTCHours());
        startTime.setUTCMinutes(scheduleStartTime.getUTCMinutes());
        startTime.setUTCSeconds(0);
        startTime.setUTCMilliseconds(0);

        const endTime = new Date(startTime);
        endTime.setUTCHours(startTime.getUTCHours() + 1); // 1 hour sessions

        // Check if slot already exists
        const existingSlot = await prisma.teacherScheduleSlot.findFirst({
          where: {
            teacherScheduleId: schedule.id,
            startTime: startTime
          }
        });

        if (!existingSlot) {
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
    }

    console.log(`📅 Generated ${slots.length} schedule slots`);

    // Insert all slots
    if (slots.length > 0) {
      await prisma.teacherScheduleSlot.createMany({
        data: slots,
        skipDuplicates: true
      });
      console.log(`✅ Created ${slots.length} schedule slots`);
    }

    // Show summary by day
    const summary = {};
    for (const slot of slots) {
      const date = slot.startTime.toISOString().split('T')[0];
      const dayOfWeek = slot.startTime.toLocaleDateString('en-US', { weekday: 'long' });
      const time = slot.startTime.toTimeString().slice(0, 5);
      
      if (!summary[dayOfWeek]) {
        summary[dayOfWeek] = [];
      }
      summary[dayOfWeek].push({ date, time });
    }

    console.log('\n📊 Schedule slots summary:');
    Object.keys(summary).sort().forEach(day => {
      console.log(`\n${day}:`);
      summary[day].forEach(slot => {
        console.log(`  - ${slot.date} at ${slot.time}`);
      });
    });

    // Check Sunday slots specifically
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
      }
    });

    console.log(`\n📅 Sunday slots created: ${sundaySlots.length}`);
    sundaySlots.forEach(slot => {
      const date = slot.startTime.toISOString().split('T')[0];
      const time = slot.startTime.toTimeString().slice(0, 5);
      console.log(`  - ${date} at ${time}: ${slot.teacherSchedule.serviceType.name}`);
    });

  } catch (error) {
    console.error('❌ Error generating schedule slots:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

generateScheduleSlots()
  .then(() => {
    console.log('\n🎉 Schedule slots generation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Schedule slots generation failed:', error);
    process.exit(1);
  });
