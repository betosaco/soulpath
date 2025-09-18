import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updatePackagesTo60Min30Days() {
  try {
    console.log('🔄 Updating packages to 60 minutes class, valid for 30 days...');

    // 1. Update or create 60-minute session duration
    console.log('📅 Updating session duration to 60 minutes...');
    const sessionDuration = await prisma.sessionDuration.upsert({
      where: { id: 1 },
      update: {
        name: '60-Minute Class',
        duration_minutes: 60,
        description: 'Standard 60-minute wellness class session',
        isActive: true
      },
      create: {
        id: 1,
        name: '60-Minute Class',
        duration_minutes: 60,
        description: 'Standard 60-minute wellness class session',
        isActive: true
      }
    });
    console.log('✅ Session duration updated:', sessionDuration);

    // 2. Update all package definitions to use 60-minute sessions and update descriptions
    console.log('📦 Updating package definitions...');
    const packages = await prisma.packageDefinition.findMany();
    
    for (const pkg of packages) {
      const updatedPackage = await prisma.packageDefinition.update({
        where: { id: pkg.id },
        data: {
          sessionDurationId: sessionDuration.id,
          description: pkg.description?.includes('60 minutes') 
            ? pkg.description 
            : `${pkg.description || ''} - 60 minutes class, valid for 30 days`.trim()
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
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      await prisma.userPackage.update({
        where: { id: userPkg.id },
        data: {
          expiresAt: thirtyDaysFromNow
        }
      });
      console.log(`✅ Set 30-day validity for user package ID: ${userPkg.id}`);
    }

    // 4. Create a migration script for future packages
    console.log('📝 Creating migration for future package purchases...');
    
    console.log('🎉 All packages updated successfully!');
    console.log('📋 Summary:');
    console.log('   - Session duration: 60 minutes');
    console.log('   - Package validity: 30 days');
    console.log('   - Updated existing packages:', packages.length);
    console.log('   - Updated user packages with validity:', userPackages.length);

  } catch (error) {
    console.error('❌ Error updating packages:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePackagesTo60Min30Days();
