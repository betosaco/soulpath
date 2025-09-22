#!/usr/bin/env node

/**
 * Create Test Us Package Script
 * 
 * This script creates a special "Test Us" package for S/. 1 with "only for today" label
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.tyiexnwqmlsaxxndrnyk:pSfG5jEEEWtVdvRI@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function createTestUsPackage() {
  console.log('🎯 Creating Test Us Package\n');
  console.log('==========================\n');

  try {
    // Get PEN currency
    const penCurrency = await prisma.currency.findUnique({ 
      where: { code: 'PEN' } 
    });
    
    if (!penCurrency) {
      throw new Error('PEN currency not found');
    }

    // Get 60-minute session duration
    const sessionDuration = await prisma.sessionDuration.findFirst({
      where: { duration_minutes: 60 }
    });

    if (!sessionDuration) {
      throw new Error('60-minute session duration not found');
    }

    console.log(`💰 Currency: ${penCurrency.name} (${penCurrency.code})`);
    console.log(`⏱️ Session Duration: ${sessionDuration.name} (${sessionDuration.duration_minutes} minutes)`);

    // Create the Test Us package definition
    console.log('\n📦 Creating Test Us package definition...');
    const testUsPackage = await prisma.packageDefinition.upsert({
      where: { id: 999 }, // Use a high ID to ensure it appears first
      update: {
        name: 'Test Us - Only Today!',
        description: 'Special promotional package - 1 session of 1 hour. Limited time offer!',
        sessionsCount: 1,
        sessionDurationId: sessionDuration.id,
        packageType: 'individual',
        maxGroupSize: 1,
        isActive: true,
        isPopular: true, // Make it stand out
        featured: true,  // Make it featured
        displayOrder: -1 // Negative order to appear first
      },
      create: {
        name: 'Test Us - Only Today!',
        description: 'Special promotional package - 1 session of 1 hour. Limited time offer!',
        sessionsCount: 1,
        sessionDurationId: sessionDuration.id,
        packageType: 'individual',
        maxGroupSize: 1,
        isActive: true,
        isPopular: true,
        featured: true,
        displayOrder: -1
      }
    });

    console.log(`✅ Test Us package created: ${testUsPackage.name} (ID: ${testUsPackage.id})`);

    // Create the package price
    console.log('\n💲 Creating Test Us package price...');
    const testUsPrice = await prisma.packagePrice.upsert({
      where: { 
        packageDefinitionId_currencyId: { 
          packageDefinitionId: testUsPackage.id, 
          currencyId: penCurrency.id 
        } 
      },
      update: {
        price: 1.00,
        pricingMode: 'promotional',
        isActive: true
      },
      create: {
        packageDefinitionId: testUsPackage.id,
        currencyId: penCurrency.id,
        price: 1.00,
        pricingMode: 'promotional',
        isActive: true
      }
    });

    console.log(`✅ Test Us price created: S/. ${testUsPrice.price} (${testUsPrice.pricingMode})`);

    // Update other packages to have higher display order
    console.log('\n📋 Updating other packages display order...');
    const otherPackages = await prisma.packageDefinition.findMany({
      where: {
        id: { not: testUsPackage.id },
        isActive: true
      }
    });

    for (let i = 0; i < otherPackages.length; i++) {
      await prisma.packageDefinition.update({
        where: { id: otherPackages[i].id },
        data: { displayOrder: i + 1 }
      });
    }

    console.log(`✅ Updated ${otherPackages.length} other packages display order`);

    // Verify the final package order
    console.log('\n📋 Final package order:');
    const allPackages = await prisma.packageDefinition.findMany({
      where: { isActive: true },
      include: {
        packagePrices: {
          where: { currencyId: penCurrency.id },
          select: { price: true }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });

    for (const pkg of allPackages) {
      const price = pkg.packagePrices[0]?.price || 0;
      console.log(`${pkg.displayOrder}. ${pkg.name} - S/. ${price} (${pkg.isPopular ? '⭐ Popular' : ''}${pkg.featured ? ' 🔥 Featured' : ''})`);
    }

    console.log('\n🎉 Test Us package created successfully!');
    console.log('\n✨ Features:');
    console.log('   • Price: S/. 1.00');
    console.log('   • Label: "Only Today!"');
    console.log('   • Position: First (before 60 soles packages)');
    console.log('   • Special: Popular & Featured');

  } catch (error) {
    console.error('❌ Error creating Test Us package:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the creation
createTestUsPackage();
