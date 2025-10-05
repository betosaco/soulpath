import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testPlaceholderMapping() {
  try {
    console.log('🧪 Testing placeholder mapping...\n');
    
    // Sample order data
    const sampleOrderData = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+1234567890',
      orderNumber: 'ORD-12345',
      orderDate: '2025-01-20',
      totalAmount: 100.00,
      subtotal: 84.75,
      taxAmount: 15.25,
      shippingAmount: 0.00,
      currency: 'USD',
      paymentMethod: 'Credit Card',
      matpassItems: [{
        type: 'Monthly MatPass',
        description: 'Unlimited classes for 1 month',
        totalPrice: 100.00,
        sessions: 8,
        expiryDate: '2025-02-20'
      }],
      bookings: [{
        bookingId: 'BK-001',
        bookingDate: '2025-01-22',
        bookingTime: '10:00 AM',
        sessionType: 'Hatha Yoga',
        teacherName: 'Ana Martínez',
        venue: 'MATMAX Studio'
      }],
      products: [{
        name: 'Yoga Mat',
        description: 'Premium yoga mat',
        quantity: 1,
        totalPrice: 0.00
      }]
    };
    
    // Simulate the template data mapping
    const templateData = {
      // Customer data
      userName: sampleOrderData.customerName,
      userEmail: sampleOrderData.customerEmail,
      userPhone: sampleOrderData.customerPhone || '',
      
      // Order data
      orderNumber: sampleOrderData.orderNumber,
      orderDate: sampleOrderData.orderDate,
      subtotal: sampleOrderData.subtotal.toFixed(2),
      taxAmount: sampleOrderData.taxAmount.toFixed(2),
      taxRate: '18',
      totalAmount: sampleOrderData.totalAmount.toFixed(2),
      paymentMethod: sampleOrderData.paymentMethod,
      
      // MatPass data
      matpassType: sampleOrderData.matpassItems?.[0]?.type || '',
      matpassDescription: sampleOrderData.matpassItems?.[0]?.description || '',
      matpassPrice: sampleOrderData.matpassItems?.[0]?.totalPrice?.toFixed(2) || '0.00',
      matpassStartDate: sampleOrderData.orderDate,
      matpassEndDate: sampleOrderData.matpassItems?.[0]?.expiryDate || '',
      matpassSessions: sampleOrderData.matpassItems?.[0]?.sessions || 0,
      
      // Booking data
      bookingDate: sampleOrderData.bookings?.[0]?.bookingDate || '',
      bookingTime: sampleOrderData.bookings?.[0]?.bookingTime || '',
      sessionType: sampleOrderData.bookings?.[0]?.sessionType || '',
      teacherName: sampleOrderData.bookings?.[0]?.teacherName || '',
      venue: sampleOrderData.bookings?.[0]?.venue || '',
      bookingPrice: '0.00',
      
      // Product data
      productName: sampleOrderData.products?.[0]?.name || '',
      productDescription: sampleOrderData.products?.[0]?.description || '',
      productQuantity: sampleOrderData.products?.[0]?.quantity || 0,
      productPrice: sampleOrderData.products?.[0]?.totalPrice?.toFixed(2) || '0.00',
      productsPrice: sampleOrderData.products?.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2) || '0.00',
      
      // Conditional sections
      hasMatpass: sampleOrderData.matpassItems && sampleOrderData.matpassItems.length > 0,
      hasBooking: sampleOrderData.bookings && sampleOrderData.bookings.length > 0,
      hasProducts: sampleOrderData.products && sampleOrderData.products.length > 0
    };
    
    console.log('📊 Template Data Mapping:');
    console.log('  Customer Info:');
    console.log(`    userName: ${templateData.userName}`);
    console.log(`    userEmail: ${templateData.userEmail}`);
    console.log(`    userPhone: ${templateData.userPhone}`);
    
    console.log('\n  Order Info:');
    console.log(`    orderNumber: ${templateData.orderNumber}`);
    console.log(`    orderDate: ${templateData.orderDate}`);
    console.log(`    subtotal: $${templateData.subtotal}`);
    console.log(`    taxAmount: $${templateData.taxAmount}`);
    console.log(`    taxRate: ${templateData.taxRate}%`);
    console.log(`    totalAmount: $${templateData.totalAmount}`);
    console.log(`    paymentMethod: ${templateData.paymentMethod}`);
    
    console.log('\n  MatPass Info:');
    console.log(`    matpassType: ${templateData.matpassType}`);
    console.log(`    matpassDescription: ${templateData.matpassDescription}`);
    console.log(`    matpassPrice: $${templateData.matpassPrice}`);
    console.log(`    matpassStartDate: ${templateData.matpassStartDate}`);
    console.log(`    matpassEndDate: ${templateData.matpassEndDate}`);
    console.log(`    matpassSessions: ${templateData.matpassSessions}`);
    
    console.log('\n  Booking Info:');
    console.log(`    bookingDate: ${templateData.bookingDate}`);
    console.log(`    bookingTime: ${templateData.bookingTime}`);
    console.log(`    sessionType: ${templateData.sessionType}`);
    console.log(`    teacherName: ${templateData.teacherName}`);
    console.log(`    venue: ${templateData.venue}`);
    console.log(`    bookingPrice: $${templateData.bookingPrice}`);
    
    console.log('\n  Product Info:');
    console.log(`    productName: ${templateData.productName}`);
    console.log(`    productDescription: ${templateData.productDescription}`);
    console.log(`    productQuantity: ${templateData.productQuantity}`);
    console.log(`    productPrice: $${templateData.productPrice}`);
    console.log(`    productsPrice: $${templateData.productsPrice}`);
    
    console.log('\n  Conditional Sections:');
    console.log(`    hasMatpass: ${templateData.hasMatpass}`);
    console.log(`    hasBooking: ${templateData.hasBooking}`);
    console.log(`    hasProducts: ${templateData.hasProducts}`);
    
    // Check for empty values
    const emptyValues = [];
    Object.entries(templateData).forEach(([key, value]) => {
      if (value === '' || value === 0 || value === false) {
        emptyValues.push(key);
      }
    });
    
    console.log('\n⚠️ Empty/Zero Values:');
    if (emptyValues.length === 0) {
      console.log('  ✅ No empty values found');
    } else {
      emptyValues.forEach(key => {
        console.log(`  - ${key}: ${templateData[key]}`);
      });
    }
    
    console.log('\n✅ Placeholder mapping test complete!');
    console.log('📧 All booking details should now be populated correctly');
    
  } catch (error) {
    console.error('❌ Error testing placeholder mapping:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPlaceholderMapping();
