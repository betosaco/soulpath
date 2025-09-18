#!/usr/bin/env node

/**
 * Verify Schedule Script
 * 
 * This script verifies that the schedule times and yoga types are correct
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifySchedule() {
  console.log('🔍 Verifying Schedule Configuration\n');
  console.log('=====================================\n');

  try {
    // Get all teacher schedules
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

    console.log('📅 Current Schedule Configuration:\n');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (const day of days) {
      const daySchedules = schedules.filter(s => s.dayOfWeek === day);
      
      if (daySchedules.length > 0) {
        console.log(`📆 ${day}:`);
        
        for (const schedule of daySchedules) {
          // The times are stored as Time objects, not DateTime
          const startTime = schedule.startTime;
          const endTime = schedule.endTime;
          
          // Convert to EST (UTC - 5 hours)
          const startTimeStr = startTime.toTimeString().slice(0, 5);
          const endTimeStr = endTime.toTimeString().slice(0, 5);
          
          // The times are already in EST, no conversion needed
          const estStartTimeStr = startTimeStr;
          const estEndTimeStr = endTimeStr;
          
          console.log(`   ${estStartTimeStr} - ${estEndTimeStr} | ${schedule.serviceType?.name || 'Unknown'} | ${schedule.teacher?.name || 'Unknown'} | ${schedule.venue?.name || 'Unknown'}`);
        }
        console.log('');
      }
    }

    // Verify the specific requirements
    console.log('✅ Verification Results:\n');
    
    const hathaSchedules = schedules.filter(s => s.serviceType?.name === 'Hatha Yoga');
    const vinyasaSchedules = schedules.filter(s => s.serviceType?.name === 'Vinyasa Yoga');
    
    console.log(`📊 Total Schedules: ${schedules.length}`);
    console.log(`🧘 Hatha Yoga Classes: ${hathaSchedules.length}`);
    console.log(`🌊 Vinyasa Yoga Classes: ${vinyasaSchedules.length}`);
    
    // Check for the specific times
    const expectedTimes = ['08:15', '09:30', '17:30', '18:45'];
    const foundTimes = new Set();
    
    for (const schedule of schedules) {
      const startTimeStr = schedule.startTime.toTimeString().slice(0, 5);
      foundTimes.add(startTimeStr);
    }
    
    console.log('\n🕐 Schedule Times Found:');
    for (const time of expectedTimes) {
      const found = foundTimes.has(time);
      console.log(`   ${time}: ${found ? '✅' : '❌'}`);
    }
    
    // Check yoga type assignments
    console.log('\n🧘 Yoga Type Assignments:');
    const timeTypeMap = {
      '08:15': 'Hatha',
      '09:30': 'Vinyasa', 
      '17:30': 'Hatha',
      '18:45': 'Vinyasa'
    };
    
    for (const [time, expectedType] of Object.entries(timeTypeMap)) {
      const schedule = schedules.find(s => {
        const startTimeStr = s.startTime.toTimeString().slice(0, 5);
        return startTimeStr === time;
      });
      
      const actualType = schedule?.serviceType?.name || 'Not found';
      const isCorrect = actualType.includes(expectedType);
      console.log(`   ${time} (${expectedType}): ${isCorrect ? '✅' : '❌'} - ${actualType}`);
    }

    console.log('\n🎉 Schedule verification completed!');

  } catch (error) {
    console.error('❌ Error verifying schedule:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the verification
verifySchedule();
