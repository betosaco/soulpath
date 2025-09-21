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

async function checkScheduleData() {
  try {
    console.log('🔍 Checking schedule data in both databases...\n');
    
    // Check local database
    console.log('=== LOCAL DATABASE ===');
    const localScheduleTemplates = await localPrisma.scheduleTemplate.findMany();
    const localScheduleSlots = await localPrisma.scheduleSlot.findMany();
    const localTeacherSchedules = await localPrisma.teacherSchedule.findMany();
    const localTeacherScheduleSlots = await localPrisma.teacherScheduleSlot.findMany();
    
    console.log(`📅 Schedule Templates: ${localScheduleTemplates.length}`);
    console.log(`🕐 Schedule Slots: ${localScheduleSlots.length}`);
    console.log(`👨‍🏫 Teacher Schedules: ${localTeacherSchedules.length}`);
    console.log(`🎯 Teacher Schedule Slots: ${localTeacherScheduleSlots.length}`);
    
    if (localScheduleTemplates.length > 0) {
      console.log('\n📅 Local Schedule Templates:');
      localScheduleTemplates.forEach(template => {
        console.log(`  - ${template.dayOfWeek} ${template.startTime}-${template.endTime} (Venue: ${template.venueId})`);
      });
    }
    
    if (localTeacherScheduleSlots.length > 0) {
      console.log('\n🎯 Local Teacher Schedule Slots:');
      localTeacherScheduleSlots.forEach(slot => {
        console.log(`  - ${slot.startTime} (Available: ${slot.isAvailable})`);
      });
    }
    
    // Check production database
    console.log('\n=== PRODUCTION DATABASE ===');
    const prodScheduleTemplates = await productionPrisma.scheduleTemplate.findMany();
    const prodScheduleSlots = await productionPrisma.scheduleSlot.findMany();
    const prodTeacherSchedules = await productionPrisma.teacherSchedule.findMany();
    const prodTeacherScheduleSlots = await productionPrisma.teacherScheduleSlot.findMany();
    
    console.log(`📅 Schedule Templates: ${prodScheduleTemplates.length}`);
    console.log(`🕐 Schedule Slots: ${prodScheduleSlots.length}`);
    console.log(`👨‍🏫 Teacher Schedules: ${prodTeacherSchedules.length}`);
    console.log(`🎯 Teacher Schedule Slots: ${prodTeacherScheduleSlots.length}`);
    
    if (prodScheduleTemplates.length > 0) {
      console.log('\n📅 Production Schedule Templates:');
      prodScheduleTemplates.forEach(template => {
        console.log(`  - ${template.dayOfWeek} ${template.startTime}-${template.endTime} (Venue: ${template.venueId})`);
      });
    }
    
    if (prodTeacherScheduleSlots.length > 0) {
      console.log('\n🎯 Production Teacher Schedule Slots:');
      prodTeacherScheduleSlots.forEach(slot => {
        console.log(`  - ${slot.startTime} (Available: ${slot.isAvailable})`);
      });
    }
    
    // Check if we need to sync teacher schedules and slots
    if (localTeacherSchedules.length > 0 && prodTeacherSchedules.length === 0) {
      console.log('\n⚠️  Missing teacher schedules in production!');
    }
    
    if (localTeacherScheduleSlots.length > 0 && prodTeacherScheduleSlots.length === 0) {
      console.log('\n⚠️  Missing teacher schedule slots in production!');
    }
    
  } catch (error) {
    console.error('❌ Error checking schedule data:', error);
  } finally {
    await localPrisma.$disconnect();
    await productionPrisma.$disconnect();
  }
}

checkScheduleData();
