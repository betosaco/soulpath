import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres.tyiexnwqmlsaxxndrnyk:pSfG5jEEEWtVdvRI@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function addSundayData() {
  try {
    console.log('🔍 Adding Sunday (September 22nd) schedule slots...');
    
    // Get teacher schedules for Sunday
    const sundaySchedules = await prisma.teacherSchedule.findMany({
      where: {
        dayOfWeek: 'Sunday'
      },
      include: {
        teacher: true,
        serviceType: true,
        venue: true
      }
    });
    
    console.log('📅 Found Sunday schedules:', sundaySchedules.length);
    
    // Create schedule slots for Sunday, September 22nd
    const sundayDate = new Date('2025-09-22');
    const scheduleSlots = [];
    
    for (const schedule of sundaySchedules) {
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
    console.error('❌ Error adding Sunday data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSundayData();
