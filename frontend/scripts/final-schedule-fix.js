import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function finalScheduleFix() {
  try {
    console.log('🔄 Final schedule fix - storing EST times correctly and removing Sunday slots...');

    // Get required data
    const luciaMeza = await prisma.teacher.findFirst({ where: { name: 'Lucia Meza' } });
    const venue = await prisma.venue.findFirst({ where: { name: 'MatMax Yoga Studio' } });
    const hathaYoga = await prisma.serviceType.findFirst({ where: { name: 'Hatha Yoga' } });
    const vinyasaYoga = await prisma.serviceType.findFirst({ where: { name: 'Vinyasa Yoga' } });

    if (!luciaMeza || !venue || !hathaYoga || !vinyasaYoga) {
      console.error('❌ Required teacher, venue, or service types not found');
      return;
    }

    // Delete all existing schedules and slots
    await prisma.teacherScheduleSlot.deleteMany({});
    console.log('✅ Deleted all existing schedule slots');
    
    await prisma.teacherSchedule.deleteMany({});
    console.log('✅ Deleted all existing schedules');

    // Create new schedule pattern with correct EST times stored as UTC
    // EST to UTC conversion: EST = UTC - 5 hours, so EST 08:15 = UTC 13:15
    const newSchedules = [
      // Monday - 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: hathaYoga.id,
        dayOfWeek: 'Monday',
        startTime: new Date('1970-01-01T13:15:00Z'), // 08:15 EST = 13:15 UTC
        endTime: new Date('1970-01-01T14:15:00Z'), // 09:15 EST = 14:15 UTC
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: vinyasaYoga.id,
        dayOfWeek: 'Monday',
        startTime: new Date('1970-01-01T14:30:00Z'), // 09:30 EST = 14:30 UTC
        endTime: new Date('1970-01-01T15:30:00Z'), // 10:30 EST = 15:30 UTC
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: hathaYoga.id,
        dayOfWeek: 'Monday',
        startTime: new Date('1970-01-01T22:30:00Z'), // 17:30 EST = 22:30 UTC
        endTime: new Date('1970-01-01T23:30:00Z'), // 18:30 EST = 23:30 UTC
        isAvailable: true,
        maxBookings: 15
      },
      // Tuesday - 17:30 Hatha, 18:45 Vinyasa
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: hathaYoga.id,
        dayOfWeek: 'Tuesday',
        startTime: new Date('1970-01-01T22:30:00Z'), // 17:30 EST = 22:30 UTC
        endTime: new Date('1970-01-01T23:30:00Z'), // 18:30 EST = 23:30 UTC
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: vinyasaYoga.id,
        dayOfWeek: 'Tuesday',
        startTime: new Date('1970-01-01T23:45:00Z'), // 18:45 EST = 23:45 UTC
        endTime: new Date('1970-01-02T00:45:00Z'), // 19:45 EST = 00:45 UTC (next day)
        isAvailable: true,
        maxBookings: 15
      },
      // Wednesday - 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: hathaYoga.id,
        dayOfWeek: 'Wednesday',
        startTime: new Date('1970-01-01T13:15:00Z'), // 08:15 EST = 13:15 UTC
        endTime: new Date('1970-01-01T14:15:00Z'), // 09:15 EST = 14:15 UTC
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: vinyasaYoga.id,
        dayOfWeek: 'Wednesday',
        startTime: new Date('1970-01-01T14:30:00Z'), // 09:30 EST = 14:30 UTC
        endTime: new Date('1970-01-01T15:30:00Z'), // 10:30 EST = 15:30 UTC
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: hathaYoga.id,
        dayOfWeek: 'Wednesday',
        startTime: new Date('1970-01-01T22:30:00Z'), // 17:30 EST = 22:30 UTC
        endTime: new Date('1970-01-01T23:30:00Z'), // 18:30 EST = 23:30 UTC
        isAvailable: true,
        maxBookings: 15
      },
      // Thursday - 17:30 Hatha, 18:45 Vinyasa
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: hathaYoga.id,
        dayOfWeek: 'Thursday',
        startTime: new Date('1970-01-01T22:30:00Z'), // 17:30 EST = 22:30 UTC
        endTime: new Date('1970-01-01T23:30:00Z'), // 18:30 EST = 23:30 UTC
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: vinyasaYoga.id,
        dayOfWeek: 'Thursday',
        startTime: new Date('1970-01-01T23:45:00Z'), // 18:45 EST = 23:45 UTC
        endTime: new Date('1970-01-02T00:45:00Z'), // 19:45 EST = 00:45 UTC (next day)
        isAvailable: true,
        maxBookings: 15
      },
      // Friday - 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: hathaYoga.id,
        dayOfWeek: 'Friday',
        startTime: new Date('1970-01-01T13:15:00Z'), // 08:15 EST = 13:15 UTC
        endTime: new Date('1970-01-01T14:15:00Z'), // 09:15 EST = 14:15 UTC
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: vinyasaYoga.id,
        dayOfWeek: 'Friday',
        startTime: new Date('1970-01-01T14:30:00Z'), // 09:30 EST = 14:30 UTC
        endTime: new Date('1970-01-01T15:30:00Z'), // 10:30 EST = 15:30 UTC
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: hathaYoga.id,
        dayOfWeek: 'Friday',
        startTime: new Date('1970-01-01T22:30:00Z'), // 17:30 EST = 22:30 UTC
        endTime: new Date('1970-01-01T23:30:00Z'), // 18:30 EST = 23:30 UTC
        isAvailable: true,
        maxBookings: 15
      },
      // Saturday - 08:30 Hatha, 09:45 Vinyasa
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: hathaYoga.id,
        dayOfWeek: 'Saturday',
        startTime: new Date('1970-01-01T13:30:00Z'), // 08:30 EST = 13:30 UTC
        endTime: new Date('1970-01-01T14:30:00Z'), // 09:30 EST = 14:30 UTC
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: vinyasaYoga.id,
        dayOfWeek: 'Saturday',
        startTime: new Date('1970-01-01T14:45:00Z'), // 09:45 EST = 14:45 UTC
        endTime: new Date('1970-01-01T15:45:00Z'), // 10:45 EST = 15:45 UTC
        isAvailable: true,
        maxBookings: 15
      }
      // Sunday - No classes (completely removed)
    ];

    // Create the new schedules
    const createdSchedules = await prisma.teacherSchedule.createMany({
      data: newSchedules
    });

    console.log(`✅ Created ${createdSchedules.count} new schedules`);

    // Generate 12 weeks of slots for each schedule (12 slots per class)
    console.log('📅 Generating 12 weeks of schedule slots...');
    
    const schedules = await prisma.teacherSchedule.findMany({
      include: {
        teacher: true,
        serviceType: true,
        venue: true
      }
    });

    const slots = [];
    const today = new Date();
    
    // Generate slots for the next 12 weeks (84 days)
    for (let i = 0; i < 84; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Skip Sunday completely
      if (dayOfWeek === 'Sunday') {
        continue;
      }
      
      // Find schedules for this day of the week
      const daySchedules = schedules.filter(schedule => 
        schedule.dayOfWeek === dayOfWeek
      );

      for (const schedule of daySchedules) {
        // Get the time from the schedule (stored in UTC)
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

    // Verify no Sunday slots
    const sundaySlots = await prisma.teacherScheduleSlot.findMany({
      where: {
        teacherSchedule: {
          dayOfWeek: 'Sunday'
        }
      }
    });
    console.log(`\n🚫 Sunday slots: ${sundaySlots.length} (should be 0)`);

    console.log('\n🎉 Final schedule fix completed!');

  } catch (error) {
    console.error('❌ Error in final schedule fix:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

finalScheduleFix()
  .then(() => {
    console.log('\n✅ Final schedule fix completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Final schedule fix failed:', error);
    process.exit(1);
  });
