import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestProducts() {
  try {
    console.log('🛒 Creating test products...');

    const products = [
      {
        name: 'Premium Yoga Mat',
        description: 'High-quality, non-slip yoga mat perfect for all types of yoga practice. Made from eco-friendly materials.',
        shortDescription: 'Premium non-slip yoga mat',
        sku: 'YOG-001',
        price: 89.99,
        comparePrice: 120.00,
        currency: 'PEN',
        stock: 50,
        weight: 1.2,
        dimensions: '180cm x 60cm x 4mm',
        category: 'Yoga Equipment',
        tags: ['yoga', 'mat', 'premium', 'eco-friendly'],
        images: ['/images/products/yoga-mat-1.jpg'],
        status: 'ACTIVE',
        isFeatured: true,
        isPopular: true,
        seoTitle: 'Premium Yoga Mat - Non-Slip & Eco-Friendly',
        seoDescription: 'High-quality yoga mat perfect for all yoga practices. Eco-friendly and non-slip.',
        slug: 'premium-yoga-mat'
      },
      {
        name: 'Yoga Blocks Set (2 Pack)',
        description: 'Essential yoga props for support and alignment. Made from high-density foam.',
        shortDescription: 'Set of 2 yoga blocks for support',
        sku: 'YOG-002',
        price: 45.99,
        currency: 'PEN',
        stock: 30,
        weight: 0.8,
        dimensions: '23cm x 15cm x 7.5cm each',
        category: 'Yoga Equipment',
        tags: ['yoga', 'blocks', 'props', 'support'],
        images: ['/images/products/yoga-blocks-1.jpg'],
        status: 'ACTIVE',
        isFeatured: false,
        isPopular: true,
        seoTitle: 'Yoga Blocks Set - 2 Pack',
        seoDescription: 'Essential yoga props for support and alignment during practice.',
        slug: 'yoga-blocks-set'
      },
      {
        name: 'Meditation Cushion',
        description: 'Comfortable meditation cushion filled with buckwheat hulls. Perfect for seated meditation.',
        shortDescription: 'Comfortable meditation cushion',
        sku: 'MED-001',
        price: 65.99,
        currency: 'PEN',
        stock: 25,
        weight: 1.5,
        dimensions: '35cm diameter x 15cm height',
        category: 'Meditation',
        tags: ['meditation', 'cushion', 'buckwheat', 'seated'],
        images: ['/images/products/meditation-cushion-1.jpg'],
        status: 'ACTIVE',
        isFeatured: true,
        isPopular: false,
        seoTitle: 'Meditation Cushion - Buckwheat Filled',
        seoDescription: 'Comfortable meditation cushion perfect for seated meditation practice.',
        slug: 'meditation-cushion'
      }
    ];

    for (const productData of products) {
      const product = await prisma.product.upsert({
        where: { sku: productData.sku },
        update: productData,
        create: productData
      });
      console.log(`✅ Created product: ${product.name} (${product.sku})`);
    }

    console.log('🎉 Test products created successfully!');

  } catch (error) {
    console.error('❌ Error creating test products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestProducts();
