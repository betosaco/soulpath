import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testEmailSendingManually() {
  const orderNumber = 'ORD-1759641612312-4301-965416-ET4LL29P9';

  try {
    console.log(`🔍 Testing manual email sending for order: ${orderNumber}`);

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

    // Get all bookings for this order
    const userPackageIds = (await prisma.userPackage.findMany({
      where: {
        userId: order.customerId,
        createdAt: {
          gte: new Date(order.createdAt.getTime() - 10000),
          lte: new Date(order.createdAt.getTime() + 60000)
        }
      }
    })).map(up => up.id);

    const bookings = await prisma.booking.findMany({
      where: {
        userPackageId: { in: userPackageIds },
        userId: order.customerId
      },
      include: {
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

    // Prepare email data
    const templateEmailData = {
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt.toISOString(),
      totalAmount: Number(order.total),
      currency: order.currency,
      subtotal: Number(order.subtotal || order.total),
      taxAmount: Number(order.taxAmount || 0),
      shippingAmount: Number(order.shippingAmount || 0),

      orderItems: order.items.map(item => ({
        name: item.packagePrice?.packageDefinition?.name || item.product?.name || 'Unknown Item',
        type: item.itemType === 'PACKAGE' ? 'MATPASS' : 'Producto',
        quantity: item.quantity,
        unitPrice: Number(item.price),
        totalPrice: Number(item.price) * item.quantity,
        description: item.packagePrice?.packageDefinition?.description || item.product?.description
      })),

      matpassItems: order.items
        .filter(item => item.itemType === 'PACKAGE')
        .map(item => ({
          name: item.packagePrice?.packageDefinition?.name || 'Unknown Package',
          type: 'MATPASS',
          quantity: item.quantity,
          unitPrice: Number(item.price),
          totalPrice: Number(item.price) * item.quantity,
          sessions: item.packagePrice?.packageDefinition?.sessionsCount || 0,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        })),

      bookings: bookings.map(booking => ({
        bookingDate: booking.teacherScheduleSlot?.startTime ? booking.teacherScheduleSlot.startTime.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : '',
        bookingTime: booking.teacherScheduleSlot?.startTime ? booking.teacherScheduleSlot.startTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }) : '',
        sessionType: booking.sessionType || 'Yoga Class',
        teacherName: booking.teacherScheduleSlot?.teacherSchedule?.teacher?.name || 'To be assigned',
        venue: booking.teacherScheduleSlot?.teacherSchedule?.venue?.name || 'MATMAX Yoga Studio',
        duration: 60
      })),

      products: order.items
        .filter(item => item.itemType === 'PRODUCT')
        .map(item => ({
          name: item.product?.name || 'Unknown Product',
          type: 'Producto',
          quantity: item.quantity,
          unitPrice: Number(item.price),
          totalPrice: Number(item.price) * item.quantity,
          description: item.product?.description
        })),

      shippingAddress: order.shippingAddress ? {
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        zipCode: order.shippingAddress.zipCode,
        country: order.shippingAddress.country
      } : undefined,

      paymentMethod: order.paymentMethod,
      isPayLater: order.paymentMethod === 'pay_later',

      orderUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order-confirmation?orderId=${order.id}`,
      websiteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    };

    console.log('\n📧 Prepared Email Data:');
    console.log(`Customer: ${templateEmailData.customerEmail}`);
    console.log(`MatPass items: ${templateEmailData.matpassItems?.length || 0}`);
    console.log(`Bookings: ${templateEmailData.bookings?.length || 0}`);
    console.log(`Products: ${templateEmailData.products?.length || 0}`);
    console.log(`Payment method: ${templateEmailData.paymentMethod}`);

    console.log('\n📧 Email Items Detail:');
    templateEmailData.orderItems.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name} (${item.type}) - ${item.quantity}x`);
    });

    console.log('\n📧 MatPass Items Detail:');
    (templateEmailData.matpassItems || []).forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name} - Sessions: ${item.sessions}`);
    });

    console.log('\n📧 Bookings Detail:');
    (templateEmailData.bookings || []).forEach((booking, index) => {
      console.log(`  ${index + 1}. ${booking.bookingDate} ${booking.bookingTime} - ${booking.teacherName}`);
    });

    // Try to send the email manually
    console.log('\n📧 Attempting Manual Email Send...');

    try {
      // Import the email service
      const { OrderEmailService } = await import('../lib/communication/order-email-service.js');

      console.log('✅ Email service imported successfully');

      const result = await OrderEmailService.sendOrderConfirmationEmail(templateEmailData, 'es');

      if (result) {
        console.log('✅ Email sent successfully!');
      } else {
        console.log('❌ Email sending failed');
      }

    } catch (emailError) {
      console.log('❌ Email service error:', emailError.message);
      console.log('Full error:', emailError);
    }

  } catch (error) {
    console.error('❌ Error in manual email test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEmailSendingManually();

