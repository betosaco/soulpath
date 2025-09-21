import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testPaymentSuccessEmail() {
  console.log('🧪 Testing Payment Success Email Flow\n');

  try {
    // Simulate payment success data
    const mockPaymentData = {
      orderStatus: 'PAID',
      orderId: `TEST-${Date.now()}`,
      amount: 15000, // 150.00 in cents
      currency: { symbol: 'S/.', code: 'PEN' },
      packageData: {
        id: 1,
        name: 'Paquete de 4 Sesiones',
        description: '4 sesiones de yoga de 60 minutos cada una',
        sessionsCount: 4,
        price: 150.00,
        packageType: 'individual',
        maxGroupSize: 1,
        sessionDuration: {
          id: 1,
          name: '60 Minutes',
          duration_minutes: 60,
          description: 'Standard 60-minute session'
        }
      },
      bookingData: {
        clientName: 'Test User',
        clientEmail: 'test@example.com',
        clientPhone: '+51987654321'
      },
      paymentData: {
        transactionId: `TXN-${Date.now()}`,
        paymentMethod: 'Online Payment'
      }
    };

    console.log('📋 Mock Payment Data:');
    console.log('- Order ID:', mockPaymentData.orderId);
    console.log('- Amount:', mockPaymentData.amount / 100, mockPaymentData.currency.symbol);
    console.log('- Package:', mockPaymentData.packageData.name);
    console.log('- Sessions:', mockPaymentData.packageData.sessionsCount);

    // Test the API endpoint
    console.log('\n📧 Testing API endpoint...');
    
    const response = await fetch('http://localhost:3000/api/client/send-payment-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // This will fail auth, but we can see the flow
      },
      body: JSON.stringify(mockPaymentData)
    });

    const result = await response.json();
    console.log('📤 API Response:', result);

    if (response.ok) {
      console.log('✅ Payment success email test completed successfully');
    } else {
      console.log('⚠️ API call failed (expected due to auth):', result.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPaymentSuccessEmail();
