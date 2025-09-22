import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateTo1HourClasses() {
  try {
    console.log('🔄 Updating telegram bot service to use 1-hour classes...');

    // 1. Update session duration ID 1 to 1 hour (60 minutes)
    console.log('📅 Updating session duration to 1 hour...');
    const sessionDuration = await prisma.sessionDuration.upsert({
      where: { id: 1 },
      update: {
        name: '1 Hour',
        duration_minutes: 60,
        description: 'Standard 1-hour wellness class',
        isActive: true
      },
      create: {
        id: 1,
        name: '1 Hour',
        duration_minutes: 60,
        description: 'Standard 1-hour wellness class',
        isActive: true
      }
    });
    console.log('✅ Session duration updated:', sessionDuration);

    // 2. Update all package definitions to use 1-hour sessions and update descriptions
    console.log('📦 Updating package definitions...');
    const packages = await prisma.packageDefinition.findMany();
    
    for (const pkg of packages) {
      const updatedPackage = await prisma.packageDefinition.update({
        where: { id: pkg.id },
        data: {
          sessionDurationId: sessionDuration.id,
          description: pkg.description?.includes('1 hour') 
            ? pkg.description 
            : pkg.description?.replace(/60 minutes/g, '1 hour') || `${pkg.description || ''} - 1 hour class, valid for 30 days`.trim()
        }
      });
      console.log(`✅ Updated package: ${updatedPackage.name}`);
    }

    // 3. Update existing user packages to have 30-day validity
    console.log('⏰ Setting 30-day validity for existing user packages...');
    const userPackages = await prisma.userPackage.findMany({
      where: {
        expiresAt: null // Only update packages without expiration
      }
    });

    for (const userPkg of userPackages) {
      const updatedUserPackage = await prisma.userPackage.update({
        where: { id: userPkg.id },
        data: {
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        }
      });
      console.log(`✅ Updated user package: ${updatedUserPackage.id}`);
    }

    console.log('');
    console.log('🎉 Successfully updated telegram bot service to use 1-hour classes!');
    console.log('');
    console.log('📊 Updated:');
    console.log(`   ⏱️ Session duration: ${sessionDuration.name} (${sessionDuration.duration_minutes} minutes)`);
    console.log(`   📦 Package definitions: ${packages.length}`);
    console.log(`   📦 User packages: ${userPackages.length}`);
    console.log('');
    console.log('🚀 Your telegram bot service now uses 1-hour classes!');

  } catch (error) {
    console.error('❌ Error updating to 1-hour classes:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateTo1HourClasses()
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
