import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testNewPackageDetection() {
  try {
    console.log('🔍 Testing new package detection logic...\n');

    // Find recent user packages
    const recentPackages = await prisma.userPackage.findMany({
      where: {
        isActive: true
      },
      include: {
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

    console.log(`📦 Found ${recentPackages.length} recent packages`);

    for (const pkg of recentPackages) {
      console.log(`\n📦 Package ${pkg.id}:`);
      console.log(`  📅 Created: ${pkg.createdAt}`);
      console.log(`  💰 Price: ${pkg.packagePrice.price}`);
      console.log(`  📊 Sessions: ${pkg.packagePrice.packageDefinition.sessionsCount}`);
      console.log(`  ✅ Active: ${pkg.isActive}`);
      console.log(`  🔢 Sessions Used: ${pkg.sessionsUsed}`);
      
      // Test the new package detection logic
      const isNewPackage = pkg.createdAt && 
        (new Date().getTime() - new Date(pkg.createdAt).getTime()) < 5 * 60 * 1000; // 5 minutes

      console.log(`  🔍 Is new package? ${isNewPackage}`);
      
      if (isNewPackage) {
        console.log(`  ✅ Would trigger renewal_matpass template`);
        console.log(`  📱 MatPass details would be included`);
        
        // Show what the email data would look like
        const emailData = {
          matpassItems: [{
            name: 'MatPass Package',
            type: 'MatPass',
            quantity: pkg.quantity || 1,
            unitPrice: Number(pkg.packagePrice.price),
            totalPrice: Number(pkg.packagePrice.price) * (pkg.quantity || 1),
            sessions: pkg.packagePrice.packageDefinition.sessionsCount,
            expiryDate: pkg.expiresAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
          }],
          totalAmount: Number(pkg.packagePrice.price) * (pkg.quantity || 1),
          orderNumber: `PACKAGE-${pkg.id}`,
          paymentMethod: 'Credit Card'
        };
        
        console.log(`  📧 Email data would be:`);
        console.log(`    💰 Total: ${emailData.totalAmount}`);
        console.log(`    📦 MatPass: ${emailData.matpassItems[0].name}`);
        console.log(`    🔢 Sessions: ${emailData.matpassItems[0].sessions}`);
      } else {
        console.log(`  ✅ Would trigger booking_only template`);
        console.log(`  📅 Only booking details would be shown`);
      }
    }

  } catch (error) {
    console.error('❌ Error testing new package detection:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testNewPackageDetection();
