import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testOrderEmailIntegration() {
  try {
    console.log('🧪 Testing Order Email Integration...');
    
    // Test data
    const testOrderData = {
      // Customer Information
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '+51 999 999 999',
      
      // Order Information
      orderNumber: 'TEST-001',
      orderDate: new Date().toISOString(),
      totalAmount: 150.00,
      currency: 'PEN',
      subtotal: 127.12,
      taxAmount: 22.88,
      shippingAmount: 0,
      
      // Order Items
      orderItems: [
        {
          name: 'MATPASS 5 Sessions',
          type: 'MATPASS',
          quantity: 1,
          unitPrice: 100.00,
          totalPrice: 100.00,
          description: '5 yoga sessions package'
        },
        {
          name: 'Yoga Mat',
          type: 'PRODUCT',
          quantity: 1,
          unitPrice: 50.00,
          totalPrice: 50.00,
          description: 'Premium yoga mat'
        }
      ],
      
      // MATPASS Information
      matpassItems: [
        {
          name: 'MATPASS 5 Sessions',
          type: 'MATPASS',
          quantity: 1,
          unitPrice: 100.00,
          totalPrice: 100.00,
          sessions: 5,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
        }
      ],
      
      // Booking Information
      bookings: [
        {
          bookingId: 'BOOK-001',
          bookingDate: 'Monday, January 15, 2025',
          bookingTime: '10:00 AM',
          sessionType: 'Hatha Yoga',
          teacherName: 'Maria Rodriguez',
          venue: 'MATMAX Yoga Studio',
          duration: 60
        }
      ],
      
      // Product Information
      products: [
        {
          name: 'Yoga Mat',
          type: 'PRODUCT',
          quantity: 1,
          unitPrice: 50.00,
          totalPrice: 50.00,
          description: 'Premium yoga mat'
        }
      ],
      
      // Shipping Information
      shippingAddress: {
        address: 'Av. Larco 123',
        city: 'Miraflores',
        state: 'Lima',
        zipCode: '15074',
        country: 'Peru'
      },
      
      // URLs
      orderUrl: 'https://matmax.world/account/orders/TEST-001',
      websiteUrl: 'https://matmax.world'
    };

    // Import and test the service
    const { OrderEmailService } = await import('../lib/communication/order-email-service.ts');
    
    console.log('📧 Sending test order confirmation email...');
    const result = await OrderEmailService.sendOrderConfirmationEmail(testOrderData);
    
    if (result) {
      console.log('✅ Test email sent successfully!');
      console.log('📧 Check the email inbox for: test@example.com');
      console.log('📧 BCC copy sent to: alberto@matmax.world');
    } else {
      console.log('❌ Test email failed to send');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testOrderEmailIntegration();
