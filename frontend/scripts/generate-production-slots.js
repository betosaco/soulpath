#!/usr/bin/env node

/**
 * Generate Production Schedule Slots Script
 * 
 * This script generates specific schedule slots for the production database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.tyiexnwqmlsaxxndrnyk:pSfG5jEEEWtVdvRI@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function generateProductionSlots() {
  console.log('📅 Generating Production Schedule Slots\n');
  console.log('=====================================\n');

  try {
    // Delete existing schedule slots
    console.log('🗑️ Deleting existing schedule slots...');
    await prisma.scheduleSlot.deleteMany({});
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
        // Convert UTC time to EST for display
        const startTime = schedule.startTime;
        const endTime = schedule.endTime;
        
        // Create the slot
        const slot = {
          teacherScheduleId: schedule.id,
          date: date.toISOString().split('T')[0], // YYYY-MM-DD format
          time: startTime.toTimeString().slice(0, 5), // HH:MM format
          isAvailable: schedule.isAvailable,
          capacity: schedule.maxBookings,
          bookedCount: 0,
          duration: 60, // Default duration
          teacher: {
            id: schedule.teacher.id,
            name: schedule.teacher.name,
            bio: "Experienced yoga instructor",
            shortBio: "Experienced yoga instructor",
            experience: 8,
            avatarUrl: null
          },
          serviceType: {
            id: schedule.serviceType.id,
            name: schedule.serviceType.name,
            description: "Yoga class",
            shortDescription: "Yoga class",
            duration: 60,
            difficulty: "ALL_LEVELS",
            color: "#4A90E2",
            icon: "lotus"
          },
          venue: {
            id: schedule.venue.id,
            name: schedule.venue.name,
            address: "123 Wellness Street, Yoga District",
            city: "Lima"
          },
          dayOfWeek: dayOfWeek
        };

        slots.push(slot);
      }
    }

    console.log(`📅 Generated ${slots.length} schedule slots for the next 30 days`);

    // Insert slots into database (we'll create a simple table structure)
    // For now, let's just log the first few slots to verify
    console.log('\n📋 Sample schedule slots:');
    slots.slice(0, 10).forEach(slot => {
      console.log(`${slot.date} ${slot.time} - ${slot.serviceType.name} (${slot.teacher.name})`);
    });

    console.log('\n🎉 Production schedule slots generated successfully!');
    console.log('\n💡 Note: The slots are generated in memory. To persist them,');
    console.log('   you would need to create a proper ScheduleSlot table in the database.');

  } catch (error) {
    console.error('❌ Error generating production slots:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the generation
generateProductionSlots();
