import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deepOrderAnalysis() {
  const orderNumber = 'ORD-1759641612312-4301-965416-ET4LL29P9';

  try {
    console.log(`🔍 Deep analysis of order: ${orderNumber}`);

    // Get the order with full details
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
      console.log('❌ Order not found');
      return;
    }

    console.log('\n📦 ORDER DETAILS:');
    console.log(`ID: ${order.id}`);
    console.log(`Number: ${order.orderNumber}`);
    console.log(`Customer: ${order.customerName} (${order.customerEmail})`);
    console.log(`Status: ${order.status}`);
    console.log(`Payment: ${order.paymentStatus} (${order.paymentMethod})`);
    console.log(`Created: ${order.createdAt.toISOString()}`);
    console.log(`Currency: ${order.currency}`);
    console.log(`Total: ${order.total}`);

    console.log('\n📦 ORDER ITEMS:');
    if (order.items && order.items.length > 0) {
      order.items.forEach((item, index) => {
        console.log(`  ${index + 1}. Type: ${item.itemType}`);
        console.log(`     Name: ${item.name}`);
        console.log(`     Quantity: ${item.quantity}`);
        console.log(`     Price: ${item.price}`);
        console.log(`     Product: ${item.product?.name || 'N/A'}`);
        console.log(`     Package: ${item.packagePrice?.packageDefinition?.name || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('❌ No items found in order.items relationship');
    }

    // Check if there are any items in the database directly
    const directItems = await prisma.orderItem.findMany({
      where: { orderId: order.id },
      include: {
        product: true,
        packagePrice: {
          include: {
            packageDefinition: true
          }
        }
      }
    });

    console.log('📦 DIRECT ORDER ITEMS QUERY:');
    if (directItems && directItems.length > 0) {
      directItems.forEach((item, index) => {
        console.log(`  ${index + 1}. Type: ${item.itemType}`);
        console.log(`     Name: ${item.name}`);
        console.log(`     Quantity: ${item.quantity}`);
        console.log(`     Price: ${item.price}`);
        console.log(`     Product: ${item.product?.name || 'N/A'}`);
        console.log(`     Package: ${item.packagePrice?.packageDefinition?.name || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('❌ No items found via direct query');
    }

    // Check user packages created around the same time
    const userPackages = await prisma.userPackage.findMany({
      where: {
        userId: order.customerId,
        createdAt: {
          gte: new Date(order.createdAt.getTime() - 10000), // 10 seconds before
          lte: new Date(order.createdAt.getTime() + 60000)   // 1 minute after
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

    console.log('👤 USER PACKAGES CREATED:');
    if (userPackages && userPackages.length > 0) {
      userPackages.forEach((up, index) => {
        console.log(`  ${index + 1}. ${up.packagePrice?.packageDefinition?.name}`);
        console.log(`     Created: ${up.createdAt.toISOString()}`);
        console.log(`     Sessions: ${up.packagePrice?.packageDefinition?.sessionsCount}`);
        console.log('');
      });
    } else {
      console.log('❌ No user packages found');
    }

    // Check bookings created around the same time
    const bookings = await prisma.booking.findMany({
      where: {
        userId: order.customerId,
        createdAt: {
          gte: new Date(order.createdAt.getTime() - 10000),
          lte: new Date(order.createdAt.getTime() + 60000)
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
        },
        teacherScheduleSlot: {
          include: {
            teacherSchedule: {
              include: {
                teacher: true,
                venue: true
              }
            }
          }
        }
      }
    });

    console.log('📅 BOOKINGS CREATED:');
    if (bookings && bookings.length > 0) {
      bookings.forEach((booking, index) => {
        console.log(`  ${index + 1}. Package: ${booking.userPackage?.packagePrice?.packageDefinition?.name}`);
        console.log(`     Status: ${booking.status}`);
        console.log(`     Created: ${booking.createdAt.toISOString()}`);
        console.log(`     Teacher: ${booking.teacherScheduleSlot?.teacherSchedule?.teacher?.name || 'TBD'}`);
        console.log(`     Venue: ${booking.teacherScheduleSlot?.teacherSchedule?.venue?.name || 'TBD'}`);
        console.log('');
      });
    } else {
      console.log('❌ No bookings found');
    }

    // Check what would happen in the email logic
    console.log('🎯 EMAIL LOGIC SIMULATION:');
    const hasItems = directItems.length > 0;
    const hasMatpass = directItems.some(item => item.itemType === 'PACKAGE');
    const hasProducts = directItems.some(item => item.itemType === 'PRODUCT');
    const hasBookings = bookings.length > 0;

    console.log(`Has items: ${hasItems}`);
    console.log(`Has MatPass: ${hasMatpass}`);
    console.log(`Has products: ${hasProducts}`);
    console.log(`Has bookings: ${hasBookings}`);

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

    console.log(`Expected template: ${expectedTemplate}`);

    // Check if the email sending would have been triggered
    const shouldSendEmail = hasItems && order.customerEmail;
    console.log(`Should send email: ${shouldSendEmail}`);

    if (!shouldSendEmail) {
      console.log('❌ EMAIL NOT SENT: Missing items or customer email');
    }

    // Check environment and API configuration
    console.log('\n⚙️ CONFIGURATION CHECK:');
    console.log(`NEXT_PUBLIC_BASE_URL: ${process.env.NEXT_PUBLIC_BASE_URL || 'NOT SET'}`);
    console.log(`BREVO_API_KEY: ${process.env.BREVO_API_KEY ? 'SET' : 'NOT SET'}`);

    console.log('\n🎯 FINAL DIAGNOSIS:');
    if (!hasItems) {
      console.log('❌ CRITICAL: Order has no items - email would not be sent');
    } else if (!order.customerEmail) {
      console.log('❌ CRITICAL: Order has no customer email');
    } else if (!process.env.BREVO_API_KEY) {
      console.log('❌ CRITICAL: Brevo API key not configured');
    } else {
      console.log('✅ All conditions met for email sending');
      console.log('ℹ️ Email should have been sent - check server logs for errors');
    }

  } catch (error) {
    console.error('❌ Error in deep order analysis:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deepOrderAnalysis();

