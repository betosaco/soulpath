import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testUnifiedOrderSystem() {
  try {
    console.log('🔍 Testing unified order system...\n');

    // Check if the unified order system can handle existing customer bookings
    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      select: {
        id: true,
        customerEmail: true,
        total: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    console.log(`📦 Found ${recentOrders.length} recent orders`);
    
    for (const order of recentOrders) {
      console.log(`\n📦 Order ${order.id}:`);
      console.log(`  Customer: ${order.customerEmail}`);
      console.log(`  Total: ${order.total}`);
      console.log(`  Created: ${order.createdAt}`);
    }

    // Check if there are any bookings with proper schedule slot data
    const bookingsWithSlots = await prisma.booking.findMany({
      where: {
        scheduleSlotId: { not: null },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      include: {
        scheduleSlot: {
          include: {
            scheduleTemplate: {
              include: {
                venue: true,
                sessionDuration: true
              }
            }
          }
        },
        teacher: true,
        venue: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3
    });

    console.log(`\n📅 Found ${bookingsWithSlots.length} bookings with proper schedule slot data`);
    
    for (const booking of bookingsWithSlots) {
      console.log(`\n📅 Booking ${booking.id}:`);
      console.log(`  Schedule Slot ID: ${booking.scheduleSlotId}`);
      console.log(`  Start Time: ${booking.scheduleSlot?.startTime}`);
      console.log(`  Teacher: ${booking.teacher?.name}`);
      console.log(`  Venue: ${booking.venue?.name || booking.scheduleSlot?.scheduleTemplate?.venue?.name}`);
      console.log(`  Session Type: ${booking.sessionType}`);
    }

    // Check if there are any bookings with null schedule slot data (deprecated system)
    const bookingsWithoutSlots = await prisma.booking.findMany({
      where: {
        scheduleSlotId: null,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      select: {
        id: true,
        sessionType: true,
        teacherId: true,
        venueId: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3
    });

    console.log(`\n❌ Found ${bookingsWithoutSlots.length} bookings with null schedule slot data (deprecated system)`);
    
    for (const booking of bookingsWithoutSlots) {
      console.log(`\n❌ Booking ${booking.id} (deprecated):`);
      console.log(`  Schedule Slot ID: ${booking.scheduleSlotId}`);
      console.log(`  Teacher ID: ${booking.teacherId}`);
      console.log(`  Venue ID: ${booking.venueId}`);
      console.log(`  Session Type: ${booking.sessionType}`);
    }

    console.log('\n🎯 Summary:');
    console.log(`  ✅ Orders with proper data: ${recentOrders.length}`);
    console.log(`  ✅ Bookings with schedule slots: ${bookingsWithSlots.length}`);
    console.log(`  ❌ Bookings without schedule slots: ${bookingsWithoutSlots.length}`);
    
    if (bookingsWithoutSlots.length > 0) {
      console.log('\n⚠️  You are still using the deprecated booking system!');
      console.log('   Please use the current booking system at /packages/enhanced');
    } else {
      console.log('\n✅ You are using the current booking system correctly!');
    }

  } catch (error) {
    console.error('❌ Error testing unified order system:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUnifiedOrderSystem();
