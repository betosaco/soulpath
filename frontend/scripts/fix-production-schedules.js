#!/usr/bin/env node

/**
 * Fix Production Schedules Script
 * 
 * This script fixes the yoga type assignments in the production database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.tyiexnwqmlsaxxndrnyk:pSfG5jEEEWtVdvRI@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function fixProductionSchedules() {
  console.log('🔧 Fixing Production Schedule Yoga Types\n');
  console.log('========================================\n');

  try {
    // First, let's see what we have
    console.log('📋 Current production schedule assignments:');
    const schedules = await prisma.teacherSchedule.findMany({
      include: {
        serviceType: { select: { name: true } }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });

    for (const schedule of schedules) {
      const startTimeStr = schedule.startTime.toTimeString().slice(0, 5);
      console.log(`${schedule.dayOfWeek} ${startTimeStr}: ${schedule.serviceType?.name}`);
    }

    console.log('\n🔧 Updating schedule types to correct assignments...\n');

    // Update the schedules to have the correct yoga types
    // Based on the current data, we need to swap the serviceTypeId assignments
    // 08:15 should be Hatha (serviceTypeId: 2)
    // 09:30 should be Vinyasa (serviceTypeId: 1)  
    // 17:30 should be Hatha (serviceTypeId: 2)
    // 18:45 should be Vinyasa (serviceTypeId: 1)

    const updates = [
      // Monday schedules
      { id: 31, serviceTypeId: 2 }, // 08:15 Hatha
      { id: 32, serviceTypeId: 1 }, // 09:30 Vinyasa  
      { id: 33, serviceTypeId: 2 }, // 17:30 Hatha
      
      // Tuesday schedules
      { id: 34, serviceTypeId: 2 }, // 17:30 Hatha
      { id: 35, serviceTypeId: 1 }, // 18:45 Vinyasa
      
      // Wednesday schedules
      { id: 36, serviceTypeId: 2 }, // 08:15 Hatha
      { id: 37, serviceTypeId: 1 }, // 09:30 Vinyasa
      { id: 38, serviceTypeId: 2 }, // 17:30 Hatha
      
      // Thursday schedules
      { id: 39, serviceTypeId: 2 }, // 17:30 Hatha
      { id: 40, serviceTypeId: 1 }, // 18:45 Vinyasa
      
      // Friday schedules
      { id: 41, serviceTypeId: 2 }, // 08:15 Hatha
      { id: 42, serviceTypeId: 1 }, // 09:30 Vinyasa
      { id: 43, serviceTypeId: 2 }, // 17:30 Hatha
      
      // Saturday schedules
      { id: 44, serviceTypeId: 2 }, // 08:15 Hatha
      { id: 45, serviceTypeId: 1 }, // 09:30 Vinyasa
    ];

    for (const update of updates) {
      try {
        await prisma.teacherSchedule.update({
          where: { id: update.id },
          data: { serviceTypeId: update.serviceTypeId }
        });
        console.log(`✅ Updated schedule ${update.id} to serviceTypeId ${update.serviceTypeId}`);
      } catch (error) {
        console.log(`❌ Failed to update schedule ${update.id}: ${error.message}`);
      }
    }

    console.log('\n📋 Updated production schedule assignments:');
    const updatedSchedules = await prisma.teacherSchedule.findMany({
      include: {
        serviceType: { select: { name: true } }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });

    for (const schedule of updatedSchedules) {
      const startTimeStr = schedule.startTime.toTimeString().slice(0, 5);
      console.log(`${schedule.dayOfWeek} ${startTimeStr}: ${schedule.serviceType?.name}`);
    }

    console.log('\n🎉 Production schedule types fixed successfully!');

  } catch (error) {
    console.error('❌ Error fixing production schedule types:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixProductionSchedules();
