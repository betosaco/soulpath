import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedNext3WeeksSchedules() {
  try {
    console.log('📅 Seeding schedule slots for the next 3 weeks...\n');

    // Get the teacher, venue, and service types
    const luciaMeza = await prisma.teacher.findFirst({
      where: { name: 'Lucia Meza' }
    });

    const venue = await prisma.venue.findFirst({
      where: { name: 'MatMax Yoga Studio' }
    });

    const hathaYoga = await prisma.serviceType.findFirst({
      where: { name: 'Hatha Yoga' }
    });

    const vinyasaYoga = await prisma.serviceType.findFirst({
      where: { name: 'Vinyasa Yoga' }
    });

    if (!luciaMeza || !venue || !hathaYoga || !vinyasaYoga) {
      throw new Error('Required teacher, venue, or service types not found');
    }

    console.log('✅ Found required entities:');
    console.log(`  - Teacher: ${luciaMeza.name}`);
    console.log(`  - Venue: ${venue.name}`);
    console.log(`  - Hatha Yoga: ${hathaYoga.name}`);
    console.log(`  - Vinyasa Yoga: ${vinyasaYoga.name}\n`);

    // Get all existing recurring schedules
    const schedules = await prisma.teacherSchedule.findMany({
      include: {
        teacher: true,
        serviceType: true,
        venue: true
      }
    });

    console.log(`📋 Found ${schedules.length} recurring schedules\n`);

    // Generate slots for the next 3 weeks (21 days)
    const today = new Date();
    const slots = [];
    let totalSlots = 0;

    for (let i = 0; i < 21; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Find schedules for this day of the week
      const daySchedules = schedules.filter(schedule => 
        schedule.dayOfWeek === dayOfWeek
      );

      console.log(`📅 ${date.toLocaleDateString()} (${dayOfWeek}): ${daySchedules.length} schedules`);

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
          const slotData = {
            teacherScheduleId: schedule.id,
            startTime: startTime,
            endTime: endTime,
            isAvailable: true,
            bookedCount: 0,
            maxBookings: schedule.maxBookings || 15
          };

          slots.push(slotData);
          totalSlots++;

          // Convert UTC time to EST for display
          // The times are stored as UTC, so we need to subtract 5 hours to get EST
          const estTime = new Date(startTime.getTime() - (5 * 60 * 60 * 1000));
          const timeStr = estTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });

          console.log(`  ✅ ${timeStr} - ${schedule.serviceType.name} (${schedule.teacher.name})`);
        } else {
          console.log(`  ⚠️  Slot already exists for ${schedule.serviceType.name} at ${startTime.toLocaleTimeString()}`);
        }
      }
    }

    if (slots.length > 0) {
      console.log(`\n📅 Creating ${slots.length} new schedule slots...`);
      
      // Create slots in batches to avoid overwhelming the database
      const batchSize = 50;
      for (let i = 0; i < slots.length; i += batchSize) {
        const batch = slots.slice(i, i + batchSize);
        await prisma.teacherScheduleSlot.createMany({
          data: batch
        });
        console.log(`  ✅ Created batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(slots.length / batchSize)}`);
      }
    } else {
      console.log('⚠️  No new slots to create - all slots already exist');
    }

    // Show summary
    const totalSlotsInDB = await prisma.teacherScheduleSlot.count();
    console.log(`\n📊 Summary:`);
    console.log(`  - Total slots in database: ${totalSlotsInDB}`);
    console.log(`  - New slots created: ${totalSlots}`);
    console.log(`  - Recurring schedules: ${schedules.length}`);

    // Show next week's schedule
    console.log('\n📅 Next week preview:');
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(nextWeek);
      date.setDate(nextWeek.getDate() + i);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      const daySchedules = schedules.filter(schedule => 
        schedule.dayOfWeek === dayOfWeek
      );

      if (daySchedules.length > 0) {
        console.log(`\n${dayOfWeek} (${date.toLocaleDateString()}):`);
        daySchedules.forEach(schedule => {
          const time = schedule.startTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });
          console.log(`  - ${time} - ${schedule.serviceType.name}`);
        });
      }
    }

    console.log('\n🎉 Schedule seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding schedules:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedNext3WeeksSchedules()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
