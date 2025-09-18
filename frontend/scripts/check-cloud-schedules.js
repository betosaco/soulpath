#!/usr/bin/env node

/**
 * Check Cloud Schedules Script
 * 
 * This script checks the current schedule data in the cloud database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.tyiexnwqmlsaxxndrnyk:pSfG5jEEEWtVdvRI@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function checkCloudSchedules() {
  console.log('🔍 Checking Cloud Database Schedules\n');
  console.log('===================================\n');

  try {
    // Get all teacher schedules
    const schedules = await prisma.teacherSchedule.findMany({
      include: {
        serviceType: { select: { name: true } }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });

    console.log(`📋 Found ${schedules.length} schedules in cloud database:\n`);

    for (const schedule of schedules) {
      const startTimeStr = schedule.startTime.toTimeString().slice(0, 5);
      console.log(`${schedule.dayOfWeek} ${startTimeStr}: ${schedule.serviceType?.name} (ID: ${schedule.serviceTypeId})`);
    }

    // Check what the correct assignments should be
    console.log('\n🎯 Expected Schedule:');
    console.log('Monday: 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha');
    console.log('Tuesday: 17:30 Hatha, 18:45 Vinyasa');
    console.log('Wednesday: 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha');
    console.log('Thursday: 17:30 Hatha, 18:45 Vinyasa');
    console.log('Friday: 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha');
    console.log('Saturday: 08:15 Hatha, 09:30 Vinyasa');

  } catch (error) {
    console.error('❌ Error checking cloud schedules:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkCloudSchedules();
