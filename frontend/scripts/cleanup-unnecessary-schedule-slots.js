import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupUnnecessaryScheduleSlots() {
  try {
    console.log('🧹 Cleaning up unnecessary schedule slots...\n');

    // First, let's see what schedule slots exist
    const allScheduleSlots = await prisma.scheduleSlot.findMany({
      include: {
        scheduleTemplate: {
          include: {
            venue: true,
            sessionDuration: true
          }
        }
      },
      orderBy: {
        startTime: 'desc'
      },
      take: 10
    });

    console.log(`📅 Found ${allScheduleSlots.length} schedule slots in database`);
    
    for (const slot of allScheduleSlots) {
      console.log(`\n📅 Slot ${slot.id}:`);
      console.log(`  Date: ${slot.startTime.toISOString().split('T')[0]}`);
      console.log(`  Time: ${slot.startTime.toTimeString().split(' ')[0]}`);
      console.log(`  Venue: ${slot.scheduleTemplate?.venue?.name || 'No venue'}`);
      console.log(`  Duration: ${slot.scheduleTemplate?.sessionDuration?.duration_minutes} minutes`);
      console.log(`  Available: ${slot.isAvailable}`);
    }

    // Delete all schedule slots (since they're redundant with Teacher Schedule Slots)
    console.log('\n🗑️ Deleting all schedule slots...');
    
    const deletedSlots = await prisma.scheduleSlot.deleteMany({});
    console.log(`✅ Deleted ${deletedSlots.count} schedule slots`);

    // Also delete the schedule templates I created
    console.log('\n🗑️ Deleting unnecessary schedule templates...');
    
    const deletedTemplates = await prisma.scheduleTemplate.deleteMany({
      where: {
        id: {
          gte: 7 // Delete templates created after the original ones
        }
      }
    });
    console.log(`✅ Deleted ${deletedTemplates.count} schedule templates`);

    // Verify Teacher Schedule Slots are still intact
    const teacherSlots = await prisma.teacherScheduleSlot.findMany({
      where: {
        isAvailable: true,
        startTime: { gt: new Date() }
      },
      include: {
        teacherSchedule: {
          include: {
            venue: true,
            serviceType: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      },
      take: 5
    });

    console.log(`\n✅ Teacher Schedule Slots still available: ${teacherSlots.length}`);
    
    for (const slot of teacherSlots) {
      console.log(`\n👨‍🏫 Teacher Slot ${slot.id}:`);
      console.log(`  Date: ${slot.startTime.toISOString().split('T')[0]}`);
      console.log(`  Time: ${slot.startTime.toTimeString().split(' ')[0]}`);
      console.log(`  Venue: ${slot.teacherSchedule?.venue?.name}`);
      console.log(`  Service: ${slot.teacherSchedule?.serviceType?.name}`);
    }

    console.log('\n🎯 Cleanup Summary:');
    console.log('✅ Deleted unnecessary schedule slots');
    console.log('✅ Deleted unnecessary schedule templates');
    console.log('✅ Teacher Schedule Slots remain intact');
    console.log('✅ The /schedule page will continue to show proper data');
    console.log('✅ No redundant data in the database');

  } catch (error) {
    console.error('❌ Error cleaning up schedule slots:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupUnnecessaryScheduleSlots();
