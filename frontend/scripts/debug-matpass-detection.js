import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function debugMatpassDetection() {
  try {
    console.log('🔍 Debugging MatPass detection...\n');
    
    // Check user packages for betosaco@gmail.com
    const user = await prisma.user.findFirst({
      where: {
        email: 'betosaco@gmail.com'
      }
    });
    
    if (!user) {
      console.log('❌ User not found: betosaco@gmail.com');
      return;
    }
    
    console.log(`👤 User found: ${user.email} (ID: ${user.id})`);
    
    // Check user packages
    const userPackages = await prisma.userPackage.findMany({
      where: {
        userId: user.id
      }
    });
    
    console.log(`\n📦 User Packages (${userPackages.length}):`);
    userPackages.forEach((pkg, index) => {
      console.log(`  ${index + 1}. Package ID: ${pkg.id}`);
      console.log(`     Active: ${pkg.isActive}`);
      console.log(`     Expires: ${pkg.expiresAt}`);
      console.log(`     Package Price ID: ${pkg.packagePriceId}`);
      console.log(`     Quantity: ${pkg.quantity}`);
      console.log(`     Sessions Used: ${pkg.sessionsUsed}`);
    });
    
    // Check for active packages
    const activePackages = userPackages.filter(pkg => 
      pkg.isActive && 
      pkg.expiresAt && 
      pkg.expiresAt > new Date()
    );
    
    console.log(`\n✅ Active Packages: ${activePackages.length}`);
    
    if (activePackages.length > 0) {
      console.log('🎯 MatPass Detection Should Work:');
      activePackages.forEach((pkg, index) => {
        console.log(`  ${index + 1}. Package ID: ${pkg.id}`);
        console.log(`     Expires: ${pkg.expiresAt}`);
        console.log(`     Sessions Used: ${pkg.sessionsUsed}`);
      });
      
      // Simulate the getUserActiveMatPass function
      const matpassItems = activePackages.map(pkg => ({
        name: `MatPass Package ${pkg.id}`,
        type: 'MatPass',
        quantity: pkg.quantity || 1,
        unitPrice: 0, // Price not available in this schema
        totalPrice: 0,
        sessions: 8, // Default sessions
        expiryDate: pkg.expiresAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
      }));
      
      console.log('\n📧 MatPass Items for Template:');
      console.log(JSON.stringify(matpassItems, null, 2));
      
      console.log('\n🎯 Template Routing:');
      console.log(`  hasMatpass: ${matpassItems.length > 0}`);
      console.log(`  Template: ${matpassItems.length > 0 ? 'renewal_matpass' : 'booking_only'}`);
      
    } else {
      console.log('❌ No Active MatPass Found');
      console.log('  This explains why you\'re getting booking_only template');
      console.log('  The system thinks you don\'t have an active MatPass');
    }
    
  } catch (error) {
    console.error('❌ Error debugging MatPass detection:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugMatpassDetection();
