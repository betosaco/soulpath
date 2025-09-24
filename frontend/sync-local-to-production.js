#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import _fs from 'fs';

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

async function syncProducts() {
  try {
    console.log('🔄 Starting product sync from local to production...');
    
    // Get all products from local database
    const localProducts = await localPrisma.product.findMany();
    
    console.log(`📦 Found ${localProducts.length} products in local database`);
    
    // Clear existing products in production (optional - be careful!)
    console.log('🗑️  Clearing existing products in production...');
    await productionPrisma.product.deleteMany({});
    
    // Insert local products into production
    for (const product of localProducts) {
      console.log(`➕ Syncing product: ${product.name}`);
      
      await productionPrisma.product.create({
        data: {
          id: product.id,
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription,
          sku: product.sku,
          price: product.price,
          comparePrice: product.comparePrice,
          costPrice: product.costPrice,
          currency: product.currency || 'S/.',
          stock: product.stock,
          minStock: product.minStock,
          maxStock: product.maxStock,
          weight: product.weight,
          dimensions: product.dimensions,
          category: product.category || 'General',
          tags: product.tags || [],
          images: product.images || [],
          isDigital: product.isDigital,
          isFeatured: product.isFeatured,
          isPopular: product.isPopular,
          status: product.status,
          seoTitle: product.seoTitle,
          seoDescription: product.seoDescription,
          slug: product.slug,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }
      });
    }
    
    console.log('✅ Product sync completed successfully!');
    
  } catch (error) {
    console.error('❌ Error syncing products:', error);
  } finally {
    await localPrisma.$disconnect();
    await productionPrisma.$disconnect();
  }
}

async function syncCurrencies() {
  try {
    console.log('🔄 Starting currency sync from local to production...');
    
    const localCurrencies = await localPrisma.currency.findMany();
    console.log(`💰 Found ${localCurrencies.length} currencies in local database`);
    
    // Clear and sync currencies
    await productionPrisma.currency.deleteMany({});
    
    for (const currency of localCurrencies) {
      console.log(`➕ Syncing currency: ${currency.code}`);
      await productionPrisma.currency.create({
        data: currency
      });
    }
    
    console.log('✅ Currency sync completed successfully!');
    
  } catch (error) {
    console.error('❌ Error syncing currencies:', error);
  }
}

async function main() {
  console.log('🚀 Starting local to production database sync...');
  
  await syncCurrencies();
  await syncProducts();
  
  console.log('🎉 All sync operations completed!');
}

main().catch(console.error);
