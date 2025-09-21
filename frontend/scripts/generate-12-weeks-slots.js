import { PrismaClient } from '@prisma/client';
// import { addDays, startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';

const prisma = new PrismaClient();

async function generate12WeeksSlots() {
  try {
    console.log('📅 Generating 12 weeks of schedule slots...');

    // Clear existing slots to prevent duplicates
    await prisma.teacherScheduleSlot.deleteMany({});
    console.log('✅ Deleted all existing schedule slots');

    const recurringSchedules = await prisma.teacherSchedule.findMany({
      where: { isAvailable: true },
    });
    console.log(`📋 Found ${recurringSchedules.length} recurring schedules`);

    const slotsToCreate = [];
    const today = new Date();
    
    // Generate slots for the next 12 weeks (84 days)
    for (let i = 0; i < 84; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Find schedules for this day of the week
      const daySchedules = recurringSchedules.filter(schedule => 
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

        slotsToCreate.push({
          teacherScheduleId: schedule.id,
          startTime: startTime,
          endTime: endTime,
          isAvailable: true,
          bookedCount: 0,
          maxBookings: 15
        });
      }
    }

    console.log(`📅 Generated ${slotsToCreate.length} schedule slots`);

    // Insert all slots
    if (slotsToCreate.length > 0) {
      await prisma.teacherScheduleSlot.createMany({
        data: slotsToCreate,
        skipDuplicates: true
      });
      console.log(`✅ Created ${slotsToCreate.length} schedule slots`);
    }

    // Show summary by day
    const summary = {};
    for (const slot of slotsToCreate) {
      const date = slot.startTime.toISOString().split('T')[0];
      const dayOfWeek = slot.startTime.toLocaleDateString('en-US', { weekday: 'long' });
      const time = slot.startTime.toTimeString().slice(0, 5);
      
      if (!summary[dayOfWeek]) {
        summary[dayOfWeek] = [];
      }
      summary[dayOfWeek].push({ date, time });
    }

    console.log('\n📊 Final schedule pattern:');
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

    console.log('\n🎉 12 weeks of schedule slots generated successfully!');

  } catch (error) {
    console.error('❌ Error generating 12 weeks of slots:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

generate12WeeksSlots()
  .then(() => {
    console.log('\n✅ 12 weeks slots generation completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 12 weeks slots generation failed:', error);
    process.exit(1);
  });
