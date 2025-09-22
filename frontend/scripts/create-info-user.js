import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createInfoUser() {
  try {
    console.log('🔄 Creating info@matmax.store user account...');

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'info@matmax.store' }
    });

    if (existingUser) {
      console.log('✅ User already exists:', existingUser.id);
      return existingUser.id;
    }

    // Create user
    const hashedPassword = await bcrypt.hash('MatMax2025!@#', 12);
    const user = await prisma.user.create({
      data: {
        email: 'info@matmax.store',
        password: hashedPassword,
        fullName: 'MatMax Info',
        role: 'ADMIN'
      }
    });

    console.log('✅ User created successfully!');
    console.log('User ID:', user.id);
    console.log('Email:', user.email);
    console.log('Password: MatMax2025!@# (CHANGE THIS!)');

    return user.id;

  } catch (error) {
    console.error('❌ Error creating user:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

createInfoUser();
