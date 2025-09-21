import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupDuplicateSchedules() {
  try {
    console.log('🧹 Starting cleanup of duplicate schedule slots...\n');

    // First, let's see what we have
    const allSlots = await prisma.teacherScheduleSlot.findMany({
      include: {
        teacherSchedule: {
          include: {
            teacher: true,
            serviceType: true,
            venue: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    console.log(`📊 Found ${allSlots.length} total schedule slots`);

    // Group slots by date and time to find duplicates
    const slotGroups = {};
    
    allSlots.forEach(slot => {
      const date = slot.startTime.toISOString().split('T')[0];
      const time = slot.startTime.toTimeString().slice(0, 5);
      const key = `${date}_${time}_${slot.teacherSchedule.teacherId}_${slot.teacherSchedule.venueId}`;
      
      if (!slotGroups[key]) {
        slotGroups[key] = [];
      }
      slotGroups[key].push(slot);
    });

    // Find duplicates
    const duplicates = Object.values(slotGroups).filter(group => group.length > 1);
    
    console.log(`🔍 Found ${duplicates.length} groups with duplicate slots`);

    let deletedCount = 0;
    
    // Remove duplicates, keeping only the first one
    for (const duplicateGroup of duplicates) {
      console.log(`\n📅 Duplicate group for ${duplicateGroup[0].startTime.toISOString().split('T')[0]} at ${duplicateGroup[0].startTime.toTimeString().slice(0, 5)}:`);
      
      // Keep the first slot, delete the rest
      const toKeep = duplicateGroup[0];
      const toDelete = duplicateGroup.slice(1);
      
      console.log(`   ✅ Keeping slot ID ${toKeep.id} (${toKeep.teacherSchedule.teacher.name} - ${toKeep.teacherSchedule.serviceType.name})`);
      
      for (const slot of toDelete) {
        console.log(`   🗑️  Deleting slot ID ${slot.id} (${slot.teacherSchedule.teacher.name} - ${slot.teacherSchedule.serviceType.name})`);
        
        await prisma.teacherScheduleSlot.delete({
          where: { id: slot.id }
        });
        
        deletedCount++;
      }
    }

    console.log(`\n✅ Cleanup completed! Deleted ${deletedCount} duplicate schedule slots`);

    // Now let's also clean up any Sunday slots that don't match our requirements (8:30 AM and 9:40 AM only)
    console.log('\n🧹 Cleaning up Sunday slots to only keep 8:30 AM and 9:40 AM...');
    
    const sundaySlots = await prisma.teacherScheduleSlot.findMany({
      where: {
        teacherSchedule: {
          dayOfWeek: 'Sunday'
        }
      },
      include: {
        teacherSchedule: true
      }
    });

    console.log(`📅 Found ${sundaySlots.length} Sunday slots`);

    let sundayDeletedCount = 0;
    
    for (const slot of sundaySlots) {
      const time = slot.startTime.toTimeString().slice(0, 5);
      const allowedTimes = ['08:30', '09:40'];
      
      if (!allowedTimes.includes(time)) {
        console.log(`🗑️  Deleting Sunday slot at ${time} (ID: ${slot.id})`);
        
        await prisma.teacherScheduleSlot.delete({
          where: { id: slot.id }
        });
        
        sundayDeletedCount++;
      } else {
        console.log(`✅ Keeping Sunday slot at ${time} (ID: ${slot.id})`);
      }
    }

    console.log(`\n✅ Sunday cleanup completed! Deleted ${sundayDeletedCount} non-compliant Sunday slots`);

    // Final count
    const finalCount = await prisma.teacherScheduleSlot.count();
    console.log(`\n📊 Final schedule slot count: ${finalCount}`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicateSchedules()
  .then(() => {
    console.log('\n🎉 Schedule cleanup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Schedule cleanup failed:', error);
    process.exit(1);
  });
