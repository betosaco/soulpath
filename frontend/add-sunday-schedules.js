import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres.tyiexnwqmlsaxxndrnyk:pSfG5jEEEWtVdvRI@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function addSundaySchedules() {
  try {
    console.log('🔍 Adding Sunday teacher schedules...');
    
    // Get existing teacher schedules to copy for Sunday
    const existingSchedules = await prisma.teacherSchedule.findMany({
      where: {
        dayOfWeek: 'Monday' // Use Monday as template
      },
      include: {
        teacher: true,
        serviceType: true,
        venue: true
      }
    });
    
    console.log('📅 Found Monday schedules to copy:', existingSchedules.length);
    
    // Create Sunday schedules based on Monday schedules
    const sundaySchedules = existingSchedules.map(schedule => ({
      teacherId: schedule.teacherId,
      venueId: schedule.venueId,
      serviceTypeId: schedule.serviceTypeId,
      dayOfWeek: 'Sunday',
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      isAvailable: true,
      maxBookings: schedule.maxBookings
    }));
    
    console.log(`📅 Creating ${sundaySchedules.length} Sunday schedules...`);
    
    // Create the Sunday schedules
    const createdSchedules = await prisma.teacherSchedule.createMany({
      data: sundaySchedules
    });
    
    console.log('✅ Created Sunday schedules:', createdSchedules.count);
    
    // Now create schedule slots for Sunday
    const newSundaySchedules = await prisma.teacherSchedule.findMany({
      where: {
        dayOfWeek: 'Sunday'
      }
    });
    
    const sundayDate = new Date('2025-09-22');
    const scheduleSlots = [];
    
    for (const schedule of newSundaySchedules) {
      const startTime = new Date(sundayDate);
      startTime.setHours(schedule.startTime.getUTCHours(), schedule.startTime.getUTCMinutes(), 0, 0);
      
      const endTime = new Date(sundayDate);
      endTime.setHours(schedule.endTime.getUTCHours(), schedule.endTime.getUTCMinutes(), 0, 0);
      
      scheduleSlots.push({
        teacherScheduleId: schedule.id,
        startTime,
        endTime,
        isAvailable: true,
        bookedCount: 0,
        maxBookings: 15
      });
    }
    
    console.log(`📅 Creating ${scheduleSlots.length} Sunday schedule slots...`);
    
    // Create the schedule slots
    const createdSlots = await prisma.teacherScheduleSlot.createMany({
      data: scheduleSlots
    });
    
    console.log('✅ Created Sunday schedule slots:', createdSlots.count);
    
    // Verify the data
    const totalSlots = await prisma.teacherScheduleSlot.count();
    console.log('📊 Total schedule slots in database:', totalSlots);
    
  } catch (error) {
    console.error('❌ Error adding Sunday schedules:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSundaySchedules();
