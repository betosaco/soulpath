// Debug script to check schedule data
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugSchedule() {
  console.log('🔍 Debugging Schedule Data...\n');
  
  // Check current week slots
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(today.getDate() - daysToMonday);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  
  console.log('📅 Current week range:');
  console.log(`  Start: ${startOfWeek.toISOString().split('T')[0]}`);
  console.log(`  End: ${endOfWeek.toISOString().split('T')[0]}\n`);
  
  const slots = await prisma.teacherScheduleSlot.findMany({
    where: {
      startTime: {
        gte: startOfWeek,
        lt: endOfWeek
      }
    },
    include: {
      teacherSchedule: {
        include: { serviceType: true }
      }
    },
    orderBy: { startTime: 'asc' }
  });
  
  console.log(`📊 Found ${slots.length} schedule slots:\n`);
  
  const dayGroups = {};
  
  slots.forEach(slot => {
    const date = slot.startTime.toISOString().split('T')[0];
    const time = slot.startTime.toTimeString().split(' ')[0].substring(0, 5);
    const actualDay = new Date(slot.startTime).toLocaleDateString('en-US', { weekday: 'long' });
    
    if (!dayGroups[actualDay]) {
      dayGroups[actualDay] = [];
    }
    
    dayGroups[actualDay].push({
      date,
      time,
      service: slot.teacherSchedule.serviceType?.name
    });
  });
  
  // Display by day
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  daysOrder.forEach(day => {
    if (dayGroups[day]) {
      console.log(`${day}:`);
      dayGroups[day].forEach(slot => {
        console.log(`  ${slot.date} ${slot.time} - ${slot.service}`);
      });
      console.log('');
    }
  });
  
  // Check for Sunday specifically
  if (dayGroups['Sunday']) {
    console.log('⚠️  WARNING: Sunday slots found!');
    console.log('   This should not happen according to the specification.');
  } else {
    console.log('✅ No Sunday slots found (correct)');
  }
  
  await prisma.$disconnect();
}

debugSchedule().catch(console.error);
