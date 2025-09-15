import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updateAdminPassword() {
  try {
    console.log('🔐 Updating admin user password...');
    
    const email = 'admin@matmax.store';
    const newPassword = 'matmax2025';
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!existingUser) {
      console.log('❌ User not found:', email);
      return;
    }

    console.log('✅ Found user:', existingUser.email, 'Role:', existingUser.role);
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update the user with new password
    const updatedUser = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        password: hashedPassword,
        fullName: 'MatMax Admin',
        role: 'admin',
        status: 'active'
      }
    });
    
    console.log('✅ Admin user updated successfully!');
    console.log('📧 Email:', updatedUser.email);
    console.log('👤 Full Name:', updatedUser.fullName);
    console.log('🔑 Role:', updatedUser.role);
    console.log('🔐 Password updated to: matmax2025');
    console.log('📅 Updated at:', updatedUser.updatedAt);
    
  } catch (error) {
    console.error('❌ Error updating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();
