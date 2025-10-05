import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugPurchaseBookingScenario() {
  try {
    console.log('🔍 Debugging purchase + booking scenario...\n');

    // Find recent user packages with purchases
    const recentPackages = await prisma.userPackage.findMany({
      where: {
        isActive: true,
        purchase: {
          isNot: null
        }
      },
      include: {
        purchase: {
          select: {
            id: true,
            totalAmount: true,
            purchasedAt: true,
            paymentStatus: true
          }
        },
        packagePrice: {
          include: {
            packageDefinition: {
              select: {
                sessionsCount: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    console.log(`📦 Found ${recentPackages.length} packages with purchases`);

    for (const pkg of recentPackages) {
      console.log(`\n📦 Package ${pkg.id}:`);
      console.log(`  💰 Purchase: ${pkg.purchase?.id}`);
      console.log(`  💵 Amount: ${pkg.purchase?.totalAmount}`);
      console.log(`  📅 Purchased: ${pkg.purchase?.purchasedAt}`);
      console.log(`  ✅ Status: ${pkg.purchase?.paymentStatus}`);
      
      // Test the new purchase detection logic
      const isNewPurchase = pkg.purchase && 
        pkg.purchase.paymentStatus === 'COMPLETED' &&
        (new Date().getTime() - new Date(pkg.purchase.purchasedAt).getTime()) < 5 * 60 * 1000; // 5 minutes

      console.log(`  🔍 Is new purchase? ${isNewPurchase}`);
      
      if (isNewPurchase) {
        console.log(`  ✅ Would trigger renewal_matpass template`);
      } else {
        console.log(`  ✅ Would trigger booking_only template`);
      }
    }

    // Check if there are any recent bookings
    const recentBookings = await prisma.booking.findMany({
      where: {
        status: 'confirmed',
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      include: {
        userPackage: {
          include: {
            purchase: {
              select: {
                id: true,
                totalAmount: true,
                purchasedAt: true,
                paymentStatus: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3
    });

    console.log(`\n📅 Found ${recentBookings.length} recent bookings`);

    for (const booking of recentBookings) {
      console.log(`\n📅 Booking ${booking.id}:`);
      console.log(`  📦 Package: ${booking.userPackageId}`);
      console.log(`  💰 Has purchase: ${!!booking.userPackage?.purchase}`);
      
      if (booking.userPackage?.purchase) {
        const purchase = booking.userPackage.purchase;
        console.log(`  💵 Amount: ${purchase.totalAmount}`);
        console.log(`  📅 Purchased: ${purchase.purchasedAt}`);
        console.log(`  ✅ Status: ${purchase.paymentStatus}`);
        
        // Test the new purchase detection logic
        const isNewPurchase = purchase && 
          purchase.paymentStatus === 'COMPLETED' &&
          (new Date().getTime() - new Date(purchase.purchasedAt).getTime()) < 5 * 60 * 1000; // 5 minutes

        console.log(`  🔍 Is new purchase? ${isNewPurchase}`);
        
        if (isNewPurchase) {
          console.log(`  ✅ Would trigger renewal_matpass template`);
        } else {
          console.log(`  ✅ Would trigger booking_only template`);
        }
      } else {
        console.log(`  ✅ Would trigger booking_only template (no purchase)`);
      }
    }

  } catch (error) {
    console.error('❌ Error debugging purchase + booking scenario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugPurchaseBookingScenario();
