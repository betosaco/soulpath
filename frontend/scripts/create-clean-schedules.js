import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createCleanSchedules() {
  try {
    console.log('📅 Creating clean schedule setup...\n');

    // Get the teacher and venue
    const teacher = await prisma.teacher.findFirst({
      where: { name: { contains: 'Lucia' } }
    });
    
    const venue = await prisma.venue.findFirst({
      where: { name: { contains: 'MatMax' } }
    });

    if (!teacher || !venue) {
      console.error('❌ Teacher or venue not found');
      return;
    }

    console.log(`👩‍🏫 Using teacher: ${teacher.name} (ID: ${teacher.id})`);
    console.log(`🏢 Using venue: ${venue.name} (ID: ${venue.id})`);

    // Get service types
    const hathaYoga = await prisma.serviceType.findFirst({
      where: { name: { contains: 'Hatha' } }
    });
    
    const vinyasaYoga = await prisma.serviceType.findFirst({
      where: { name: { contains: 'Vinyasa' } }
    });

    if (!hathaYoga || !vinyasaYoga) {
      console.error('❌ Service types not found');
      return;
    }

    console.log(`🧘 Service types: ${hathaYoga.name} (ID: ${hathaYoga.id}), ${vinyasaYoga.name} (ID: ${vinyasaYoga.id})`);

    // Create clean schedules
    const schedules = [
      // Monday - 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha
      { dayOfWeek: 'Monday', startTime: '08:15', endTime: '09:15', serviceTypeId: hathaYoga.id, name: 'Monday 08:15 Hatha' },
      { dayOfWeek: 'Monday', startTime: '09:30', endTime: '10:30', serviceTypeId: vinyasaYoga.id, name: 'Monday 09:30 Vinyasa' },
      { dayOfWeek: 'Monday', startTime: '17:30', endTime: '18:30', serviceTypeId: hathaYoga.id, name: 'Monday 17:30 Hatha' },
      
      // Tuesday - 17:30 Hatha, 18:45 Vinyasa
      { dayOfWeek: 'Tuesday', startTime: '17:30', endTime: '18:30', serviceTypeId: hathaYoga.id, name: 'Tuesday 17:30 Hatha' },
      { dayOfWeek: 'Tuesday', startTime: '18:45', endTime: '19:45', serviceTypeId: vinyasaYoga.id, name: 'Tuesday 18:45 Vinyasa' },
      
      // Wednesday - 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha
      { dayOfWeek: 'Wednesday', startTime: '08:15', endTime: '09:15', serviceTypeId: hathaYoga.id, name: 'Wednesday 08:15 Hatha' },
      { dayOfWeek: 'Wednesday', startTime: '09:30', endTime: '10:30', serviceTypeId: vinyasaYoga.id, name: 'Wednesday 09:30 Vinyasa' },
      { dayOfWeek: 'Wednesday', startTime: '17:30', endTime: '18:30', serviceTypeId: hathaYoga.id, name: 'Wednesday 17:30 Hatha' },
      
      // Thursday - 17:30 Hatha, 18:45 Vinyasa
      { dayOfWeek: 'Thursday', startTime: '17:30', endTime: '18:30', serviceTypeId: hathaYoga.id, name: 'Thursday 17:30 Hatha' },
      { dayOfWeek: 'Thursday', startTime: '18:45', endTime: '19:45', serviceTypeId: vinyasaYoga.id, name: 'Thursday 18:45 Vinyasa' },
      
      // Friday - 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha
      { dayOfWeek: 'Friday', startTime: '08:15', endTime: '09:15', serviceTypeId: hathaYoga.id, name: 'Friday 08:15 Hatha' },
      { dayOfWeek: 'Friday', startTime: '09:30', endTime: '10:30', serviceTypeId: vinyasaYoga.id, name: 'Friday 09:30 Vinyasa' },
      { dayOfWeek: 'Friday', startTime: '17:30', endTime: '18:30', serviceTypeId: hathaYoga.id, name: 'Friday 17:30 Hatha' },
      
      // Saturday - 08:15 Hatha, 09:30 Vinyasa
      { dayOfWeek: 'Saturday', startTime: '08:15', endTime: '09:15', serviceTypeId: hathaYoga.id, name: 'Saturday 08:15 Hatha' },
      { dayOfWeek: 'Saturday', startTime: '09:30', endTime: '10:30', serviceTypeId: vinyasaYoga.id, name: 'Saturday 09:30 Vinyasa' },
      
      // Sunday - 08:30 Hatha, 09:40 Vinyasa (only these two times)
      { dayOfWeek: 'Sunday', startTime: '08:30', endTime: '09:30', serviceTypeId: hathaYoga.id, name: 'Sunday 08:30 Hatha' },
      { dayOfWeek: 'Sunday', startTime: '09:40', endTime: '10:40', serviceTypeId: vinyasaYoga.id, name: 'Sunday 09:40 Vinyasa' }
    ];

    console.log('\n📅 Creating recurring schedules...');
    
    for (const scheduleData of schedules) {
      const startTime = new Date(`1970-01-01T${scheduleData.startTime}:00Z`);
      const endTime = new Date(`1970-01-01T${scheduleData.endTime}:00Z`);
      
      const schedule = await prisma.teacherSchedule.create({
        data: {
          teacherId: teacher.id,
          venueId: venue.id,
          serviceTypeId: scheduleData.serviceTypeId,
          dayOfWeek: scheduleData.dayOfWeek,
          startTime: startTime,
          endTime: endTime,
          isAvailable: true,
          maxBookings: 15
        }
      });
      
      console.log(`✅ Created ${scheduleData.name} (ID: ${schedule.id})`);
    }

    console.log('\n🎉 Clean schedule setup completed!');
    
    // Show summary
    const totalSchedules = await prisma.teacherSchedule.count();
    const sundaySchedules = await prisma.teacherSchedule.count({
      where: { dayOfWeek: 'Sunday' }
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total schedules: ${totalSchedules}`);
    console.log(`   Sunday schedules: ${sundaySchedules}`);

  } catch (error) {
    console.error('❌ Error creating schedules:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createCleanSchedules()
  .then(() => {
    console.log('\n🎉 Schedule creation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Schedule creation failed:', error);
    process.exit(1);
  });
