import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProducts() {
  try {
    console.log('🌱 Seeding products...');
    
    // Clear existing products first
    await prisma.product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    const products = [
      {
        name: 'Premium Yoga Mat',
        description: 'High-quality, non-slip yoga mat perfect for all types of yoga practice. Made from eco-friendly materials with excellent grip and cushioning.',
        shortDescription: 'Non-slip yoga mat with excellent grip and cushioning',
        sku: 'YM-001',
        price: 89.99,
        comparePrice: 119.99,
        costPrice: 45.00,
        currency: 'PEN',
        stock: 50,
        minStock: 10,
        maxStock: 100,
        weight: 1.2,
        dimensions: '72x24x0.6cm',
        category: 'Equipment',
        tags: ['yoga', 'mat', 'premium', 'non-slip'],
        images: [
          '/images/products/yoga-mat-1.jpg',
          '/images/products/yoga-mat-2.jpg',
          '/images/products/yoga-mat-3.jpg'
        ],
        status: 'ACTIVE',
        isDigital: false,
        isFeatured: true,
        isPopular: true,
        seoTitle: 'Premium Yoga Mat - Non-Slip & Eco-Friendly',
        seoDescription: 'High-quality yoga mat with excellent grip and cushioning. Perfect for all yoga practices.',
        slug: 'premium-yoga-mat'
      },
      {
        name: 'Meditation Cushion Set',
        description: 'Comfortable meditation cushion set including a zafu and zabuton. Made from organic cotton with buckwheat hull filling for optimal comfort during long meditation sessions.',
        shortDescription: 'Comfortable meditation cushion set for long sessions',
        sku: 'MC-002',
        price: 65.00,
        comparePrice: 85.00,
        costPrice: 32.50,
        currency: 'PEN',
        stock: 25,
        minStock: 5,
        maxStock: 50,
        weight: 2.5,
        dimensions: '40x40x15cm',
        category: 'Equipment',
        tags: ['meditation', 'cushion', 'zen', 'comfort'],
        images: [
          '/images/products/meditation-cushion-1.jpg',
          '/images/products/meditation-cushion-2.jpg'
        ],
        status: 'ACTIVE',
        isDigital: false,
        isFeatured: false,
        isPopular: true,
        seoTitle: 'Meditation Cushion Set - Organic Cotton',
        seoDescription: 'Comfortable meditation cushion set with organic cotton and buckwheat filling.',
        slug: 'meditation-cushion-set'
      },
      {
        name: 'Yoga Block Set (2 pieces)',
        description: 'High-density foam yoga blocks perfect for alignment, support, and deepening poses. Lightweight yet sturdy, these blocks are essential for beginners and advanced practitioners.',
        shortDescription: 'High-density foam yoga blocks for alignment and support',
        sku: 'YB-003',
        price: 35.00,
        comparePrice: 45.00,
        costPrice: 18.00,
        currency: 'PEN',
        stock: 75,
        minStock: 15,
        maxStock: 150,
        weight: 0.8,
        dimensions: '23x15x7.5cm each',
        category: 'Equipment',
        tags: ['yoga', 'blocks', 'alignment', 'support'],
        images: [
          '/images/products/yoga-blocks-1.jpg',
          '/images/products/yoga-blocks-2.jpg'
        ],
        status: 'ACTIVE',
        isDigital: false,
        isFeatured: false,
        isPopular: false,
        seoTitle: 'Yoga Block Set - High-Density Foam',
        seoDescription: 'Essential yoga blocks for alignment, support, and deepening poses.',
        slug: 'yoga-block-set'
      },
      {
        name: 'Yoga Strap (6 feet)',
        description: 'Durable cotton yoga strap with metal D-ring buckle. Perfect for stretching, alignment, and reaching poses that require assistance. Adjustable length for various body types.',
        shortDescription: 'Durable cotton yoga strap with metal buckle',
        sku: 'YS-004',
        price: 18.50,
        comparePrice: 25.00,
        costPrice: 9.25,
        currency: 'PEN',
        stock: 100,
        minStock: 20,
        maxStock: 200,
        weight: 0.2,
        dimensions: '183cm length',
        category: 'Equipment',
        tags: ['yoga', 'strap', 'stretching', 'alignment'],
        images: [
          '/images/products/yoga-strap-1.jpg'
        ],
        status: 'ACTIVE',
        isDigital: false,
        isFeatured: false,
        isPopular: false,
        seoTitle: 'Yoga Strap - 6 Feet Cotton with Metal Buckle',
        seoDescription: 'Durable yoga strap perfect for stretching and alignment assistance.',
        slug: 'yoga-strap-6-feet'
      },
      {
        name: 'Essential Oils Kit',
        description: 'Premium essential oils kit with 6 therapeutic-grade oils: lavender, eucalyptus, peppermint, tea tree, lemon, and frankincense. Perfect for aromatherapy and relaxation.',
        shortDescription: 'Therapeutic-grade essential oils kit for aromatherapy',
        sku: 'EO-005',
        price: 95.00,
        comparePrice: 125.00,
        costPrice: 47.50,
        currency: 'PEN',
        stock: 30,
        minStock: 8,
        maxStock: 60,
        weight: 0.5,
        dimensions: '15x10x8cm',
        category: 'Wellness',
        tags: ['essential oils', 'aromatherapy', 'relaxation', 'therapeutic'],
        images: [
          '/images/products/essential-oils-1.jpg',
          '/images/products/essential-oils-2.jpg'
        ],
        status: 'ACTIVE',
        isDigital: false,
        isFeatured: true,
        isPopular: true,
        seoTitle: 'Essential Oils Kit - 6 Therapeutic Grade Oils',
        seoDescription: 'Premium essential oils kit for aromatherapy and relaxation.',
        slug: 'essential-oils-kit'
      },
      {
        name: 'Yoga Towel (Large)',
        description: 'Microfiber yoga towel with excellent absorbency and non-slip backing. Perfect for hot yoga, pilates, or any workout. Machine washable and quick-drying.',
        shortDescription: 'Microfiber yoga towel with non-slip backing',
        sku: 'YT-006',
        price: 42.00,
        comparePrice: 55.00,
        costPrice: 21.00,
        currency: 'PEN',
        stock: 40,
        minStock: 10,
        maxStock: 80,
        weight: 0.3,
        dimensions: '180x60cm',
        category: 'Equipment',
        tags: ['yoga', 'towel', 'microfiber', 'non-slip'],
        images: [
          '/images/products/yoga-towel-1.jpg'
        ],
        status: 'ACTIVE',
        isDigital: false,
        isFeatured: false,
        isPopular: false,
        seoTitle: 'Yoga Towel - Large Microfiber with Non-Slip Backing',
        seoDescription: 'High-quality yoga towel with excellent absorbency and grip.',
        slug: 'yoga-towel-large'
      },
      {
        name: 'Crystal Healing Set',
        description: 'Beautiful crystal healing set with 7 chakra stones: amethyst, clear quartz, rose quartz, citrine, green aventurine, sodalite, and hematite. Includes cleansing cloth and guidebook.',
        shortDescription: '7 chakra crystal healing set with guidebook',
        sku: 'CH-007',
        price: 78.00,
        comparePrice: 98.00,
        costPrice: 39.00,
        currency: 'PEN',
        stock: 20,
        minStock: 5,
        maxStock: 40,
        weight: 1.0,
        dimensions: '20x15x5cm',
        category: 'Wellness',
        tags: ['crystals', 'healing', 'chakra', 'spiritual'],
        images: [
          '/images/products/crystal-set-1.jpg',
          '/images/products/crystal-set-2.jpg',
          '/images/products/crystal-set-3.jpg'
        ],
        status: 'ACTIVE',
        isDigital: false,
        isFeatured: true,
        isPopular: false,
        seoTitle: 'Crystal Healing Set - 7 Chakra Stones',
        seoDescription: 'Complete crystal healing set with chakra stones and guidebook.',
        slug: 'crystal-healing-set'
      },
      {
        name: 'Yoga Bolster (Round)',
        description: 'Firm yet comfortable round yoga bolster filled with organic cotton. Perfect for restorative yoga, meditation, and relaxation poses. Removable cover for easy cleaning.',
        shortDescription: 'Round yoga bolster for restorative poses',
        sku: 'YB-008',
        price: 55.00,
        comparePrice: 70.00,
        costPrice: 27.50,
        currency: 'PEN',
        stock: 15,
        minStock: 3,
        maxStock: 30,
        weight: 1.5,
        dimensions: '30x15cm diameter',
        category: 'Equipment',
        tags: ['yoga', 'bolster', 'restorative', 'meditation'],
        images: [
          '/images/products/yoga-bolster-1.jpg',
          '/images/products/yoga-bolster-2.jpg'
        ],
        status: 'ACTIVE',
        isDigital: false,
        isFeatured: false,
        isPopular: false,
        seoTitle: 'Yoga Bolster - Round Organic Cotton',
        seoDescription: 'Comfortable round bolster perfect for restorative yoga and meditation.',
        slug: 'yoga-bolster-round'
      },
      {
        name: 'Incense Sticks Pack (50 pieces)',
        description: 'Premium sandalwood incense sticks with natural ingredients. Long-lasting fragrance perfect for meditation, yoga, and creating a peaceful atmosphere.',
        shortDescription: 'Premium sandalwood incense sticks for meditation',
        sku: 'IS-009',
        price: 12.00,
        comparePrice: 16.00,
        costPrice: 6.00,
        currency: 'PEN',
        stock: 200,
        minStock: 50,
        maxStock: 400,
        weight: 0.1,
        dimensions: '20cm length',
        category: 'Wellness',
        tags: ['incense', 'sandalwood', 'meditation', 'aroma'],
        images: [
          '/images/products/incense-1.jpg'
        ],
        status: 'ACTIVE',
        isDigital: false,
        isFeatured: false,
        isPopular: true,
        seoTitle: 'Sandalwood Incense Sticks - 50 Pieces',
        seoDescription: 'Premium incense sticks for meditation and peaceful atmosphere.',
        slug: 'sandalwood-incense-sticks'
      },
      {
        name: 'Yoga Journal & Pen Set',
        description: 'Beautiful yoga journal with guided prompts for reflection, gratitude, and practice notes. Includes a premium pen and inspirational quotes throughout.',
        shortDescription: 'Yoga journal with guided prompts and premium pen',
        sku: 'YJ-010',
        price: 28.00,
        comparePrice: 35.00,
        costPrice: 14.00,
        currency: 'PEN',
        stock: 60,
        minStock: 15,
        maxStock: 120,
        weight: 0.4,
        dimensions: '21x15x2cm',
        category: 'Accessories',
        tags: ['journal', 'yoga', 'reflection', 'gratitude'],
        images: [
          '/images/products/yoga-journal-1.jpg',
          '/images/products/yoga-journal-2.jpg'
        ],
        status: 'ACTIVE',
        isDigital: false,
        isFeatured: false,
        isPopular: false,
        seoTitle: 'Yoga Journal & Pen Set - Guided Reflection',
        seoDescription: 'Beautiful journal with guided prompts for yoga practice reflection.',
        slug: 'yoga-journal-pen-set'
      }
    ];

    // Create products
    for (const productData of products) {
      const product = await prisma.product.create({
        data: productData
      });
      console.log(`✅ Created product: ${product.name}`);
    }

    console.log(`🎉 Successfully seeded ${products.length} products!`);

  } catch (error) {
    console.error('❌ Error seeding products:', error);
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
    console.error('💥 Product seeding failed:', error);
    process.exit(1);
  });
