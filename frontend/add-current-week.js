import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres.tyiexnwqmlsaxxndrnyk:pSfG5jEEEWtVdvRI@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function addCurrentWeekSlots() {
  try {
    console.log('🔍 Adding current week schedule slots...');
    
    // Get the current week dates
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(today.getDate() - daysToMonday);
    
    console.log('📅 Current week starts:', startOfWeek.toISOString().split('T')[0]);
    
    // Get teacher schedules
    const teacherSchedules = await prisma.teacherSchedule.findMany({
      include: {
        teacher: true,
        serviceType: true,
        venue: true
      }
    });
    
    console.log('👩‍🏫 Found teacher schedules:', teacherSchedules.length);
    
    // Create schedule slots for the current week
    const scheduleSlots = [];
    
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + day);
      const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
      
      console.log(`📅 Processing ${dayName} ${currentDate.toISOString().split('T')[0]}`);
      
      // Find matching teacher schedules for this day
      const daySchedules = teacherSchedules.filter(schedule => schedule.dayOfWeek === dayName);
      
      for (const schedule of daySchedules) {
        const startTime = new Date(currentDate);
        startTime.setHours(schedule.startTime.getUTCHours(), schedule.startTime.getUTCMinutes(), 0, 0);
        
        const endTime = new Date(currentDate);
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
    }
    
    console.log(`📅 Creating ${scheduleSlots.length} schedule slots...`);
    
    // Create the schedule slots
    const createdSlots = await prisma.teacherScheduleSlot.createMany({
      data: scheduleSlots
    });
    
    console.log('✅ Created schedule slots:', createdSlots.count);
    
    // Verify the data
    const totalSlots = await prisma.teacherScheduleSlot.count();
    console.log('📊 Total schedule slots in database:', totalSlots);
    
  } catch (error) {
    console.error('❌ Error adding current week slots:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addCurrentWeekSlots();
