import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testNewPurchaseDetection() {
  try {
    console.log('🔍 Testing new purchase detection logic...\n');

    // Find a recent user package with purchase
    const recentPackage = await prisma.userPackage.findFirst({
      where: {
        isActive: true,
        purchase: {
          paymentStatus: 'COMPLETED'
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
      }
    });

    if (!recentPackage) {
      console.log('❌ No recent packages found');
      return;
    }

    console.log('📦 Found package:', recentPackage.id);
    console.log('💰 Purchase details:', recentPackage.purchase);
    console.log('📅 Purchase date:', recentPackage.purchase.purchasedAt);
    console.log('⏰ Current time:', new Date());

    // Test the new purchase detection logic
    const isNewPurchase = recentPackage.purchase && 
      recentPackage.purchase.paymentStatus === 'COMPLETED' &&
      (new Date().getTime() - new Date(recentPackage.purchase.purchasedAt).getTime()) < 5 * 60 * 1000; // 5 minutes

    console.log('\n🔍 Is new purchase?', isNewPurchase);
    
    if (isNewPurchase) {
      console.log('✅ This would trigger renewal_matpass template');
      console.log('📱 MatPass details would be included');
    } else {
      console.log('✅ This would trigger booking_only template');
      console.log('📅 Only booking details would be shown');
    }

    // Show what the email data would look like
    const emailData = {
      matpassItems: isNewPurchase ? [{
        name: 'MatPass Package',
        type: 'MatPass',
        quantity: recentPackage.quantity || 1,
        unitPrice: Number(recentPackage.packagePrice.price),
        totalPrice: Number(recentPackage.packagePrice.price) * (recentPackage.quantity || 1),
        sessions: recentPackage.packagePrice.packageDefinition.sessionsCount,
        expiryDate: recentPackage.expiresAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
      }] : [],
      totalAmount: isNewPurchase ? Number(recentPackage.purchase?.totalAmount || 0) : 0,
      orderNumber: isNewPurchase ? `PURCHASE-${recentPackage.purchase?.id}` : `BOOKING-123`,
      paymentMethod: isNewPurchase ? 'Credit Card' : 'MatPass Credit'
    };

    console.log('\n📧 Email data would be:');
    console.log(JSON.stringify(emailData, null, 2));

  } catch (error) {
    console.error('❌ Error testing new purchase detection:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testNewPurchaseDetection();
