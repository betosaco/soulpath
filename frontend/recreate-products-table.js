import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function recreateProductsTable() {
  try {
    console.log('🔄 Recreating products table with correct schema...');

    // Drop the existing products table
    await prisma.$executeRaw`DROP TABLE IF EXISTS "public"."products" CASCADE;`;
    console.log('✅ Dropped existing products table');

    // Create the products table with the correct schema
    await prisma.$executeRaw`
      CREATE TABLE "public"."products" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "short_description" VARCHAR(500),
        "sku" VARCHAR(100) UNIQUE,
        "price" DECIMAL(10,2) NOT NULL,
        "compare_price" DECIMAL(10,2),
        "cost_price" DECIMAL(10,2),
        "currency" VARCHAR(3) NOT NULL DEFAULT 'PEN',
        "stock" INTEGER NOT NULL DEFAULT 0,
        "min_stock" INTEGER DEFAULT 10,
        "max_stock" INTEGER,
        "weight" DECIMAL(8,2),
        "dimensions" VARCHAR(100),
        "category" VARCHAR(100),
        "tags" TEXT[] DEFAULT '{}',
        "images" TEXT[] DEFAULT '{}',
        "status" "public"."ProductStatus" NOT NULL DEFAULT 'ACTIVE',
        "is_digital" BOOLEAN DEFAULT false,
        "is_featured" BOOLEAN DEFAULT false,
        "is_popular" BOOLEAN DEFAULT false,
        "seo_title" VARCHAR(255),
        "seo_description" VARCHAR(500),
        "slug" VARCHAR(255) UNIQUE,
        "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now()
      );
    `;

    console.log('✅ Created products table with correct schema');

    // Create index
    await prisma.$executeRaw`
      CREATE INDEX "idx_products_status" ON "public"."products"("status");
    `;

    console.log('✅ Created index on status column');

    // Now create some test products
    const products = [
      {
        id: 'prod_1',
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
        seoTitle: 'Premium Yoga Mat - Non-Slip Eco-Friendly',
        seoDescription: 'High-quality yoga mat perfect for all practice levels',
        slug: 'premium-yoga-mat'
      },
      {
        id: 'prod_2',
        name: 'Yoga Blocks Set',
        description: 'Set of 2 high-density foam yoga blocks for support and alignment in various poses.',
        shortDescription: 'Set of 2 yoga blocks',
        sku: 'YOG-002',
        price: 45.00,
        comparePrice: 60.00,
        currency: 'PEN',
        stock: 30,
        weight: 0.8,
        dimensions: '23cm x 15cm x 7.5cm each',
        category: 'Yoga Equipment',
        tags: ['yoga', 'blocks', 'support', 'alignment'],
        images: ['/images/products/yoga-blocks-1.jpg'],
        status: 'ACTIVE',
        isFeatured: false,
        isPopular: true,
        seoTitle: 'Yoga Blocks Set - High Density Foam',
        seoDescription: 'Support and alignment blocks for yoga practice',
        slug: 'yoga-blocks-set'
      },
      {
        id: 'prod_3',
        name: 'Meditation Cushion',
        description: 'Comfortable meditation cushion filled with buckwheat hulls for optimal support during meditation.',
        shortDescription: 'Comfortable meditation cushion',
        sku: 'MED-001',
        price: 65.00,
        comparePrice: 85.00,
        currency: 'PEN',
        stock: 25,
        weight: 1.5,
        dimensions: '35cm diameter x 15cm height',
        category: 'Meditation',
        tags: ['meditation', 'cushion', 'buckwheat', 'comfort'],
        images: ['/images/products/meditation-cushion-1.jpg'],
        status: 'ACTIVE',
        isFeatured: true,
        isPopular: false,
        seoTitle: 'Meditation Cushion - Buckwheat Filled',
        seoDescription: 'Comfortable cushion for meditation practice',
        slug: 'meditation-cushion'
      }
    ];

    for (const productData of products) {
      try {
        const product = await prisma.product.create({
          data: productData
        });
        console.log(`✅ Created product: ${product.name} (ID: ${product.id})`);
      } catch (error) {
        console.error(`❌ Error creating product ${productData.name}:`, error.message);
      }
    }

    console.log('🎉 Products table recreation completed!');

  } catch (error) {
    console.error('❌ Error in recreateProductsTable:', error);
  } finally {
    await prisma.$disconnect();
  }
}

recreateProductsTable();
