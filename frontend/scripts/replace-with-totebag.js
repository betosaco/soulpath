import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function replaceWithToteBag() {
  try {
    console.log('🗑️  Removing all existing products and related records...');

    // Delete related records first to avoid foreign key constraints
    console.log('🗑️  Deleting inventory logs...');
    const inventoryLogsResult = await prisma.inventoryLog.deleteMany({});
    console.log(`✅ Deleted ${inventoryLogsResult.count} inventory logs`);

    console.log('🗑️  Deleting order items...');
    const orderItemsResult = await prisma.orderItem.deleteMany({});
    console.log(`✅ Deleted ${orderItemsResult.count} order items`);

    // Now delete all existing products
    console.log('🗑️  Deleting products...');
    const deleteResult = await prisma.product.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.count} existing products`);

    console.log('🛒 Creating new ToteBag "Path to You"...');

    // Create the new tote bag product
    const toteBag = await prisma.product.create({
      data: {
        name: 'Path to You',
        description: 'Premium cotton tote bag "Path to You" made in Peru. This beautiful tote bag is perfect for carrying your yoga essentials and daily items. Made from high-quality cotton material, it features a clean white design with black text.',
        shortDescription: 'Premium cotton tote bag "Path to You" made in Peru',
        sku: 'TOTEBAG-PATH-TO-YOU-001',
        price: 129.00,
        currency: 'PEN',
        stock: 50,
        minStock: 10,
        maxStock: 100,
        weight: 0.3,
        dimensions: '40cm x 35cm x 10cm',
        category: 'Accessories',
        tags: ['tote', 'bag', 'cotton', 'yoga', 'wellness', 'accessories', 'peru', 'path-to-you'],
        images: [
          '/images/products/totebag-path-to-you-white.jpg',
          '/images/products/totebag-path-to-you-black.jpg'
        ],
        status: 'ACTIVE',
        isDigital: false,
        isFeatured: true,
        isPopular: true,
        seoTitle: 'Path to You - Premium Cotton Tote Bag Made in Peru | MatMax Wellness',
        seoDescription: 'Shop the "Path to You" premium cotton tote bag made in Peru. Perfect for yoga essentials and daily use. High-quality cotton material.',
        slug: 'path-to-you-cotton-totebag-peru'
      }
    });

    console.log('✅ ToteBag "Path to You" created successfully!');
    console.log(`   ID: ${toteBag.id}`);
    console.log(`   Name: ${toteBag.name}`);
    console.log(`   Price: S/ ${toteBag.price}`);
    console.log(`   SKU: ${toteBag.sku}`);
    console.log(`   Stock: ${toteBag.stock} units`);
    console.log(`   Images: ${toteBag.images.length} images`);
    console.log(`   Tags: ${toteBag.tags.join(', ')}`);

    console.log('\n🎉 Product replacement completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Removed all existing products');
    console.log('- Created new "Path to You" tote bag');
    console.log('- Price: S/ 129.00');
    console.log('- Made in Peru');
    console.log('- Cotton material');
    console.log('- White and black design');

  } catch (error) {
    console.error('❌ Error replacing products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the replacement function
replaceWithToteBag()
  .catch((error) => {
    console.error('❌ Product replacement failed:', error);
    process.exit(1);
  });
