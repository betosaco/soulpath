import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function createTestToken() {
  try {
    // Create a test JWT token for admin user
    const payload = {
      userId: 'test-admin-id',
      email: 'admin@matmax.world',
      role: 'ADMIN',
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
    };
    
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(payload, secret);
    
    console.log('🔑 Test token created:', token.substring(0, 50) + '...');
    
    // Test the API with the token
    const response = await fetch('http://localhost:3000/api/admin/communication/templates?type=email', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API working! Found templates:', data.templates?.length || 0);
    } else {
      const error = await response.json();
      console.log('❌ API error:', error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestToken();
