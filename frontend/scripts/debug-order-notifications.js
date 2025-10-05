import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugOrderNotifications() {
  const orderNumber = 'ORD-1759641612312-4301-965416-ET4LL29P9';

  try {
    console.log(`🔍 Debugging notifications for order: ${orderNumber}`);

    // 1. Check if order exists
    const order = await prisma.order.findFirst({
      where: { orderNumber: orderNumber },
      include: {
        items: {
          include: {
            product: true,
            packagePrice: {
              include: {
                packageDefinition: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      console.log('❌ Order not found in database');
      return;
    }

    console.log('\n📦 Order Details:');
    console.log(`ID: ${order.id}`);
    console.log(`Customer: ${order.customerName} (${order.customerEmail})`);
    console.log(`Status: ${order.status}`);
    console.log(`Payment Status: ${order.paymentStatus}`);
    console.log(`Created: ${order.createdAt}`);
    console.log(`Items: ${order.items.length}`);

    // 2. Check for bookings related to this order
    const orderBookings = await prisma.booking.findMany({
      where: {
        userId: order.customerId,
        createdAt: {
          gte: new Date(order.createdAt.getTime() - 5000), // 5 seconds before order creation
          lte: new Date(order.createdAt.getTime() + 60000)  // 1 minute after order creation
        }
      },
      include: {
        userPackage: {
          include: {
            packagePrice: {
              include: {
                packageDefinition: true
              }
            }
          }
        }
      }
    });

    console.log(`\n📅 Bookings found: ${orderBookings.length}`);
    orderBookings.forEach((booking, index) => {
      console.log(`  ${index + 1}. Package: ${booking.userPackage?.packagePrice?.packageDefinition?.name}`);
      console.log(`     Status: ${booking.status}`);
      console.log(`     Created: ${booking.createdAt}`);
    });

    // 3. Check recent email logs (if any exist)
    console.log('\n📧 Checking for email activity...');

    // Since we don't have email logs in the database, let's check the server logs
    // by looking at recent activity around the order creation time
    const orderTime = order.createdAt;
    console.log(`Order created at: ${orderTime.toISOString()}`);

    // 4. Check Telegram users and recent activity
    const telegramUsers = await prisma.telegramUser.findMany({
      where: { isActive: true }
    });

    console.log(`\n📱 Active Telegram Users: ${telegramUsers.length}`);
    telegramUsers.forEach(user => {
      console.log(`  - ${user.telegramId}: ${user.user?.email || 'No email'}`);
    });

    // 5. Check if there are any user packages created for this order
    const userPackages = await prisma.userPackage.findMany({
      where: {
        userId: order.customerId,
        createdAt: {
          gte: new Date(order.createdAt.getTime() - 5000),
          lte: new Date(order.createdAt.getTime() + 60000)
        }
      },
      include: {
        packagePrice: {
          include: {
            packageDefinition: true
          }
        }
      }
    });

    console.log(`\n👤 User Packages Created: ${userPackages.length}`);
    userPackages.forEach((up, index) => {
      console.log(`  ${index + 1}. ${up.packagePrice?.packageDefinition?.name}`);
      console.log(`     Sessions: ${up.packagePrice?.packageDefinition?.sessionsCount}`);
      console.log(`     Created: ${up.createdAt}`);
    });

    // 6. Check the create-unified API logs (simulate what would happen)
    console.log('\n🔍 Simulating email/Telegram logic:');

    // Check if order has items
    const hasItems = order.items.length > 0;
    console.log(`Has order items: ${hasItems}`);

    // Check if order has MatPass
    const hasMatpass = order.items.some(item => item.itemType === 'PACKAGE');
    console.log(`Has MatPass: ${hasMatpass}`);

    // Check if order has products
    const hasProducts = order.items.some(item => item.itemType === 'PRODUCT');
    console.log(`Has products: ${hasProducts}`);

    // Check if order has bookings
    const hasBookings = orderBookings.length > 0;
    console.log(`Has bookings: ${hasBookings}`);

    // Determine expected email template
    let expectedTemplate = 'unknown';
    if (hasMatpass && hasBookings) {
      expectedTemplate = 'renewal_matpass';
    } else if (hasMatpass && !hasBookings) {
      expectedTemplate = 'renewal_matpass';
    } else if (hasProducts && !hasMatpass) {
      expectedTemplate = 'products_only';
    } else if (hasBookings && !hasMatpass && !hasProducts) {
      expectedTemplate = 'booking_only';
    }

    console.log(`Expected email template: ${expectedTemplate}`);

    // Check if template exists
    const templateExists = await prisma.communicationTemplate.findFirst({
      where: {
        templateKey: expectedTemplate,
        isActive: true
      },
      include: {
        translations: {
          where: { language: 'es' }
        }
      }
    });

    console.log(`Template exists: ${!!templateExists}`);
    if (templateExists) {
      console.log(`Template has Spanish translation: ${templateExists.translations.length > 0}`);
    }

    // Check payment method
    console.log(`Payment method: ${order.paymentMethod}`);
    console.log(`Payment status: ${order.paymentStatus}`);

    console.log('\n🎯 DIAGNOSIS:');

    if (!hasItems) {
      console.log('❌ Issue: Order has no items - email might not be sent');
    }

    if (!templateExists || templateExists.translations.length === 0) {
      console.log('❌ Issue: Required email template missing or not translated');
    }

    if (order.paymentStatus === 'PENDING' && order.paymentMethod === 'pay_later') {
      console.log('ℹ️ Note: Payment is pending - this is expected for pay_later orders');
    }

    if (telegramUsers.length === 0) {
      console.log('❌ Issue: No active Telegram users configured');
    }

    console.log('✅ Email should be sent to:', order.customerEmail);
    console.log('✅ Telegram notification should be sent to', telegramUsers.length, 'users');

  } catch (error) {
    console.error('❌ Error debugging order notifications:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugOrderNotifications();

