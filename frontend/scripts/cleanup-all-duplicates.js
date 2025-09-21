import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupAllDuplicates() {
  try {
    console.log('🧹 Starting comprehensive cleanup of ALL duplicate schedule slots...\n');

    // Get all slots
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

    // Group by exact same time, teacher, venue, and service type
    const slotGroups = {};
    
    allSlots.forEach(slot => {
      const date = slot.startTime.toISOString().split('T')[0];
      const time = slot.startTime.toTimeString().slice(0, 5);
      const key = `${date}_${time}_${slot.teacherSchedule.teacherId}_${slot.teacherSchedule.venueId}_${slot.teacherSchedule.serviceTypeId}`;
      
      if (!slotGroups[key]) {
        slotGroups[key] = [];
      }
      slotGroups[key].push(slot);
    });

    // Find all groups with duplicates
    const duplicateGroups = Object.values(slotGroups).filter(group => group.length > 1);
    
    console.log(`🔍 Found ${duplicateGroups.length} groups with duplicate slots`);

    let deletedCount = 0;
    
    // Remove ALL duplicates, keeping only the one with the lowest ID
    for (const duplicateGroup of duplicateGroups) {
      const sortedGroup = duplicateGroup.sort((a, b) => a.id - b.id);
      const toKeep = sortedGroup[0];
      const toDelete = sortedGroup.slice(1);
      
      const date = toKeep.startTime.toISOString().split('T')[0];
      const time = toKeep.startTime.toTimeString().slice(0, 5);
      const dayOfWeek = toKeep.teacherSchedule.dayOfWeek;
      
      console.log(`\n📅 Duplicate group for ${dayOfWeek} ${date} at ${time}:`);
      console.log(`   ✅ Keeping slot ID ${toKeep.id} (${toKeep.teacherSchedule.teacher.name} - ${toKeep.teacherSchedule.serviceType.name})`);
      
      for (const slot of toDelete) {
        console.log(`   🗑️  Deleting slot ID ${slot.id} (${slot.teacherSchedule.teacher.name} - ${slot.teacherSchedule.serviceType.name})`);
        
        await prisma.teacherScheduleSlot.delete({
          where: { id: slot.id }
        });
        
        deletedCount++;
      }
    }

    console.log(`\n✅ Duplicate cleanup completed! Deleted ${deletedCount} duplicate schedule slots`);

    // Now check for Sunday slots and clean them up
    console.log('\n🧹 Checking for Sunday slots...');
    
    const sundaySlots = await prisma.teacherScheduleSlot.findMany({
      where: {
        teacherSchedule: {
          dayOfWeek: 'Sunday'
        }
      },
      include: {
        teacherSchedule: {
          include: {
            teacher: true,
            serviceType: true
          }
        }
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

    // Show remaining Sunday slots
    const remainingSundaySlots = await prisma.teacherScheduleSlot.findMany({
      where: {
        teacherSchedule: {
          dayOfWeek: 'Sunday'
        }
      },
      include: {
        teacherSchedule: {
          include: {
            teacher: true,
            serviceType: true
          }
        }
      }
    });

    console.log(`\n📅 Remaining Sunday slots: ${remainingSundaySlots.length}`);
    remainingSundaySlots.forEach(slot => {
      const time = slot.startTime.toTimeString().slice(0, 5);
      const date = slot.startTime.toISOString().split('T')[0];
      console.log(`- ${date} at ${time}: ${slot.teacherSchedule.serviceType.name} (ID: ${slot.id})`);
    });

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanupAllDuplicates()
  .then(() => {
    console.log('\n🎉 Comprehensive cleanup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Cleanup failed:', error);
    process.exit(1);
  });
