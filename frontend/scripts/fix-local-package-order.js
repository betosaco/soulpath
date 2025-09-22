#!/usr/bin/env node

/**
 * Fix Local Package Order Script
 * 
 * This script fixes the display order of packages in the local database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixLocalPackageOrder() {
  console.log('🔧 Fixing Local Package Order\n');
  console.log('============================\n');

  try {
    // Get all packages
    const packages = await prisma.packageDefinition.findMany({
      where: { isActive: true },
      include: {
        packagePrices: {
          where: { currencyId: 1 }, // PEN currency
          select: { price: true }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });

    console.log('📋 Current packages:');
    for (const pkg of packages) {
      const price = pkg.packagePrices[0]?.price || 0;
      console.log(`${pkg.displayOrder}. ${pkg.name} - S/. ${price} (ID: ${pkg.id})`);
    }

    // Find the Test Us package or create it
    let testUsPackage = packages.find(p => p.name.includes('Test Us'));
    
    if (!testUsPackage) {
      console.log('\n📦 Creating Test Us package...');
      testUsPackage = await prisma.packageDefinition.create({
        data: {
          name: 'Test Us - Only Today!',
          description: 'Special promotional package - 1 session of 1 hour. Limited time offer!',
          sessionsCount: 1,
          sessionDurationId: 3, // 60 minutes
          packageType: 'individual',
          maxGroupSize: 1,
          isActive: true,
          isPopular: true,
          featured: true,
          displayOrder: -1
        }
      });

      // Create price
      await prisma.packagePrice.create({
        data: {
          packageDefinitionId: testUsPackage.id,
          currencyId: 1, // PEN
          price: 1.00,
          pricingMode: 'promotional',
          isActive: true
        }
      });

      console.log(`✅ Test Us package created: ${testUsPackage.name} (ID: ${testUsPackage.id})`);
    }

    // Update display orders
    console.log('\n🔧 Updating display orders...');
    
    // Set Test Us to -1 (first)
    await prisma.packageDefinition.update({
      where: { id: testUsPackage.id },
      data: { 
        displayOrder: -1,
        isPopular: true,
        featured: true
      }
    });

    // Set other packages to 1, 2, 3, etc.
    const otherPackages = packages.filter(p => p.id !== testUsPackage.id);
    for (let i = 0; i < otherPackages.length; i++) {
      await prisma.packageDefinition.update({
        where: { id: otherPackages[i].id },
        data: { displayOrder: i + 1 }
      });
    }

    console.log(`✅ Updated ${otherPackages.length + 1} packages display order`);

    // Verify final order
    console.log('\n📋 Final package order:');
    const finalPackages = await prisma.packageDefinition.findMany({
      where: { isActive: true },
      include: {
        packagePrices: {
          where: { currencyId: 1 },
          select: { price: true }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });

    for (const pkg of finalPackages) {
      const price = pkg.packagePrices[0]?.price || 0;
      const badges = [];
      if (pkg.isPopular) badges.push('⭐ Popular');
      if (pkg.featured) badges.push('🔥 Featured');
      console.log(`${pkg.displayOrder}. ${pkg.name} - S/. ${price} ${badges.join(' ')}`);
    }

    console.log('\n🎉 Local package order fixed successfully!');

  } catch (error) {
    console.error('❌ Error fixing local package order:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixLocalPackageOrder();
