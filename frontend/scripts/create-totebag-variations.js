import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createToteBagVariations() {
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

    console.log('🛒 Creating tote bag products with color variations...');

    // Create the "Path to You" product with white and black variations
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
        slug: 'path-to-you-cotton-totebag-peru',
        // Add color variation metadata
        metadata: {
          color: 'White',
          baseProduct: 'Path to You',
          variations: ['White', 'Black']
        }
      }
    });

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
        slug: 'path-to-you-cotton-totebag-peru',
        // Add color variation metadata
        metadata: {
          color: 'Black',
          baseProduct: 'Path to You',
          variations: ['White', 'Black']
        }
      }
    });

    // Create the "Unknown Self" product with variations
    const unknownSelfWhite = await prisma.product.create({
      data: {
        name: 'Unknown Self',
        description: 'Premium cotton tote bag "Unknown Self" made in Peru. This beautiful tote bag is perfect for carrying your yoga essentials and daily items. Made from high-quality cotton material, it features a unique design that represents the journey of self-discovery.',
        shortDescription: 'Premium cotton tote bag "Unknown Self" - made in Peru',
        sku: 'TOTEBAG-UNKNOWN-SELF-WHITE',
        price: 129.00,
        currency: 'S/.',
        stock: 50,
        minStock: 10,
        maxStock: 100,
        weight: 0.3,
        dimensions: '40cm x 35cm x 10cm',
        category: 'Accessories',
        tags: ['tote', 'bag', 'cotton', 'yoga', 'wellness', 'accessories', 'peru', 'unknown-self', 'self-discovery', 'white'],
        images: [
          '/images/products/totebag-unknown-self-white.jpg'
        ],
        status: 'ACTIVE',
        isDigital: false,
        isFeatured: true,
        isPopular: true,
        seoTitle: 'Unknown Self - Premium Cotton Tote Bag Made in Peru | MatMax Wellness',
        seoDescription: 'Shop the "Unknown Self" premium cotton tote bag made in Peru. Available in white and black. Perfect for yoga essentials and daily use.',
        slug: 'unknown-self-cotton-totebag-peru',
        // Add color variation metadata
        metadata: {
          color: 'White',
          baseProduct: 'Unknown Self',
          variations: ['White', 'Black']
        }
      }
    });

    const unknownSelfBlack = await prisma.product.create({
      data: {
        name: 'Unknown Self',
        description: 'Premium cotton tote bag "Unknown Self" made in Peru. This beautiful tote bag is perfect for carrying your yoga essentials and daily items. Made from high-quality cotton material, it features a unique design that represents the journey of self-discovery.',
        shortDescription: 'Premium cotton tote bag "Unknown Self" - made in Peru',
        sku: 'TOTEBAG-UNKNOWN-SELF-BLACK',
        price: 129.00,
        currency: 'S/.',
        stock: 50,
        minStock: 10,
        maxStock: 100,
        weight: 0.3,
        dimensions: '40cm x 35cm x 10cm',
        category: 'Accessories',
        tags: ['tote', 'bag', 'cotton', 'yoga', 'wellness', 'accessories', 'peru', 'unknown-self', 'self-discovery', 'black'],
        images: [
          '/images/products/totebag-unknown-self-black.jpg'
        ],
        status: 'ACTIVE',
        isDigital: false,
        isFeatured: true,
        isPopular: true,
        seoTitle: 'Unknown Self - Premium Cotton Tote Bag Made in Peru | MatMax Wellness',
        seoDescription: 'Shop the "Unknown Self" premium cotton tote bag made in Peru. Available in white and black. Perfect for yoga essentials and daily use.',
        slug: 'unknown-self-cotton-totebag-peru',
        // Add color variation metadata
        metadata: {
          color: 'Black',
          baseProduct: 'Unknown Self',
          variations: ['White', 'Black']
        }
      }
    });

    console.log('✅ Tote bag products with variations created successfully!');
    console.log(`\n📋 Created Products:`);
    console.log(`\n1. Path to You (Base Product):`);
    console.log(`   - White variation: S/. ${pathToYouWhite.price} (SKU: ${pathToYouWhite.sku})`);
    console.log(`   - Black variation: S/. ${pathToYouBlack.price} (SKU: ${pathToYouBlack.sku})`);
    console.log(`\n2. Unknown Self (Base Product):`);
    console.log(`   - White variation: S/. ${unknownSelfWhite.price} (SKU: ${unknownSelfWhite.sku})`);
    console.log(`   - Black variation: S/. ${unknownSelfBlack.price} (SKU: ${unknownSelfBlack.sku})`);

    console.log('\n🎉 Product creation completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Removed all existing products');
    console.log('- Created 2 base products with 2 color variations each:');
    console.log('  • Path to You: White & Black variations');
    console.log('  • Unknown Self: White & Black variations');
    console.log('- All made in Peru');
    console.log('- Premium cotton material');
    console.log('- 50 units stock each variation');
    console.log('- Each variation has unique SKU and image');

  } catch (error) {
    console.error('❌ Error creating products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createToteBagVariations()
  .catch((error) => {
    console.error('❌ Product creation failed:', error);
    process.exit(1);
  });
