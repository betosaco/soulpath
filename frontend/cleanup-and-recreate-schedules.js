import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres.tyiexnwqmlsaxxndrnyk:pSfG5jEEEWtVdvRI@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function cleanupAndRecreateSchedules() {
  try {
    console.log('🧹 Cleaning up existing schedules...');
    
    // Delete all existing schedule slots
    const deletedSlots = await prisma.teacherScheduleSlot.deleteMany({});
    console.log('✅ Deleted schedule slots:', deletedSlots.count);
    
    // Delete all existing teacher schedules
    const deletedSchedules = await prisma.teacherSchedule.deleteMany({});
    console.log('✅ Deleted teacher schedules:', deletedSchedules.count);
    
    console.log('📅 Creating new schedules...');
    
    // Get teachers, service types, and venues
    const teachers = await prisma.teacher.findMany();
    const serviceTypes = await prisma.serviceType.findMany();
    const venues = await prisma.venue.findMany();
    
    console.log('👥 Teachers:', teachers.length);
    console.log('🧘 Service Types:', serviceTypes.length);
    console.log('🏢 Venues:', venues.length);
    
    if (teachers.length === 0 || serviceTypes.length === 0 || venues.length === 0) {
      console.error('❌ Missing required data (teachers, service types, or venues)');
      return;
    }
    
    const teacher = teachers[0]; // Use first teacher
    const serviceType = serviceTypes[0]; // Use first service type
    const venue = venues[0]; // Use first venue
    
    // Define the new schedule pattern
    const schedulePattern = {
      'Monday': ['13:15', '14:30', '22:30'],
      'Tuesday': ['22:30', '23:45'],
      'Wednesday': ['13:15', '14:30', '22:30'],
      'Thursday': ['22:30', '23:45'],
      'Friday': ['13:15', '14:30', '22:30']
      // Sunday: No schedule
    };
    
    // Create teacher schedules
    const teacherSchedules = [];
    
    for (const [dayOfWeek, times] of Object.entries(schedulePattern)) {
      for (const time of times) {
        const [hours, minutes] = time.split(':').map(Number);
        
        // Create start and end times (subtract 5 hours for local time)
        const startTime = new Date('1970-01-01T00:00:00Z');
        startTime.setUTCHours(hours - 5, minutes, 0, 0);
        
        const endTime = new Date('1970-01-01T00:00:00Z');
        endTime.setUTCHours(hours - 5 + 1, minutes, 0, 0); // 1 hour duration
        
        teacherSchedules.push({
          teacherId: teacher.id,
          venueId: venue.id,
          serviceTypeId: serviceType.id,
          dayOfWeek,
          startTime,
          endTime,
          isAvailable: true,
          maxBookings: 15
        });
      }
    }
    
    console.log(`📅 Creating ${teacherSchedules.length} teacher schedules...`);
    
    // Create the teacher schedules
    const createdSchedules = await prisma.teacherSchedule.createMany({
      data: teacherSchedules
    });
    
    console.log('✅ Created teacher schedules:', createdSchedules.count);
    
    // Now create schedule slots for the current week (Sept 15-22, 2025)
    const weekStart = new Date('2025-09-15');
    const weekEnd = new Date('2025-09-22');
    
    const scheduleSlots = [];
    
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + day);
      const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
      
      console.log(`📅 Processing ${dayName} ${currentDate.toISOString().split('T')[0]}`);
      
      // Find matching teacher schedules for this day
      const daySchedules = await prisma.teacherSchedule.findMany({
        where: {
          dayOfWeek: dayName
        }
      });
      
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
    const totalSchedules = await prisma.teacherSchedule.count();
    const totalSlots = await prisma.teacherScheduleSlot.count();
    
    console.log('📊 Final counts:');
    console.log('  Teacher schedules:', totalSchedules);
    console.log('  Schedule slots:', totalSlots);
    
    // Show the schedule pattern
    console.log('\n📅 New schedule pattern:');
    for (const [day, times] of Object.entries(schedulePattern)) {
      console.log(`  ${day}: ${times.join(', ')}`);
    }
    
  } catch (error) {
    console.error('❌ Error cleaning up and recreating schedules:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupAndRecreateSchedules();
