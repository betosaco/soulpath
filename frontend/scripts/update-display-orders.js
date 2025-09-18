#!/usr/bin/env node

/**
 * Update Display Orders Script
 * 
 * This script updates the display orders for packages in both local and cloud databases
 */

import { PrismaClient } from '@prisma/client';

// Local database
const localPrisma = new PrismaClient();

// Cloud database
const cloudPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.tyiexnwqmlsaxxndrnyk:pSfG5jEEEWtVdvRI@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function updateDisplayOrders(prisma, dbName) {
  console.log(`\n🔧 Updating ${dbName} database display orders...`);
  
  try {
    // Get all active packages
    const packages = await prisma.packageDefinition.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' }
    });

    console.log(`📋 Found ${packages.length} packages in ${dbName}`);

    // Update display orders
    for (let i = 0; i < packages.length; i++) {
      const pkg = packages[i];
      let displayOrder;
      
      if (pkg.name.includes('Test Us')) {
        displayOrder = -1; // First position
      } else {
        displayOrder = i + 1; // Other positions
      }

      await prisma.packageDefinition.update({
        where: { id: pkg.id },
        data: { displayOrder }
      });

      console.log(`✅ ${pkg.name}: displayOrder = ${displayOrder}`);
    }

    // Verify final order
    console.log(`\n📋 Final ${dbName} package order:`);
    const finalPackages = await prisma.packageDefinition.findMany({
      where: { isActive: true },
      include: {
        packagePrices: {
          where: { currencyId: 1 }, // PEN
          select: { price: true }
        }
      },
      orderBy: { displayOrder: 'asc' }
    });

    for (const pkg of finalPackages) {
      const price = pkg.packagePrices[0]?.price || 0;
      const badges = [];
      if (pkg.isPopular) badges.push('⭐');
      if (pkg.featured) badges.push('🔥');
      console.log(`${pkg.displayOrder}. ${pkg.name} - S/. ${price} ${badges.join(' ')}`);
    }

  } catch (error) {
    console.error(`❌ Error updating ${dbName} display orders:`, error);
  }
}

async function main() {
  console.log('🔧 Updating Package Display Orders\n');
  console.log('==================================\n');

  try {
    // Update local database
    await updateDisplayOrders(localPrisma, 'Local');
    
    // Update cloud database
    await updateDisplayOrders(cloudPrisma, 'Cloud');

    console.log('\n🎉 Display orders updated successfully!');

  } catch (error) {
    console.error('❌ Error updating display orders:', error);
  } finally {
    await localPrisma.$disconnect();
    await cloudPrisma.$disconnect();
  }
}

// Run the update
main();
