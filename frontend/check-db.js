import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres.tyiexnwqmlsaxxndrnyk:pSfG5jEEEWtVdvRI@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function checkDatabase() {
  try {
    console.log('🔍 Checking remote database...');
    
    // Check teacher schedule slots
    const scheduleSlots = await prisma.teacherScheduleSlot.findMany({
      take: 5,
      include: {
        teacherSchedule: {
          include: {
            teacher: true,
            serviceType: true,
            venue: true
          }
        }
      }
    });
    
    console.log('📅 Teacher Schedule Slots:', scheduleSlots.length);
    scheduleSlots.forEach(slot => {
      console.log(`  - ${slot.startTime.toISOString()} | ${slot.teacherSchedule?.teacher?.name} | ${slot.teacherSchedule?.serviceType?.name}`);
    });
    
    // Check teacher schedules
    const teacherSchedules = await prisma.teacherSchedule.findMany({
      take: 5,
      include: {
        teacher: true,
        serviceType: true,
        venue: true
      }
    });
    
    console.log('👩‍🏫 Teacher Schedules:', teacherSchedules.length);
    teacherSchedules.forEach(schedule => {
      console.log(`  - ${schedule.dayOfWeek} ${schedule.startTime.toISOString()} | ${schedule.teacher?.name} | ${schedule.serviceType?.name}`);
    });
    
    // Check teachers
    const teachers = await prisma.teacher.findMany();
    console.log('👥 Teachers:', teachers.length);
    teachers.forEach(teacher => {
      console.log(`  - ${teacher.name} (${teacher.email})`);
    });
    
    // Check service types
    const serviceTypes = await prisma.serviceType.findMany();
    console.log('🧘 Service Types:', serviceTypes.length);
    serviceTypes.forEach(service => {
      console.log(`  - ${service.name} (${service.duration} min)`);
    });
    
    // Check venues
    const venues = await prisma.venue.findMany();
    console.log('🏢 Venues:', venues.length);
    venues.forEach(venue => {
      console.log(`  - ${venue.name} (${venue.city})`);
    });
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
