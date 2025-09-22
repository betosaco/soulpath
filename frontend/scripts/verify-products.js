import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyProducts() {
  try {
    console.log('🔍 Verifying seeded products...\n');

    const products = await prisma.product.findMany({
      orderBy: {
        price: 'asc'
      }
    });

    if (products.length === 0) {
      console.log('❌ No products found!');
      return;
    }

    console.log(`✅ Found ${products.length} products:\n`);

    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   SKU: ${product.sku}`);
      console.log(`   Price: S/ ${product.price}`);
      console.log(`   Stock: ${product.stock} units`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Status: ${product.status}`);
      console.log(`   Featured: ${product.isFeatured ? 'Yes' : 'No'}`);
      console.log(`   Popular: ${product.isPopular ? 'Yes' : 'No'}`);
      console.log(`   Images: ${product.images.length} images`);
      console.log(`   Tags: ${product.tags.join(', ')}`);
      console.log(`   Slug: ${product.slug}`);
      console.log('');
    });

    console.log('🎉 Product verification completed!');

  } catch (error) {
    console.error('❌ Error verifying products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyProducts();

