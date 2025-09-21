import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateSchedulePattern() {
  try {
    console.log('🔄 Updating schedule pattern...');

    // Get required data
    const luciaMeza = await prisma.teacher.findFirst({ where: { name: 'Lucia Meza' } });
    const venue = await prisma.venue.findFirst({ where: { name: 'MatMax Yoga Studio' } });
    const hathaYoga = await prisma.serviceType.findFirst({ where: { name: 'Hatha Yoga' } });
    const vinyasaYoga = await prisma.serviceType.findFirst({ where: { name: 'Vinyasa Yoga' } });

    if (!luciaMeza || !venue || !hathaYoga || !vinyasaYoga) {
      console.error('❌ Required teacher, venue, or service types not found');
      return;
    }

    // Delete all existing schedules
    await prisma.teacherSchedule.deleteMany({});
    console.log('✅ Deleted all existing schedules');

    // Create new schedule pattern
    const newSchedules = [
      // Monday - 08:30 Hatha, 09:45 Vinyasa (same as Friday)
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: hathaYoga.id,
        dayOfWeek: 'Monday',
        startTime: new Date('1970-01-01T08:30:00Z'), // 08:30 EST
        endTime: new Date('1970-01-01T09:30:00Z'), // 09:30 EST
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: vinyasaYoga.id,
        dayOfWeek: 'Monday',
        startTime: new Date('1970-01-01T09:45:00Z'), // 09:45 EST
        endTime: new Date('1970-01-01T10:45:00Z'), // 10:45 EST
        isAvailable: true,
        maxBookings: 15
      },
      // Tuesday - 17:30 Hatha, 18:45 Vinyasa (same as Thursday)
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: hathaYoga.id,
        dayOfWeek: 'Tuesday',
        startTime: new Date('1970-01-01T17:30:00Z'), // 17:30 EST
        endTime: new Date('1970-01-01T18:30:00Z'), // 18:30 EST
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: vinyasaYoga.id,
        dayOfWeek: 'Tuesday',
        startTime: new Date('1970-01-01T18:45:00Z'), // 18:45 EST
        endTime: new Date('1970-01-01T19:45:00Z'), // 19:45 EST
        isAvailable: true,
        maxBookings: 15
      },
      // Wednesday - 08:30 Hatha, 09:45 Vinyasa (same as Friday)
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: hathaYoga.id,
        dayOfWeek: 'Wednesday',
        startTime: new Date('1970-01-01T08:30:00Z'), // 08:30 EST
        endTime: new Date('1970-01-01T09:30:00Z'), // 09:30 EST
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: vinyasaYoga.id,
        dayOfWeek: 'Wednesday',
        startTime: new Date('1970-01-01T09:45:00Z'), // 09:45 EST
        endTime: new Date('1970-01-01T10:45:00Z'), // 10:45 EST
        isAvailable: true,
        maxBookings: 15
      },
      // Thursday - 17:30 Hatha, 18:45 Vinyasa
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: hathaYoga.id,
        dayOfWeek: 'Thursday',
        startTime: new Date('1970-01-01T17:30:00Z'), // 17:30 EST
        endTime: new Date('1970-01-01T18:30:00Z'), // 18:30 EST
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: vinyasaYoga.id,
        dayOfWeek: 'Thursday',
        startTime: new Date('1970-01-01T18:45:00Z'), // 18:45 EST
        endTime: new Date('1970-01-01T19:45:00Z'), // 19:45 EST
        isAvailable: true,
        maxBookings: 15
      },
      // Friday - 08:30 Hatha, 09:45 Vinyasa (removed 17:30)
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: hathaYoga.id,
        dayOfWeek: 'Friday',
        startTime: new Date('1970-01-01T08:30:00Z'), // 08:30 EST
        endTime: new Date('1970-01-01T09:30:00Z'), // 09:30 EST
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: vinyasaYoga.id,
        dayOfWeek: 'Friday',
        startTime: new Date('1970-01-01T09:45:00Z'), // 09:45 EST
        endTime: new Date('1970-01-01T10:45:00Z'), // 10:45 EST
        isAvailable: true,
        maxBookings: 15
      },
      // Saturday - 08:30 Hatha, 09:45 Vinyasa (only these two times)
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: hathaYoga.id,
        dayOfWeek: 'Saturday',
        startTime: new Date('1970-01-01T08:30:00Z'), // 08:30 EST
        endTime: new Date('1970-01-01T09:30:00Z'), // 09:30 EST
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: luciaMeza.id,
        venueId: venue.id,
        serviceTypeId: vinyasaYoga.id,
        dayOfWeek: 'Saturday',
        startTime: new Date('1970-01-01T09:45:00Z'), // 09:45 EST
        endTime: new Date('1970-01-01T10:45:00Z'), // 10:45 EST
        isAvailable: true,
        maxBookings: 15
      }
      // Sunday - No classes (removed all Sunday schedules)
    ];

    // Create the new schedules
    const createdSchedules = await prisma.teacherSchedule.createMany({
      data: newSchedules
    });

    console.log(`✅ Created ${createdSchedules.count} new schedules`);

    // Show summary
    const schedules = await prisma.teacherSchedule.findMany({
      include: {
        serviceType: true
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });

    console.log('\n📅 New schedule pattern:');
    const dayGroups = {};
    schedules.forEach(schedule => {
      if (!dayGroups[schedule.dayOfWeek]) {
        dayGroups[schedule.dayOfWeek] = [];
      }
      const time = schedule.startTime.toTimeString().slice(0, 5);
      dayGroups[schedule.dayOfWeek].push(`${time} - ${schedule.serviceType.name}`);
    });

    Object.keys(dayGroups).sort().forEach(day => {
      console.log(`\n${day}:`);
      dayGroups[day].forEach(slot => {
        console.log(`  - ${slot}`);
      });
    });

    console.log('\n🎉 Schedule pattern updated successfully!');

  } catch (error) {
    console.error('❌ Error updating schedule pattern:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateSchedulePattern()
  .then(() => {
    console.log('\n✅ Schedule pattern update completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Schedule pattern update failed:', error);
    process.exit(1);
  });
