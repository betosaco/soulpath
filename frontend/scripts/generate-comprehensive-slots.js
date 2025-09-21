import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function generateComprehensiveSlots() {
  try {
    console.log('📅 Generating comprehensive schedule slots for current and next month...\n');

    // Get all recurring schedules
    const schedules = await prisma.teacherSchedule.findMany({
      include: {
        teacher: true,
        serviceType: true,
        venue: true
      }
    });

    console.log(`📋 Found ${schedules.length} recurring schedules`);

    // Generate slots for the next 60 days (2 months)
    const today = new Date();
    const slots = [];

    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Find schedules for this day of the week
      const daySchedules = schedules.filter(schedule => 
        schedule.dayOfWeek === dayOfWeek
      );

      for (const schedule of daySchedules) {
        // Get the time from the schedule (stored in EST)
        const scheduleTime = schedule.startTime;
        const hours = scheduleTime.getUTCHours();
        const minutes = scheduleTime.getUTCMinutes();

        // Create the start time for the specific date in UTC
        const startTime = new Date(date);
        startTime.setUTCHours(hours, minutes, 0, 0);

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

    console.log('\n📊 Schedule slots summary by day:');
    Object.keys(summary).sort().forEach(day => {
      console.log(`\n${day}: ${summary[day].length} slots`);
      // Show first few slots as examples
      summary[day].slice(0, 3).forEach(slot => {
        console.log(`  - ${slot.date} at ${slot.time}`);
      });
      if (summary[day].length > 3) {
        console.log(`  ... and ${summary[day].length - 3} more`);
      }
    });

    // Check total slots created
    const totalSlots = await prisma.teacherScheduleSlot.count();
    console.log(`\n📊 Total schedule slots in database: ${totalSlots}`);

    // Check slots for this week
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 7);

    const thisWeekSlots = await prisma.teacherScheduleSlot.findMany({
      where: {
        startTime: {
          gte: thisWeekStart,
          lt: thisWeekEnd
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

    console.log(`\n📅 This week's slots: ${thisWeekSlots.length}`);
    thisWeekSlots.forEach(slot => {
      const date = slot.startTime.toISOString().split('T')[0];
      const time = slot.startTime.toTimeString().slice(0, 5);
      const dayOfWeek = slot.startTime.toLocaleDateString('en-US', { weekday: 'long' });
      console.log(`  - ${dayOfWeek} ${date} at ${time}: ${slot.teacherSchedule.serviceType.name}`);
    });

  } catch (error) {
    console.error('❌ Error generating comprehensive schedule slots:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

generateComprehensiveSlots()
  .then(() => {
    console.log('\n🎉 Comprehensive schedule slots generation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Comprehensive schedule slots generation failed:', error);
    process.exit(1);
  });
