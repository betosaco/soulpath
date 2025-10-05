import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testEmailTemplateFix() {
  try {
    console.log('🔍 Testing email template selection fix...\n');

    // Get the most recent order
    const latestOrder = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true
      }
    });

    if (!latestOrder) {
      console.log('❌ No orders found');
      return;
    }

    console.log('📦 Latest order:');
    console.log(`  ID: ${latestOrder.id}`);
    console.log(`  Customer: ${latestOrder.customerEmail}`);
    console.log(`  Items: ${latestOrder.items.length}`);

    // Check for MatPass items
    const matpassItems = latestOrder.items.filter(item => item.itemType === 'PACKAGE');
    console.log(`\n📦 MatPass items: ${matpassItems.length}`);

    // Check for recent bookings for this customer
    const recentBookings = await prisma.booking.findMany({
      where: {
        user: {
          email: latestOrder.customerEmail
        },
        createdAt: {
          gte: new Date(Date.now() - 10 * 60 * 1000) // Last 10 minutes
        }
      },
      include: {
        teacherScheduleSlot: {
          include: {
            teacherSchedule: {
              include: {
                venue: true,
                serviceType: true,
                teacher: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    console.log(`\n📅 Recent bookings: ${recentBookings.length}`);
    
    for (const booking of recentBookings) {
      console.log(`\n📅 Booking ${booking.id}:`);
      console.log(`  Session Type: ${booking.sessionType}`);
      console.log(`  Teacher: ${booking.teacherScheduleSlot?.teacherSchedule?.teacher?.name}`);
      console.log(`  Venue: ${booking.teacherScheduleSlot?.teacherSchedule?.venue?.name}`);
      console.log(`  Service: ${booking.teacherScheduleSlot?.teacherSchedule?.serviceType?.name}`);
    }

    // Simulate the template selection logic
    const hasMatpass = matpassItems.length > 0;
    const hasBookings = recentBookings.length > 0;

    console.log(`\n🎯 Template Selection Logic:`);
    console.log(`  Has MatPass: ${hasMatpass}`);
    console.log(`  Has Bookings: ${hasBookings}`);

    // Check if customer is new
    const previousOrders = await prisma.order.findMany({
      where: {
        customerEmail: latestOrder.customerEmail,
        status: {
          not: 'CANCELLED'
        },
        id: {
          not: latestOrder.id // Exclude current order
        }
      },
      take: 1
    });

    const isNewCustomer = previousOrders.length === 0;
    console.log(`  Is New Customer: ${isNewCustomer}`);

    // Determine template
    let selectedTemplate = '';
    if (hasMatpass) {
      if (isNewCustomer) {
        if (hasBookings) {
          selectedTemplate = 'welcome_matpass';
          console.log('✅ Should use: welcome_matpass (New customer with MatPass + Booking)');
        } else {
          selectedTemplate = 'welcome_matpass';
          console.log('✅ Should use: welcome_matpass (New customer with MatPass only)');
        }
      } else {
        if (hasBookings) {
          selectedTemplate = 'renewal_matpass';
          console.log('✅ Should use: renewal_matpass (Existing customer with MatPass + Booking)');
        } else {
          selectedTemplate = 'renewal_matpass';
          console.log('✅ Should use: renewal_matpass (Existing customer with MatPass only)');
        }
      }
    } else if (hasBookings) {
      selectedTemplate = 'booking_only';
      console.log('❌ PROBLEM: Should use booking_only (Booking only without MatPass)');
    }

    console.log(`\n🎯 Selected Template: ${selectedTemplate}`);

    // Check if the template exists
    const template = await prisma.communicationTemplate.findFirst({
      where: {
        templateKey: selectedTemplate,
        isActive: true
      }
    });

    if (template) {
      console.log(`✅ Template exists: ${template.name}`);
    } else {
      console.log(`❌ Template not found: ${selectedTemplate}`);
    }

    console.log(`\n🎯 Expected Result:`);
    if (hasMatpass && hasBookings) {
      console.log('✅ You should receive a MatPass + booking email (not just booking confirmation)');
      console.log('✅ The email should show both MatPass details and booking details');
    } else if (hasBookings && !hasMatpass) {
      console.log('❌ You should receive a booking-only email');
    } else if (hasMatpass && !hasBookings) {
      console.log('✅ You should receive a MatPass-only email');
    }

  } catch (error) {
    console.error('❌ Error testing email template fix:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEmailTemplateFix();
