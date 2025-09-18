#!/usr/bin/env node

/**
 * Check Raw Schedule Data
 * 
 * This script checks the raw schedule data in the database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkRawSchedule() {
  console.log('🔍 Checking Raw Schedule Data\n');
  console.log('=============================\n');

  try {
    // Get all teacher schedules with raw data
    const schedules = await prisma.teacherSchedule.findMany({
      include: {
        teacher: { select: { name: true } },
        venue: { select: { name: true } },
        serviceType: { select: { name: true } }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });

    console.log('📅 Raw Schedule Data:\n');

    for (const schedule of schedules) {
      console.log(`ID: ${schedule.id}`);
      console.log(`Day: ${schedule.dayOfWeek}`);
      console.log(`Start Time (raw): ${schedule.startTime}`);
      console.log(`End Time (raw): ${schedule.endTime}`);
      console.log(`Start Time (string): ${schedule.startTime.toString()}`);
      console.log(`End Time (string): ${schedule.endTime.toString()}`);
      console.log(`Service Type: ${schedule.serviceType?.name || 'Unknown'}`);
      console.log(`Teacher: ${schedule.teacher?.name || 'Unknown'}`);
      console.log(`Venue: ${schedule.venue?.name || 'Unknown'}`);
      console.log('---');
    }

    // Check the first few schedules specifically
    console.log('\n🔍 First 3 Schedules Detail:\n');
    for (let i = 0; i < Math.min(3, schedules.length); i++) {
      const s = schedules[i];
      console.log(`Schedule ${i + 1}:`);
      console.log(`  Raw startTime: ${s.startTime}`);
      console.log(`  Raw endTime: ${s.endTime}`);
      console.log(`  Type of startTime: ${typeof s.startTime}`);
      console.log(`  Constructor: ${s.startTime.constructor.name}`);
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error checking raw schedule:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkRawSchedule();
