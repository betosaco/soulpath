import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAdminUser() {
  try {
    console.log('🌱 Seeding admin user...');
    
    const adminData = {
      email: 'admin@matmax.world',
      password: 'matmax2025',
      fullName: 'MatMax Admin',
      role: 'ADMIN',
      phone: '+51987654321',
      status: 'ACTIVE',
      language: 'en',
      adminNotes: 'Primary system administrator for MatMax Yoga Studio'
    };
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email.toLowerCase() }
    });

    if (existingUser) {
      console.log('⚠️  User already exists, updating...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(adminData.password, 12);
      
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: { email: adminData.email.toLowerCase() },
        data: {
          password: hashedPassword,
          fullName: adminData.fullName,
          role: adminData.role,
          phone: adminData.phone,
          status: adminData.status,
          language: adminData.language,
          adminNotes: adminData.adminNotes
        }
      });
      
      console.log('✅ Admin user updated successfully!');
      console.log('📧 Email:', updatedUser.email);
      console.log('👤 Full Name:', updatedUser.fullName);
      console.log('🔑 Role:', updatedUser.role);
      console.log('📱 Phone:', updatedUser.phone);
      console.log('🔐 Password: matmax2025');
      
    } else {
      console.log('➕ Creating new admin user...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(adminData.password, 12);
      
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          email: adminData.email.toLowerCase(),
          password: hashedPassword,
          fullName: adminData.fullName,
          role: adminData.role,
          phone: adminData.phone,
          status: adminData.status,
          language: adminData.language,
          adminNotes: adminData.adminNotes
        }
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email:', newUser.email);
      console.log('👤 Full Name:', newUser.fullName);
      console.log('🔑 Role:', newUser.role);
      console.log('📱 Phone:', newUser.phone);
      console.log('🔐 Password: matmax2025');
    }
    
    console.log('\n🎯 Admin credentials:');
    console.log('   Email: admin@matmax.world');
    console.log('   Password: matmax2025');
    console.log('   Role: admin');
    
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedAdminUser();
