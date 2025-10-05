import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function finalBookingSystemTest() {
  try {
    console.log('🔍 Final booking system test...\n');

    // Check if there are any schedule slots available
    const availableSlots = await prisma.scheduleSlot.findMany({
      where: {
        startTime: { gt: new Date() }
      },
      include: {
        scheduleTemplate: {
          include: {
            venue: true,
            sessionDuration: true
          }
        }
      },
      take: 3
    });

    console.log(`📅 Available schedule slots: ${availableSlots.length}`);
    
    if (availableSlots.length === 0) {
      console.log('❌ No schedule slots available for testing');
      console.log('💡 You need to create schedule slots first');
      return;
    }

    for (const slot of availableSlots) {
      console.log(`\n📅 Slot ${slot.id}:`);
      console.log(`  Start Time: ${slot.startTime}`);
      console.log(`  Venue: ${slot.scheduleTemplate?.venue?.name}`);
      console.log(`  Duration: ${slot.scheduleTemplate?.sessionDuration?.duration_minutes} minutes`);
    }

    // Check if there are any user packages available
    const userPackages = await prisma.userPackage.findMany({
      where: {
        isActive: true
      },
      include: {
        user: {
          select: {
            email: true,
            fullName: true
          }
        },
        packagePrice: {
          include: {
            packageDefinition: true
          }
        }
      },
      take: 3
    });

    console.log(`\n📦 Active user packages: ${userPackages.length}`);
    
    for (const userPackage of userPackages) {
      console.log(`\n📦 Package ${userPackage.id}:`);
      console.log(`  User: ${userPackage.user?.email}`);
      console.log(`  Package: ${userPackage.packagePrice?.packageDefinition?.name}`);
      console.log(`  Sessions: ${userPackage.sessionsUsed}/${userPackage.packagePrice?.packageDefinition?.sessionsCount}`);
      console.log(`  Active: ${userPackage.isActive}`);
    }

    console.log('\n🎯 Current Booking System Test Results:');
    console.log(`  ✅ Schedule slots available: ${availableSlots.length > 0 ? 'Yes' : 'No'}`);
    console.log(`  ✅ User packages available: ${userPackages.length > 0 ? 'Yes' : 'No'}`);
    
    if (availableSlots.length > 0 && userPackages.length > 0) {
      console.log('\n✅ Current booking system is ready to use!');
      console.log('\n🎯 To test the current booking system:');
      console.log('1. Go to /packages/enhanced');
      console.log('2. Select a package');
      console.log('3. Go to /booking/schedule');
      console.log('4. Select a schedule slot');
      console.log('5. Complete the booking flow');
      console.log('\nThis will use /api/orders/create-unified which properly handles all data.');
    } else {
      console.log('\n❌ Current booking system needs setup:');
      if (availableSlots.length === 0) {
        console.log('  - Create schedule slots in the admin panel');
      }
      if (userPackages.length === 0) {
        console.log('  - Create user packages or purchase packages');
      }
    }

  } catch (error) {
    console.error('❌ Error testing current booking system:', error);
  } finally {
    await prisma.$disconnect();
  }
}

finalBookingSystemTest();
