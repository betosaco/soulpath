#!/usr/bin/env node

/**
 * Fix Local Package Prices Script
 * 
 * This script fixes the package prices in the local database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixLocalPackagePrices() {
  console.log('💰 Fixing Local Package Prices\n');
  console.log('==============================\n');

  try {
    // Get PEN currency
    const penCurrency = await prisma.currency.findUnique({ 
      where: { code: 'PEN' } 
    });
    
    if (!penCurrency) {
      throw new Error('PEN currency not found');
    }

    console.log(`💰 Currency: ${penCurrency.name} (${penCurrency.code})`);

    // Define package prices
    const packagePrices = [
      { packageId: 1, name: '24 MATPASS', price: 530.00 },
      { packageId: 2, name: '01 MATPASS', price: 60.00 },
      { packageId: 3, name: '08 MATPASS', price: 350.00 },
      { packageId: 4, name: '12 MATPASS', price: 420.00 },
      { packageId: 5, name: '04 MATPASS', price: 190.00 },
      { packageId: 6, name: 'Test Us - Only Today!', price: 1.00 }
    ];

    console.log('\n💲 Creating/updating package prices...');
    
    for (const pkgPrice of packagePrices) {
      const price = await prisma.packagePrice.upsert({
        where: { 
          packageDefinitionId_currencyId: { 
            packageDefinitionId: pkgPrice.packageId, 
            currencyId: penCurrency.id 
          } 
        },
        update: {
          price: pkgPrice.price,
          pricingMode: pkgPrice.packageId === 6 ? 'promotional' : 'custom',
          isActive: true
        },
        create: {
          packageDefinitionId: pkgPrice.packageId,
          currencyId: penCurrency.id,
          price: pkgPrice.price,
          pricingMode: pkgPrice.packageId === 6 ? 'promotional' : 'custom',
          isActive: true
        }
      });

      console.log(`✅ ${pkgPrice.name}: S/. ${price.price} (${price.pricingMode})`);
    }

    // Verify final prices
    console.log('\n📋 Final package prices:');
    const packages = await prisma.packageDefinition.findMany({
      where: { isActive: true },
      include: {
        packagePrices: {
          where: { currencyId: penCurrency.id },
          select: { price: true, pricingMode: true }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });

    for (const pkg of packages) {
      const price = pkg.packagePrices[0]?.price || 0;
      const pricingMode = pkg.packagePrices[0]?.pricingMode || 'unknown';
      const badges = [];
      if (pkg.isPopular) badges.push('⭐ Popular');
      if (pkg.featured) badges.push('🔥 Featured');
      console.log(`${pkg.displayOrder}. ${pkg.name} - S/. ${price} (${pricingMode}) ${badges.join(' ')}`);
    }

    console.log('\n🎉 Local package prices fixed successfully!');

  } catch (error) {
    console.error('❌ Error fixing local package prices:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixLocalPackagePrices();
