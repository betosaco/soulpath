import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    console.log('🌱 Seeding admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [
          { email: 'admin@matmax.store' },
          { role: 'ADMIN' }
        ]
      }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:', existingAdmin.email);
      
      // Update existing admin with new password
      const hashedPassword = await bcrypt.hash('matamx2025', 12);
      const updatedAdmin = await prisma.user.update({
        where: { id: existingAdmin.id },
        data: {
          email: 'admin@matmax.store',
          password: hashedPassword,
          fullName: 'Admin',
          role: 'ADMIN',
          status: 'ACTIVE'
        }
      });
      
      console.log('✅ Admin user updated successfully:', updatedAdmin.email);
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('matamx2025', 12);
      
      const admin = await prisma.user.create({
        data: {
          email: 'admin@matmax.store',
          password: hashedPassword,
          fullName: 'Admin',
          role: 'ADMIN',
          status: 'ACTIVE'
        }
      });
      
      console.log('✅ Admin user created successfully:', admin.email);
    }

    // Also create a customer profile for the admin
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@matmax.store' }
    });

    if (adminUser) {
      const existingCustomer = await prisma.customer.findUnique({
        where: { userId: adminUser.id }
      });

      if (!existingCustomer) {
        await prisma.customer.create({
          data: {
            userId: adminUser.id,
            email: adminUser.email,
            firstName: 'Admin',
            lastName: 'User',
            status: 'ACTIVE'
          }
        });
        console.log('✅ Admin customer profile created');
      } else {
        console.log('ℹ️  Admin customer profile already exists');
      }
    }

  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin()
  .then(() => {
    console.log('🎉 Admin seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Admin seeding failed:', error);
    process.exit(1);
  });
