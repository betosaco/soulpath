#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

// Create two Prisma clients - one for local, one for production
const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:@localhost:5432/wellness_db"
    }
  }
});

const productionPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.tyiexnwqmlsaxxndrnyk:pSfG5jEEEWtVdvRI@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function syncTeacherSchedules() {
  try {
    console.log('🔄 Starting teacher schedules sync...');
    
    const localTeacherSchedules = await localPrisma.teacherSchedule.findMany();
    console.log(`👨‍🏫 Found ${localTeacherSchedules.length} teacher schedules in local database`);
    
    if (localTeacherSchedules.length > 0) {
      // Clear existing teacher schedules in production
      await productionPrisma.teacherSchedule.deleteMany({});
      
      for (const schedule of localTeacherSchedules) {
        console.log(`➕ Syncing teacher schedule: ${schedule.id}`);
        await productionPrisma.teacherSchedule.create({
          data: schedule
        });
      }
      
      console.log('✅ Teacher schedules sync completed!');
    }
  } catch (error) {
    console.error('❌ Error syncing teacher schedules:', error);
  }
}

async function syncTeacherScheduleSlots() {
  try {
    console.log('🔄 Starting teacher schedule slots sync...');
    
    const localTeacherScheduleSlots = await localPrisma.teacherScheduleSlot.findMany();
    console.log(`🎯 Found ${localTeacherScheduleSlots.length} teacher schedule slots in local database`);
    
    if (localTeacherScheduleSlots.length > 0) {
      // Clear existing teacher schedule slots in production
      await productionPrisma.teacherScheduleSlot.deleteMany({});
      
      for (const slot of localTeacherScheduleSlots) {
        console.log(`➕ Syncing teacher schedule slot: ${slot.id}`);
        await productionPrisma.teacherScheduleSlot.create({
          data: slot
        });
      }
      
      console.log('✅ Teacher schedule slots sync completed!');
    }
  } catch (error) {
    console.error('❌ Error syncing teacher schedule slots:', error);
  }
}

async function main() {
  console.log('🚀 Starting teacher schedule data sync...');
  
  await syncTeacherSchedules();
  await syncTeacherScheduleSlots();
  
  console.log('🎉 Teacher schedule data sync completed!');
  
  await localPrisma.$disconnect();
  await productionPrisma.$disconnect();
}

main().catch(console.error);
