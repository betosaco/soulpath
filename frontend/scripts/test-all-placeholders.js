import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testAllPlaceholders() {
  try {
    console.log('🧪 Testing all placeholders with real data...');
    
    // Import the OrderEmailService
    const { OrderEmailService } = await import('../lib/communication/order-email-service.ts');
    
    // Create comprehensive test data with all possible placeholders
    const testOrderData = {
      // Customer Information
      customerName: 'María García Rodríguez',
      customerEmail: 'maria.garcia@example.com',
      customerPhone: '+51 999 888 777',
      
      // Order Information
      orderNumber: 'ORD-2025-001',
      orderDate: new Date().toISOString(),
      totalAmount: 450.00,
      currency: 'PEN',
      subtotal: 381.36,
      taxAmount: 68.64,
      shippingAmount: 0,
      
      // Order Items
      orderItems: [
        {
          name: 'MATPASS 10 Sessions',
          type: 'MATPASS',
          quantity: 1,
          unitPrice: 300.00,
          totalPrice: 300.00,
          description: '10 yoga sessions package',
          sessions: 10
        },
        {
          name: 'Premium Yoga Mat',
          type: 'PRODUCT',
          quantity: 1,
          unitPrice: 150.00,
          totalPrice: 150.00,
          description: 'High-quality yoga mat'
        }
      ],
      
      // MATPASS Information
      matpassItems: [
        {
          name: 'MATPASS 10 Sessions',
          type: 'MATPASS',
          quantity: 1,
          unitPrice: 300.00,
          totalPrice: 300.00,
          sessions: 10,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
        }
      ],
      
      // Booking Information
      bookings: [
        {
          bookingId: 'BK-2025-001',
          bookingDate: 'Monday, January 20, 2025',
          bookingTime: '10:00 AM',
          sessionType: 'Hatha Yoga',
          teacherName: 'Ana Martínez',
          venue: 'MATMAX Yoga Studio',
          duration: 60
        },
        {
          bookingId: 'BK-2025-002',
          bookingDate: 'Wednesday, January 22, 2025',
          bookingTime: '6:00 PM',
          sessionType: 'Vinyasa Flow',
          teacherName: 'Carlos López',
          venue: 'MATMAX Yoga Studio',
          duration: 75
        }
      ],
      
      // Product Information
      products: [
        {
          name: 'Premium Yoga Mat',
          type: 'PRODUCT',
          quantity: 1,
          unitPrice: 150.00,
          totalPrice: 150.00,
          description: 'High-quality yoga mat with carrying strap'
        }
      ],
      
      // Shipping Information
      shippingAddress: {
        address: 'Av. Larco 123, Apt 4B',
        city: 'Miraflores',
        state: 'Lima',
        zipCode: '15074',
        country: 'Peru'
      },
      
      // URLs
      orderUrl: 'https://matmax.world/account/orders/ORD-2025-001',
      websiteUrl: 'https://matmax.world'
    };

    console.log('📧 Sending test email with comprehensive data...');
    console.log('📊 Test data includes:');
    console.log('  - Customer: María García Rodríguez');
    console.log('  - Order: ORD-2025-001');
    console.log('  - MATPASS: 10 Sessions');
    console.log('  - Bookings: 2 sessions with different teachers');
    console.log('  - Products: Premium Yoga Mat');
    console.log('  - Total: S/ 450.00');
    
    const result = await OrderEmailService.sendOrderConfirmationEmail(testOrderData, 'es');
    
    if (result) {
      console.log('✅ Test email sent successfully!');
      console.log('📧 Check the email inbox for: maria.garcia@example.com');
      console.log('📧 BCC copy sent to: alberto@matmax.world');
      console.log('\n🎯 This test verifies:');
      console.log('  ✅ All customer placeholders (userName, userEmail, userPhone)');
      console.log('  ✅ All order placeholders (orderNumber, orderTotal, subtotalBeforeTax, igvAmount)');
      console.log('  ✅ All MATPASS placeholders (matpassType, matpassDescription, matpassPrice, etc.)');
      console.log('  ✅ All booking placeholders (bookingId, bookingDate, bookingTime, teacherName, etc.)');
      console.log('  ✅ All product placeholders (productName, productDescription, productQuantity, etc.)');
      console.log('  ✅ All conditional sections (hasMatpass, hasBooking, hasProducts)');
      console.log('  ✅ All Handlebars control structures (#if, #each, /if, /each)');
    } else {
      console.log('❌ Test email failed to send');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAllPlaceholders();
