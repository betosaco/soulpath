import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateToteBagPrices() {
  try {
    console.log('💰 Updating tote bag prices to S/. 129...');

    // Update "Path to You" tote bag price
    const pathToYouTote = await prisma.product.update({
      where: { id: 'prod-tote-path-to-you' },
      data: {
        price: 129.00,
        comparePrice: 149.00
      }
    });
    console.log('✅ Updated "Path to You" tote bag price to S/. 129');

    // Update "Unknown Self" tote bag price
    const unknownSelfTote = await prisma.product.update({
      where: { id: 'prod-tote-unknown-self' },
      data: {
        price: 129.00,
        comparePrice: 149.00
      }
    });
    console.log('✅ Updated "Unknown Self" tote bag price to S/. 129');

    // Verify the updated prices
    const updatedProducts = await prisma.product.findMany({
      where: {
        id: {
          in: ['prod-tote-path-to-you', 'prod-tote-unknown-self']
        }
      }
    });

    console.log('\n📦 Updated Tote Bag Prices:');
    for (const product of updatedProducts) {
      console.log(`\n🛍️ ${product.name}`);
      console.log(`   SKU: ${product.sku}`);
      console.log(`   Price: ${product.currency}${product.price}`);
      console.log(`   Compare Price: ${product.currency}${product.comparePrice}`);
    }

    console.log('\n✅ Tote bag prices updated successfully!');

  } catch (error) {
    console.error('❌ Error updating tote bag prices:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateToteBagPrices();
