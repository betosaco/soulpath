#!/usr/bin/env node

/**
 * Create Local Test Us Package Script
 * 
 * This script creates the same "Test Us" package in the local database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createLocalTestUsPackage() {
  console.log('🎯 Creating Local Test Us Package\n');
  console.log('=================================\n');

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
      where: { id: 6 }, // Use same ID as cloud
      update: {
        name: 'Test Us - Only Today!',
        description: 'Special promotional package - 1 session of 60 minutes. Limited time offer!',
        sessionsCount: 1,
        sessionDurationId: sessionDuration.id,
        packageType: 'individual',
        maxGroupSize: 1,
        isActive: true,
        isPopular: true,
        featured: true,
        displayOrder: -1
      },
      create: {
        name: 'Test Us - Only Today!',
        description: 'Special promotional package - 1 session of 60 minutes. Limited time offer!',
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

    console.log('\n🎉 Local Test Us package created successfully!');

  } catch (error) {
    console.error('❌ Error creating local Test Us package:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the creation
createLocalTestUsPackage();
