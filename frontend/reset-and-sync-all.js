#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

// Create two Prisma clients - one for local, one for production
const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:@localhost:5432/wellness_db"
    }
  }
});

const productionPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.tyiexnwqmlsaxxndrnyk:pSfG5jEEEWtVdvRI@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function resetProductionDatabase() {
  try {
    console.log('🗑️  Resetting production database to avoid duplicates...');
    
    // Delete in reverse dependency order to avoid foreign key constraints
    const tables = [
      'scheduleSlot',
      'scheduleTemplate', 
      'teacherScheduleSlot',
      'teacherSchedule',
      'teacherServiceType',
      'teacherSpecialty',
      'teacherLanguage',
      'teacherCertification',
      'teacher',
      'venueAmenity',
      'venue',
      'packagePrice',
      'packageService',
      'packageDefinition',
      'servicePrice',
      'serviceType',
      'sessionDuration',
      'product',
      'currency'
    ];
    
    for (const table of tables) {
      try {
        console.log(`🗑️  Clearing ${table}...`);
        await productionPrisma[table].deleteMany({});
      } catch (error) {
        console.log(`⚠️  Could not clear ${table}: ${error.message}`);
      }
    }
    
    console.log('✅ Production database reset completed!');
  } catch (error) {
    console.error('❌ Error resetting production database:', error);
  }
}

async function syncCurrencies() {
  try {
    console.log('🔄 Starting currency sync...');
    
    const localCurrencies = await localPrisma.currency.findMany();
    console.log(`💰 Found ${localCurrencies.length} currencies in local database`);
    
    for (const currency of localCurrencies) {
      console.log(`➕ Syncing currency: ${currency.code}`);
      await productionPrisma.currency.create({
        data: currency
      });
    }
    
    console.log('✅ Currency sync completed!');
  } catch (error) {
    console.error('❌ Error syncing currencies:', error);
  }
}

async function syncProducts() {
  try {
    console.log('🔄 Starting product sync...');
    
    const localProducts = await localPrisma.product.findMany();
    console.log(`📦 Found ${localProducts.length} products in local database`);
    
    for (const product of localProducts) {
      console.log(`➕ Syncing product: ${product.name}`);
      await productionPrisma.product.create({
        data: product
      });
    }
    
    console.log('✅ Product sync completed!');
  } catch (error) {
    console.error('❌ Error syncing products:', error);
  }
}

async function syncServiceTypes() {
  try {
    console.log('🔄 Starting service types sync...');
    
    const localServiceTypes = await localPrisma.serviceType.findMany();
    console.log(`🏷️  Found ${localServiceTypes.length} service types in local database`);
    
    for (const serviceType of localServiceTypes) {
      console.log(`➕ Syncing service type: ${serviceType.name}`);
      await productionPrisma.serviceType.create({
        data: serviceType
      });
    }
    
    console.log('✅ Service types sync completed!');
  } catch (error) {
    console.error('❌ Error syncing service types:', error);
  }
}

async function syncSessionDurations() {
  try {
    console.log('🔄 Starting session durations sync...');
    
    const localDurations = await localPrisma.sessionDuration.findMany();
    console.log(`⏱️  Found ${localDurations.length} session durations in local database`);
    
    for (const duration of localDurations) {
      console.log(`➕ Syncing session duration: ${duration.name}`);
      await productionPrisma.sessionDuration.create({
        data: duration
      });
    }
    
    console.log('✅ Session durations sync completed!');
  } catch (error) {
    console.error('❌ Error syncing session durations:', error);
  }
}

async function syncVenues() {
  try {
    console.log('🔄 Starting venues sync...');
    
    const localVenues = await localPrisma.venue.findMany();
    console.log(`🏢 Found ${localVenues.length} venues in local database`);
    
    for (const venue of localVenues) {
      console.log(`➕ Syncing venue: ${venue.name}`);
      await productionPrisma.venue.create({
        data: venue
      });
    }
    
    console.log('✅ Venues sync completed!');
  } catch (error) {
    console.error('❌ Error syncing venues:', error);
  }
}

async function syncTeachers() {
  try {
    console.log('🔄 Starting teachers sync...');
    
    const localTeachers = await localPrisma.teacher.findMany();
    console.log(`👨‍🏫 Found ${localTeachers.length} teachers in local database`);
    
    for (const teacher of localTeachers) {
      console.log(`➕ Syncing teacher: ${teacher.name}`);
      await productionPrisma.teacher.create({
        data: teacher
      });
    }
    
    console.log('✅ Teachers sync completed!');
  } catch (error) {
    console.error('❌ Error syncing teachers:', error);
  }
}

async function syncPackageDefinitions() {
  try {
    console.log('🔄 Starting package definitions sync...');
    
    const localPackages = await localPrisma.packageDefinition.findMany();
    console.log(`📦 Found ${localPackages.length} package definitions in local database`);
    
    for (const pkg of localPackages) {
      console.log(`➕ Syncing package: ${pkg.name}`);
      await productionPrisma.packageDefinition.create({
        data: pkg
      });
    }
    
    console.log('✅ Package definitions sync completed!');
  } catch (error) {
    console.error('❌ Error syncing package definitions:', error);
  }
}

async function syncPackagePrices() {
  try {
    console.log('🔄 Starting package prices sync...');
    
    const localPrices = await localPrisma.packagePrice.findMany();
    console.log(`💰 Found ${localPrices.length} package prices in local database`);
    
    for (const price of localPrices) {
      console.log(`➕ Syncing package price: ${price.id}`);
      await productionPrisma.packagePrice.create({
        data: price
      });
    }
    
    console.log('✅ Package prices sync completed!');
  } catch (error) {
    console.error('❌ Error syncing package prices:', error);
  }
}

async function syncScheduleTemplates() {
  try {
    console.log('🔄 Starting schedule templates sync...');
    
    const localTemplates = await localPrisma.scheduleTemplate.findMany();
    console.log(`📅 Found ${localTemplates.length} schedule templates in local database`);
    
    for (const template of localTemplates) {
      console.log(`➕ Syncing schedule template: ${template.id}`);
      await productionPrisma.scheduleTemplate.create({
        data: template
      });
    }
    
    console.log('✅ Schedule templates sync completed!');
  } catch (error) {
    console.error('❌ Error syncing schedule templates:', error);
  }
}

async function syncScheduleSlots() {
  try {
    console.log('🔄 Starting schedule slots sync...');
    
    const localSlots = await localPrisma.scheduleSlot.findMany();
    console.log(`🕐 Found ${localSlots.length} schedule slots in local database`);
    
    for (const slot of localSlots) {
      console.log(`➕ Syncing schedule slot: ${slot.id}`);
      await productionPrisma.scheduleSlot.create({
        data: slot
      });
    }
    
    console.log('✅ Schedule slots sync completed!');
  } catch (error) {
    console.error('❌ Error syncing schedule slots:', error);
  }
}

async function main() {
  console.log('🚀 Starting complete database reset and sync...');
  
  // Step 1: Reset production database
  await resetProductionDatabase();
  
  // Step 2: Sync all data in dependency order
  await syncCurrencies();
  await syncProducts();
  await syncServiceTypes();
  await syncSessionDurations();
  await syncVenues();
  await syncTeachers();
  await syncPackageDefinitions();
  await syncPackagePrices();
  await syncScheduleTemplates();
  await syncScheduleSlots();
  
  console.log('🎉 Complete database reset and sync completed!');
  
  await localPrisma.$disconnect();
  await productionPrisma.$disconnect();
}

main().catch(console.error);
