#!/usr/bin/env node

/**
 * Fix Local Schedules Script
 * 
 * This script fixes the yoga type assignments in the local database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixLocalSchedules() {
  console.log('🔧 Fixing Local Schedule Yoga Types\n');
  console.log('===================================\n');

  try {
    // Delete all existing teacher schedules
    console.log('🗑️ Deleting all existing schedules...');
    await prisma.teacherSchedule.deleteMany({});
    console.log('✅ All existing schedules deleted');

    // Get teacher and venue IDs
    const teacher = await prisma.teacher.findFirst({
      where: { name: { contains: 'Lucia' } }
    });
    const venue = await prisma.venue.findFirst({
      where: { name: { contains: 'MatMax' } }
    });

    if (!teacher || !venue) {
      throw new Error('Teacher or venue not found');
    }

    console.log(`👩‍🏫 Teacher: ${teacher.name} (ID: ${teacher.id})`);
    console.log(`🏢 Venue: ${venue.name} (ID: ${venue.id})`);

    // Create the correct schedules
    console.log('\n📅 Creating correct schedules...');
    const schedules = [
      // Monday - 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha
      {
        teacherId: teacher.id,
        venueId: venue.id,
        serviceTypeId: 2, // Hatha Yoga (ID 2)
        dayOfWeek: 'Monday',
        startTime: new Date('1970-01-01T13:15:00Z'), // 08:15 EST = 13:15 UTC
        endTime: new Date('1970-01-01T14:15:00Z'), // 09:15 EST = 14:15 UTC
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: teacher.id,
        venueId: venue.id,
        serviceTypeId: 1, // Vinyasa Yoga (ID 1)
        dayOfWeek: 'Monday',
        startTime: new Date('1970-01-01T14:30:00Z'), // 09:30 EST = 14:30 UTC
        endTime: new Date('1970-01-01T15:30:00Z'), // 10:30 EST = 15:30 UTC
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: teacher.id,
        venueId: venue.id,
        serviceTypeId: 2, // Hatha Yoga (ID 2)
        dayOfWeek: 'Monday',
        startTime: new Date('1970-01-01T22:30:00Z'), // 17:30 EST = 22:30 UTC
        endTime: new Date('1970-01-01T23:30:00Z'), // 18:30 EST = 23:30 UTC
        isAvailable: true,
        maxBookings: 15
      },

      // Tuesday - 17:30 Hatha, 18:45 Vinyasa
      {
        teacherId: teacher.id,
        venueId: venue.id,
        serviceTypeId: 2, // Hatha Yoga (ID 2)
        dayOfWeek: 'Tuesday',
        startTime: new Date('1970-01-01T22:30:00Z'), // 17:30 EST = 22:30 UTC
        endTime: new Date('1970-01-01T23:30:00Z'), // 18:30 EST = 23:30 UTC
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: teacher.id,
        venueId: venue.id,
        serviceTypeId: 1, // Vinyasa Yoga (ID 1)
        dayOfWeek: 'Tuesday',
        startTime: new Date('1970-01-01T23:45:00Z'), // 18:45 EST = 23:45 UTC
        endTime: new Date('1970-01-02T00:45:00Z'), // 19:45 EST = 00:45 UTC (next day)
        isAvailable: true,
        maxBookings: 15
      },

      // Wednesday - 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha
      {
        teacherId: teacher.id,
        venueId: venue.id,
        serviceTypeId: 2, // Hatha Yoga (ID 2)
        dayOfWeek: 'Wednesday',
        startTime: new Date('1970-01-01T13:15:00Z'), // 08:15 EST = 13:15 UTC
        endTime: new Date('1970-01-01T14:15:00Z'), // 09:15 EST = 14:15 UTC
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: teacher.id,
        venueId: venue.id,
        serviceTypeId: 1, // Vinyasa Yoga (ID 1)
        dayOfWeek: 'Wednesday',
        startTime: new Date('1970-01-01T14:30:00Z'), // 09:30 EST = 14:30 UTC
        endTime: new Date('1970-01-01T15:30:00Z'), // 10:30 EST = 15:30 UTC
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: teacher.id,
        venueId: venue.id,
        serviceTypeId: 2, // Hatha Yoga (ID 2)
        dayOfWeek: 'Wednesday',
        startTime: new Date('1970-01-01T22:30:00Z'), // 17:30 EST = 22:30 UTC
        endTime: new Date('1970-01-01T23:30:00Z'), // 18:30 EST = 23:30 UTC
        isAvailable: true,
        maxBookings: 15
      },

      // Thursday - 17:30 Hatha, 18:45 Vinyasa
      {
        teacherId: teacher.id,
        venueId: venue.id,
        serviceTypeId: 2, // Hatha Yoga (ID 2)
        dayOfWeek: 'Thursday',
        startTime: new Date('1970-01-01T22:30:00Z'), // 17:30 EST = 22:30 UTC
        endTime: new Date('1970-01-01T23:30:00Z'), // 18:30 EST = 23:30 UTC
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: teacher.id,
        venueId: venue.id,
        serviceTypeId: 1, // Vinyasa Yoga (ID 1)
        dayOfWeek: 'Thursday',
        startTime: new Date('1970-01-01T23:45:00Z'), // 18:45 EST = 23:45 UTC
        endTime: new Date('1970-01-02T00:45:00Z'), // 19:45 EST = 00:45 UTC (next day)
        isAvailable: true,
        maxBookings: 15
      },

      // Friday - 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha
      {
        teacherId: teacher.id,
        venueId: venue.id,
        serviceTypeId: 2, // Hatha Yoga (ID 2)
        dayOfWeek: 'Friday',
        startTime: new Date('1970-01-01T13:15:00Z'), // 08:15 EST = 13:15 UTC
        endTime: new Date('1970-01-01T14:15:00Z'), // 09:15 EST = 14:15 UTC
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: teacher.id,
        venueId: venue.id,
        serviceTypeId: 1, // Vinyasa Yoga (ID 1)
        dayOfWeek: 'Friday',
        startTime: new Date('1970-01-01T14:30:00Z'), // 09:30 EST = 14:30 UTC
        endTime: new Date('1970-01-01T15:30:00Z'), // 10:30 EST = 15:30 UTC
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: teacher.id,
        venueId: venue.id,
        serviceTypeId: 2, // Hatha Yoga (ID 2)
        dayOfWeek: 'Friday',
        startTime: new Date('1970-01-01T22:30:00Z'), // 17:30 EST = 22:30 UTC
        endTime: new Date('1970-01-01T23:30:00Z'), // 18:30 EST = 23:30 UTC
        isAvailable: true,
        maxBookings: 15
      },

      // Saturday - 08:15 Hatha, 09:30 Vinyasa
      {
        teacherId: teacher.id,
        venueId: venue.id,
        serviceTypeId: 2, // Hatha Yoga (ID 2)
        dayOfWeek: 'Saturday',
        startTime: new Date('1970-01-01T13:15:00Z'), // 08:15 EST = 13:15 UTC
        endTime: new Date('1970-01-01T14:15:00Z'), // 09:15 EST = 14:15 UTC
        isAvailable: true,
        maxBookings: 15
      },
      {
        teacherId: teacher.id,
        venueId: venue.id,
        serviceTypeId: 1, // Vinyasa Yoga (ID 1)
        dayOfWeek: 'Saturday',
        startTime: new Date('1970-01-01T14:30:00Z'), // 09:30 EST = 14:30 UTC
        endTime: new Date('1970-01-01T15:30:00Z'), // 10:30 EST = 15:30 UTC
        isAvailable: true,
        maxBookings: 15
      }
    ];

    // Create all schedules
    for (const scheduleData of schedules) {
      await prisma.teacherSchedule.create({
        data: scheduleData
      });
    }

    console.log(`✅ Created ${schedules.length} schedules`);

    // Verify the results
    console.log('\n📋 Final local schedule verification:');
    const finalSchedules = await prisma.teacherSchedule.findMany({
      include: {
        serviceType: { select: { name: true } }
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });

    for (const schedule of finalSchedules) {
      const startTimeStr = schedule.startTime.toTimeString().slice(0, 5);
      console.log(`${schedule.dayOfWeek} ${startTimeStr}: ${schedule.serviceType?.name}`);
    }

    console.log('\n🎉 Local schedules fixed successfully!');

  } catch (error) {
    console.error('❌ Error fixing local schedules:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixLocalSchedules();
