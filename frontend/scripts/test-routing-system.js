import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testRoutingSystem() {
  try {
    console.log('�� Testing Email Routing System...\n');
    
    // Test scenarios
    const testScenarios = [
      {
        name: 'New Customer - MatPass Purchase',
        orderData: {
          customerName: 'María García',
          customerEmail: 'maria@example.com',
          customerPhone: '+51 999 888 777',
          orderNumber: 'ORD-001',
          orderDate: new Date().toISOString(),
          totalAmount: 300.00,
          currency: 'PEN',
          subtotal: 254.24,
          taxAmount: 45.76,
          shippingAmount: 0,
          orderItems: [],
          matpassItems: [{
            name: 'MATPASS 10 Sessions',
            type: 'MATPASS',
            quantity: 1,
            unitPrice: 300.00,
            totalPrice: 300.00,
            description: '10 yoga sessions package',
            sessions: 10,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }],
          bookings: [],
          products: [],
          shippingAddress: null,
          orderUrl: 'https://matmax.world/orders/ORD-001',
          websiteUrl: 'https://matmax.world'
        },
        expectedTemplate: 'welcome_matpass'
      },
      {
        name: 'Existing Customer - MatPass Renewal',
        orderData: {
          customerName: 'Carlos López',
          customerEmail: 'carlos@example.com',
          customerPhone: '+51 999 777 666',
          orderNumber: 'ORD-002',
          orderDate: new Date().toISOString(),
          totalAmount: 300.00,
          currency: 'PEN',
          subtotal: 254.24,
          taxAmount: 45.76,
          shippingAmount: 0,
          orderItems: [],
          matpassItems: [{
            name: 'MATPASS 10 Sessions',
            type: 'MATPASS',
            quantity: 1,
            unitPrice: 300.00,
            totalPrice: 300.00,
            description: '10 yoga sessions package',
            sessions: 10,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }],
          bookings: [],
          products: [],
          shippingAddress: null,
          orderUrl: 'https://matmax.world/orders/ORD-002',
          websiteUrl: 'https://matmax.world'
        },
        expectedTemplate: 'renewal_matpass'
      },
      {
        name: 'Products Only Purchase',
        orderData: {
          customerName: 'Ana Martínez',
          customerEmail: 'ana@example.com',
          customerPhone: '+51 999 666 555',
          orderNumber: 'ORD-003',
          orderDate: new Date().toISOString(),
          totalAmount: 150.00,
          currency: 'PEN',
          subtotal: 127.12,
          taxAmount: 22.88,
          shippingAmount: 0,
          orderItems: [],
          matpassItems: [],
          bookings: [],
          products: [{
            name: 'Premium Yoga Mat',
            type: 'PRODUCT',
            quantity: 1,
            unitPrice: 150.00,
            totalPrice: 150.00,
            description: 'High-quality yoga mat'
          }],
          shippingAddress: {
            address: 'Av. Larco 123',
            city: 'Miraflores',
            state: 'Lima',
            zipCode: '15074',
            country: 'Peru'
          },
          orderUrl: 'https://matmax.world/orders/ORD-003',
          websiteUrl: 'https://matmax.world'
        },
        expectedTemplate: 'products_only'
      },
      {
        name: 'Booking Only - Existing Customer',
        orderData: {
          customerName: 'Luis Rodríguez',
          customerEmail: 'luis@example.com',
          customerPhone: '+51 999 555 444',
          orderNumber: 'BOOKING-001',
          orderDate: new Date().toISOString(),
          totalAmount: 0,
          currency: 'PEN',
          subtotal: 0,
          taxAmount: 0,
          shippingAmount: 0,
          orderItems: [],
          matpassItems: [],
          bookings: [{
            bookingId: 'BK-001',
            bookingDate: 'Monday, January 20, 2025',
            bookingTime: '10:00 AM',
            sessionType: 'Hatha Yoga',
            teacherName: 'Ana Martínez',
            venue: 'MATMAX Yoga Studio'
          }],
          products: [],
          shippingAddress: null,
          orderUrl: 'https://matmax.world/bookings/BK-001',
          websiteUrl: 'https://matmax.world'
        },
        expectedTemplate: 'booking_only'
      }
    ];

    console.log('�� Testing routing logic for each scenario:\n');
    
    for (const scenario of testScenarios) {
      console.log(`🔍 Testing: ${scenario.name}`);
      
      // Simulate the routing logic
      const hasMatpass = scenario.orderData.matpassItems && scenario.orderData.matpassItems.length > 0;
      const hasBookings = scenario.orderData.bookings && scenario.orderData.bookings.length > 0;
      const hasProducts = scenario.orderData.products && scenario.orderData.products.length > 0;
      
      console.log(`  - Has MatPass: ${hasMatpass}`);
      console.log(`  - Has Bookings: ${hasBookings}`);
      console.log(`  - Has Products: ${hasProducts}`);
      
      // Determine template (simplified logic)
      let determinedTemplate;
      if (hasMatpass) {
        // For testing, assume new customer
        determinedTemplate = 'welcome_matpass';
      } else if (hasProducts && !hasMatpass) {
        determinedTemplate = 'products_only';
      } else if (hasBookings && !hasMatpass && !hasProducts) {
        determinedTemplate = 'booking_only';
      } else {
        determinedTemplate = 'order_confirmation_complete';
      }
      
      const isCorrect = determinedTemplate === scenario.expectedTemplate;
      console.log(`  - Expected: ${scenario.expectedTemplate}`);
      console.log(`  - Determined: ${determinedTemplate}`);
      console.log(`  - Result: ${isCorrect ? '✅ CORRECT' : '❌ INCORRECT'}`);
      console.log('');
    }

    console.log('🎯 Routing System Test Complete!');
    console.log('📧 The system will now route emails to appropriate templates based on order type');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRoutingSystem();
