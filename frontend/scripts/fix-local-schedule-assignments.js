#!/usr/bin/env node

/**
 * Fix Local Schedule Assignments Script
 * 
 * This script fixes the yoga type assignments in the local database
 * Based on the correct service type IDs: 1=Vinyasa, 2=Hatha
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixLocalScheduleAssignments() {
  console.log('🔧 Fixing Local Schedule Assignments\n');
  console.log('====================================\n');

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

    console.log('📋 Current schedule assignments:');
    for (const schedule of schedules) {
      const startTimeStr = schedule.startTime.toTimeString().slice(0, 5);
      console.log(`${schedule.dayOfWeek} ${startTimeStr}: ${schedule.serviceType?.name} (ID: ${schedule.serviceTypeId})`);
    }

    console.log('\n🔧 Updating schedule assignments...\n');

    // Update the schedules to have the correct yoga types
    // 08:15 should be Hatha (serviceTypeId: 2)
    // 09:30 should be Vinyasa (serviceTypeId: 1)  
    // 17:30 should be Hatha (serviceTypeId: 2)
    // 18:45 should be Vinyasa (serviceTypeId: 1)

    const updates = [
      // Monday schedules
      { id: 1, serviceTypeId: 2 }, // 08:15 Hatha
      { id: 2, serviceTypeId: 1 }, // 09:30 Vinyasa  
      { id: 3, serviceTypeId: 2 }, // 17:30 Hatha
      
      // Tuesday schedules
      { id: 4, serviceTypeId: 2 }, // 17:30 Hatha
      { id: 5, serviceTypeId: 1 }, // 18:45 Vinyasa
      
      // Wednesday schedules
      { id: 6, serviceTypeId: 2 }, // 08:15 Hatha
      { id: 7, serviceTypeId: 1 }, // 09:30 Vinyasa
      { id: 8, serviceTypeId: 2 }, // 17:30 Hatha
      
      // Thursday schedules
      { id: 9, serviceTypeId: 2 }, // 17:30 Hatha
      { id: 10, serviceTypeId: 1 }, // 18:45 Vinyasa
      
      // Friday schedules
      { id: 11, serviceTypeId: 2 }, // 08:15 Hatha
      { id: 12, serviceTypeId: 1 }, // 09:30 Vinyasa
      { id: 13, serviceTypeId: 2 }, // 17:30 Hatha
      
      // Saturday schedules
      { id: 14, serviceTypeId: 2 }, // 08:15 Hatha
      { id: 15, serviceTypeId: 1 }, // 09:30 Vinyasa
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

    console.log('\n📋 Updated schedule assignments:');
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
      console.log(`${schedule.dayOfWeek} ${startTimeStr}: ${schedule.serviceType?.name} (ID: ${schedule.serviceTypeId})`);
    }

    console.log('\n🎉 Local schedule assignments fixed successfully!');

  } catch (error) {
    console.error('❌ Error fixing local schedule assignments:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixLocalScheduleAssignments();
