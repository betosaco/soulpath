import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugBookingTemplateData() {
  try {
    console.log('🔍 Debugging booking template data mapping...\n');

    // Find a recent booking with complete data
    const booking = await prisma.booking.findFirst({
      where: {
        status: 'confirmed'
      },
      include: {
        scheduleSlot: {
          include: {
            scheduleTemplate: {
              include: {
                sessionDuration: true,
                venue: true
              }
            }
          }
        },
        teacher: true,
        venue: true,
        userPackage: {
          include: {
            packagePrice: {
              include: {
                packageDefinition: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!booking) {
      console.log('❌ No bookings found');
      return;
    }

    console.log('📅 Found booking:', booking.id);
    console.log('👤 Teacher:', booking.teacher?.name);
    console.log('🏢 Venue:', booking.venue?.name);
    console.log('⏰ Start time:', booking.scheduleSlot?.startTime);
    console.log('📝 Session type:', booking.sessionType);

    // Simulate the booking data that would be sent to OrderEmailService
    const orderData = {
      customerName: 'Julio Ad',
      customerEmail: 'julio@example.com',
      customerPhone: '',
      orderNumber: `BOOKING-${booking.id}`,
      orderDate: new Date().toISOString(),
      totalAmount: 0,
      currency: 'PEN',
      subtotal: 0,
      taxAmount: 0,
      shippingAmount: 0,
      orderItems: [],
      matpassItems: [],
      bookings: [{
        bookingId: booking.id.toString(),
        bookingDate: booking.scheduleSlot?.startTime ? new Date(booking.scheduleSlot.startTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        bookingTime: booking.scheduleSlot?.startTime ? new Date(booking.scheduleSlot.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '10:00 AM',
        sessionType: booking.sessionType || 'Hatha Yoga',
        teacherName: booking.teacher?.name || 'Instructor TBD',
        venue: booking.venue?.name || 'MATMAX Yoga Studio',
        duration: booking.scheduleSlot?.scheduleTemplate?.sessionDuration?.duration_minutes || 60
      }],
      products: [],
      orderUrl: 'https://matmax.world/bookings',
      websiteUrl: 'https://matmax.world'
    };

    console.log('\n📧 Order data being sent:');
    console.log('  📅 bookingDate:', orderData.bookings[0].bookingDate);
    console.log('  ⏰ bookingTime:', orderData.bookings[0].bookingTime);
    console.log('  📝 sessionType:', orderData.bookings[0].sessionType);
    console.log('  👤 teacherName:', orderData.bookings[0].teacherName);
    console.log('  🏢 venue:', orderData.bookings[0].venue);

    // Simulate the template data mapping that OrderEmailService does
    const templateData = {
      userName: orderData.customerName,
      userEmail: orderData.customerEmail,
      userPhone: orderData.customerPhone || '',
      orderNumber: orderData.orderNumber,
      submissionDate: orderData.orderDate,
      orderTotal: orderData.totalAmount.toFixed(2),
      subtotal: orderData.subtotal.toFixed(2),
      taxAmount: orderData.taxAmount.toFixed(2),
      taxRate: '0',
      shippingAmount: orderData.shippingAmount.toFixed(2),
      totalAmount: orderData.totalAmount.toFixed(2),
      orderUrl: orderData.orderUrl,
      websiteUrl: orderData.websiteUrl,
      adminEmail: 'info@matmax.world',
      hasMatpass: orderData.matpassItems && orderData.matpassItems.length > 0,
      hasBooking: orderData.bookings && orderData.bookings.length > 0,
      hasProducts: orderData.products && orderData.products.length > 0,
      bookings: orderData.bookings || [],
      bookingId: orderData.bookings?.[0]?.bookingId || '',
      bookingDate: orderData.bookings?.[0]?.bookingDate || '',
      bookingTime: orderData.bookings?.[0]?.bookingTime || '',
      sessionType: orderData.bookings?.[0]?.sessionType || '',
      teacherName: orderData.bookings?.[0]?.teacherName || '',
      venue: orderData.bookings?.[0]?.venue || 'MATMAX Yoga Studio',
      bookingPrice: '0.00'
    };

    console.log('\n🎯 Template data mapping:');
    console.log('  📅 bookingDate:', templateData.bookingDate);
    console.log('  ⏰ bookingTime:', templateData.bookingTime);
    console.log('  📝 sessionType:', templateData.sessionType);
    console.log('  👤 teacherName:', templateData.teacherName);
    console.log('  🏢 venue:', templateData.venue);

    // Check if any fields are empty or undefined
    const emptyFields = [];
    if (!templateData.bookingDate) emptyFields.push('bookingDate');
    if (!templateData.bookingTime) emptyFields.push('bookingTime');
    if (!templateData.sessionType) emptyFields.push('sessionType');
    if (!templateData.teacherName || templateData.teacherName === 'Instructor TBD') emptyFields.push('teacherName');
    if (!templateData.venue) emptyFields.push('venue');

    if (emptyFields.length > 0) {
      console.log('\n❌ Empty or undefined fields:', emptyFields);
    } else {
      console.log('\n✅ All booking fields are properly populated');
    }

  } catch (error) {
    console.error('❌ Error debugging booking template data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugBookingTemplateData();
