import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCurrentBookingSystem() {
  try {
    console.log('🔍 Testing current booking system...\n');

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

    console.log(`📅 Found ${availableSlots.length} available schedule slots`);
    
    for (const slot of availableSlots) {
      console.log(`\n📅 Slot ${slot.id}:`);
      console.log(`  Start Time: ${slot.startTime}`);
      console.log(`  Venue: ${slot.scheduleTemplate?.venue?.name}`);
      console.log(`  Duration: ${slot.scheduleTemplate?.sessionDuration?.duration_minutes} minutes`);
    }

    // Check if there are any user packages available
    const userPackages = await prisma.userPackage.findMany({
      where: {
        isActive: true,
        sessionsUsed: { lt: prisma.userPackage.fields.quantity }
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

    console.log(`\n📦 Found ${userPackages.length} active user packages`);
    
    for (const userPackage of userPackages) {
      console.log(`\n📦 Package ${userPackage.id}:`);
      console.log(`  User: ${userPackage.user?.email}`);
      console.log(`  Package: ${userPackage.packagePrice?.packageDefinition?.name}`);
      console.log(`  Sessions: ${userPackage.sessionsUsed}/${userPackage.packagePrice?.packageDefinition?.sessionsCount}`);
      console.log(`  Active: ${userPackage.isActive}`);
    }

    console.log('\n✅ Current booking system data is available');
    console.log('\n🎯 To test the current booking system:');
    console.log('1. Go to /packages/enhanced');
    console.log('2. Select a package');
    console.log('3. Go to /booking/schedule');
    console.log('4. Select a schedule slot');
    console.log('5. Complete the booking flow');
    console.log('\nThis will use /api/orders/create-unified which properly handles schedule slot data.');

  } catch (error) {
    console.error('❌ Error testing current booking system:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCurrentBookingSystem();
