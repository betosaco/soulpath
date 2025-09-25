import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createCorrectToteBags() {
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

    console.log('🛒 Creating tote bag products...');

    // Create the "Path to You" product with white variation
    const pathToYouWhite = await prisma.product.create({
      data: {
        name: 'Path to You',
        description: 'Premium cotton tote bag "Path to You" made in Peru. This beautiful tote bag is perfect for carrying your yoga essentials and daily items. Made from high-quality cotton material.',
        shortDescription: 'Premium cotton tote bag "Path to You" - made in Peru',
        sku: 'TOTEBAG-PATH-TO-YOU-WHITE',
        price: 129.00,
        currency: 'S/.',
        stock: 50,
        minStock: 10,
        maxStock: 100,
        weight: 0.3,
        dimensions: '40cm x 35cm x 10cm',
        category: 'Accessories',
        tags: ['tote', 'bag', 'cotton', 'yoga', 'wellness', 'accessories', 'peru', 'path-to-you', 'white'],
        images: [
          '/images/products/totebag-path-to-you-white.jpg'
        ],
        status: 'ACTIVE',
        isDigital: false,
        isFeatured: true,
        isPopular: true,
        seoTitle: 'Path to You - Premium Cotton Tote Bag Made in Peru | MatMax Wellness',
        seoDescription: 'Shop the "Path to You" premium cotton tote bag made in Peru. Available in white and black. Perfect for yoga essentials and daily use.',
        slug: 'path-to-you-white-cotton-totebag-peru'
      }
    });

    // Create the "Path to You" product with black variation
    const pathToYouBlack = await prisma.product.create({
      data: {
        name: 'Path to You',
        description: 'Premium cotton tote bag "Path to You" made in Peru. This beautiful tote bag is perfect for carrying your yoga essentials and daily items. Made from high-quality cotton material.',
        shortDescription: 'Premium cotton tote bag "Path to You" - made in Peru',
        sku: 'TOTEBAG-PATH-TO-YOU-BLACK',
        price: 129.00,
        currency: 'S/.',
        stock: 50,
        minStock: 10,
        maxStock: 100,
        weight: 0.3,
        dimensions: '40cm x 35cm x 10cm',
        category: 'Accessories',
        tags: ['tote', 'bag', 'cotton', 'yoga', 'wellness', 'accessories', 'peru', 'path-to-you', 'black'],
        images: [
          '/images/products/totebag-path-to-you-black.jpg'
        ],
        status: 'ACTIVE',
        isDigital: false,
        isFeatured: true,
        isPopular: true,
        seoTitle: 'Path to You - Premium Cotton Tote Bag Made in Peru | MatMax Wellness',
        seoDescription: 'Shop the "Path to You" premium cotton tote bag made in Peru. Available in white and black. Perfect for yoga essentials and daily use.',
        slug: 'path-to-you-black-cotton-totebag-peru'
      }
    });

    // Create the "Unknown Self" product (single product, no variations)
    const unknownSelf = await prisma.product.create({
      data: {
        name: 'Unknown Self',
        description: 'Premium cotton tote bag "Unknown Self" made in Peru. This beautiful tote bag is perfect for carrying your yoga essentials and daily items. Made from high-quality cotton material, it features a unique design that represents the journey of self-discovery.',
        shortDescription: 'Premium cotton tote bag "Unknown Self" - made in Peru',
        sku: 'TOTEBAG-UNKNOWN-SELF-001',
        price: 129.00,
        currency: 'S/.',
        stock: 50,
        minStock: 10,
        maxStock: 100,
        weight: 0.3,
        dimensions: '40cm x 35cm x 10cm',
        category: 'Accessories',
        tags: ['tote', 'bag', 'cotton', 'yoga', 'wellness', 'accessories', 'peru', 'unknown-self', 'self-discovery'],
        images: [
          '/images/products/totebag-unknown-self.jpg'
        ],
        status: 'ACTIVE',
        isDigital: false,
        isFeatured: true,
        isPopular: true,
        seoTitle: 'Unknown Self - Premium Cotton Tote Bag Made in Peru | MatMax Wellness',
        seoDescription: 'Shop the "Unknown Self" premium cotton tote bag made in Peru. Perfect for yoga essentials and daily use. High-quality cotton material.',
        slug: 'unknown-self-cotton-totebag-peru'
      }
    });

    console.log('✅ Tote bag products created successfully!');
    console.log(`\n📋 Created Products:`);
    console.log(`\n1. Path to You (with 2 color variations):`);
    console.log(`   - White: S/. ${pathToYouWhite.price} (SKU: ${pathToYouWhite.sku})`);
    console.log(`   - Black: S/. ${pathToYouBlack.price} (SKU: ${pathToYouBlack.sku})`);
    console.log(`\n2. Unknown Self (single product):`);
    console.log(`   - S/. ${unknownSelf.price} (SKU: ${unknownSelf.sku})`);

    console.log('\n🎉 Product creation completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Removed all existing products');
    console.log('- Created 2 products:');
    console.log('  • Path to You: 2 color variations (White & Black)');
    console.log('  • Unknown Self: 1 product');
    console.log('- All made in Peru');
    console.log('- Premium cotton material');
    console.log('- 50 units stock each');
    console.log('- Total: 3 product entries in database');

  } catch (error) {
    console.error('❌ Error creating products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createCorrectToteBags()
  .catch((error) => {
    console.error('❌ Product creation failed:', error);
    process.exit(1);
  });
