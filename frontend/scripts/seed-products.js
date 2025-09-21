import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProducts() {
  console.log('🛒 Starting product seeding...');

  try {
    // Create sample products
    const products = await Promise.all([
      prisma.product.upsert({
        where: { id: 'prod-yoga-mat-1' },
        update: {},
        create: {
          id: 'prod-yoga-mat-1',
          name: 'Premium Yoga Mat',
          description: 'High-quality, non-slip yoga mat perfect for all types of yoga practice. Made from eco-friendly materials with excellent grip and cushioning.',
          shortDescription: 'High-quality, non-slip yoga mat perfect for all practice levels.',
          sku: 'YM-001',
          price: 89.99,
          comparePrice: 119.99,
          currency: 'PEN',
          stock: 25,
          weight: 1.2,
          dimensions: '183x61x0.6cm',
          category: 'Yoga Equipment',
          tags: ['yoga', 'mat', 'eco-friendly', 'non-slip'],
          images: [
            '/images/products/yoga-mat-1.jpg',
            '/images/products/yoga-mat-2.jpg',
            '/images/products/yoga-mat-3.jpg'
          ],
          status: 'ACTIVE',
          isFeatured: true,
          isPopular: true,
          seoTitle: 'Premium Yoga Mat - High Quality Non-Slip',
          seoDescription: 'Buy our premium yoga mat with excellent grip and cushioning. Perfect for all yoga practice levels.',
          slug: 'premium-yoga-mat'
        }
      }),
      prisma.product.upsert({
        where: { id: 'prod-meditation-cushion-1' },
        update: {},
        create: {
          id: 'prod-meditation-cushion-1',
          name: 'Meditation Cushion Set',
          description: 'Comfortable meditation cushion set including a zafu and zabuton. Perfect for extended meditation sessions and comfortable seating.',
          shortDescription: 'Comfortable meditation cushion set for extended sessions.',
          sku: 'MC-001',
          price: 65.00,
          comparePrice: 85.00,
          currency: 'PEN',
          stock: 15,
          weight: 2.1,
          dimensions: '40x40x15cm',
          category: 'Meditation Equipment',
          tags: ['meditation', 'cushion', 'zen', 'comfortable'],
          images: [
            '/images/products/meditation-cushion-1.jpg',
            '/images/products/meditation-cushion-2.jpg'
          ],
          status: 'ACTIVE',
          isFeatured: false,
          isPopular: true,
          seoTitle: 'Meditation Cushion Set - Comfortable Seating',
          seoDescription: 'Premium meditation cushion set for comfortable extended meditation practice.',
          slug: 'meditation-cushion-set'
        }
      }),
      prisma.product.upsert({
        where: { id: 'prod-yoga-blocks-1' },
        update: {},
        create: {
          id: 'prod-yoga-blocks-1',
          name: 'Yoga Blocks (Set of 2)',
          description: 'High-density foam yoga blocks perfect for alignment, support, and deepening your yoga practice. Lightweight yet sturdy.',
          shortDescription: 'High-density foam yoga blocks for alignment and support.',
          sku: 'YB-001',
          price: 35.00,
          currency: 'PEN',
          stock: 30,
          weight: 0.8,
          dimensions: '23x15x9cm each',
          category: 'Yoga Equipment',
          tags: ['yoga', 'blocks', 'alignment', 'support'],
          images: [
            '/images/products/yoga-blocks-1.jpg',
            '/images/products/yoga-blocks-2.jpg'
          ],
          status: 'ACTIVE',
          isFeatured: false,
          isPopular: false,
          seoTitle: 'Yoga Blocks Set - High Density Foam',
          seoDescription: 'Professional yoga blocks for alignment and support in your practice.',
          slug: 'yoga-blocks-set'
        }
      }),
      prisma.product.upsert({
        where: { id: 'prod-strap-1' },
        update: {},
        create: {
          id: 'prod-strap-1',
          name: 'Yoga Strap',
          description: 'Durable cotton yoga strap with metal D-ring buckle. Perfect for stretching, alignment, and deepening poses safely.',
          shortDescription: 'Durable cotton yoga strap for stretching and alignment.',
          sku: 'YS-001',
          price: 18.00,
          currency: 'PEN',
          stock: 40,
          weight: 0.2,
          dimensions: '180cm length',
          category: 'Yoga Equipment',
          tags: ['yoga', 'strap', 'stretching', 'alignment'],
          images: [
            '/images/products/yoga-strap-1.jpg'
          ],
          status: 'ACTIVE',
          isFeatured: false,
          isPopular: false,
          seoTitle: 'Yoga Strap - Durable Cotton with Metal Buckle',
          seoDescription: 'Professional yoga strap for safe stretching and pose alignment.',
          slug: 'yoga-strap'
        }
      }),
      prisma.product.upsert({
        where: { id: 'prod-incense-1' },
        update: {},
        create: {
          id: 'prod-incense-1',
          name: 'Sandalwood Incense Sticks (Pack of 20)',
          description: 'Premium sandalwood incense sticks to create a peaceful and calming atmosphere for your yoga and meditation practice.',
          shortDescription: 'Premium sandalwood incense for peaceful atmosphere.',
          sku: 'IS-001',
          price: 12.00,
          currency: 'PEN',
          stock: 50,
          weight: 0.1,
          dimensions: '20cm length',
          category: 'Wellness Accessories',
          tags: ['incense', 'sandalwood', 'aromatherapy', 'meditation'],
          images: [
            '/images/products/incense-1.jpg'
          ],
          status: 'ACTIVE',
          isFeatured: false,
          isPopular: true,
          seoTitle: 'Sandalwood Incense Sticks - Premium Quality',
          seoDescription: 'High-quality sandalwood incense for meditation and relaxation.',
          slug: 'sandalwood-incense-sticks'
        }
      }),
      prisma.product.upsert({
        where: { id: 'prod-water-bottle-1' },
        update: {},
        create: {
          id: 'prod-water-bottle-1',
          name: 'Stainless Steel Water Bottle',
          description: 'Insulated stainless steel water bottle to keep your water cold during practice. BPA-free and eco-friendly.',
          shortDescription: 'Insulated stainless steel water bottle for practice.',
          sku: 'WB-001',
          price: 45.00,
          comparePrice: 60.00,
          currency: 'PEN',
          stock: 20,
          weight: 0.5,
          dimensions: '25x7cm',
          category: 'Wellness Accessories',
          tags: ['water', 'bottle', 'stainless', 'eco-friendly'],
          images: [
            '/images/products/water-bottle-1.jpg',
            '/images/products/water-bottle-2.jpg'
          ],
          status: 'ACTIVE',
          isFeatured: true,
          isPopular: false,
          seoTitle: 'Stainless Steel Water Bottle - Insulated',
          seoDescription: 'Eco-friendly insulated water bottle for your yoga practice.',
          slug: 'stainless-steel-water-bottle'
        }
      })
    ]);

    console.log('✅ Products created successfully:', products.length);
    
    // Display created products
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - S/. ${product.price} (Stock: ${product.stock})`);
    });

  } catch (error) {
    console.error('❌ Error creating products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts()
  .then(() => {
    console.log('🎉 Product seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Product seeding failed:', error);
    process.exit(1);
  });