#!/usr/bin/env node

/**
 * Generate Cloud Schedule Slots Script
 * 
 * This script generates specific schedule slots for the cloud database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.tyiexnwqmlsaxxndrnyk:pSfG5jEEEWtVdvRI@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function generateCloudSlots() {
  console.log('📅 Generating Cloud Schedule Slots\n');
  console.log('=================================\n');

  try {
    // Delete existing schedule slots
    console.log('🗑️ Deleting existing schedule slots...');
    await prisma.teacherScheduleSlot.deleteMany({});
    console.log('✅ Existing schedule slots deleted');

    // Get teacher schedules
    const teacherSchedules = await prisma.teacherSchedule.findMany({
      include: {
        teacher: { select: { name: true } },
        venue: { select: { name: true } },
        serviceType: { select: { name: true } }
      }
    });

    console.log(`📋 Found ${teacherSchedules.length} teacher schedules`);

    // Generate slots for the next 30 days
    const today = new Date();
    const slots = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Find schedules for this day of the week
      const daySchedules = teacherSchedules.filter(schedule => 
        schedule.dayOfWeek === dayOfWeek
      );

      for (const schedule of daySchedules) {
        // Create the slot
        const slot = {
          teacherScheduleId: schedule.id,
          startTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 
            schedule.startTime.getHours(), schedule.startTime.getMinutes()),
          endTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 
            schedule.endTime.getHours(), schedule.endTime.getMinutes()),
          isAvailable: schedule.isAvailable,
          bookedCount: 0,
          maxBookings: schedule.maxBookings
        };

        slots.push(slot);
      }
    }

    console.log(`📅 Generated ${slots.length} schedule slots for the next 30 days`);

    // Insert slots into database
    console.log('💾 Inserting slots into database...');
    for (const slot of slots) {
      await prisma.teacherScheduleSlot.create({
        data: slot
      });
    }

    console.log(`✅ Inserted ${slots.length} schedule slots`);

    // Verify the results
    console.log('\n📋 Sample schedule slots:');
    const sampleSlots = await prisma.teacherScheduleSlot.findMany({
      include: {
        teacherSchedule: {
          include: {
            teacher: { select: { name: true } },
            serviceType: { select: { name: true } }
          }
        }
      },
      orderBy: { startTime: 'asc' },
      take: 10
    });

    for (const slot of sampleSlots) {
      const dateStr = slot.startTime.toISOString().split('T')[0];
      const timeStr = slot.startTime.toTimeString().slice(0, 5);
      console.log(`${dateStr} ${timeStr} - ${slot.teacherSchedule.serviceType.name} (${slot.teacherSchedule.teacher.name})`);
    }

    console.log('\n🎉 Cloud schedule slots generated successfully!');

  } catch (error) {
    console.error('❌ Error generating cloud slots:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the generation
generateCloudSlots();
