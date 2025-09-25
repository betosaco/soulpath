import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPackagesData() {
  try {
    console.log('📦 Starting package data seeding...');

    // 1. Create PEN currency if not exists
    const currency = await prisma.currency.upsert({
      where: { code: 'PEN' },
      update: {},
      create: {
        code: 'PEN',
        name: 'Peruvian Sol',
        symbol: 'S/.',
        is_default: true,
        exchange_rate: 1.000000
      }
    });
    console.log('✅ Currency created/updated:', currency.code);

    // 2. Create 1-hour session duration if not exists
    const sessionDuration = await prisma.sessionDuration.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: '1 Hour Session',
        duration_minutes: 60,
        description: 'Standard 1-hour wellness class',
        is_active: true
      }
    });
    console.log('✅ Session duration created/updated:', sessionDuration.name);

    // 3. Create MATPASS package definitions
    const packages = [
      {
        id: 1,
        name: '01 MATPASS',
        description: '1 session of 1 hour',
        sessionsCount: 1,
        packageType: 'individual',
        maxGroupSize: 1,
        isActive: true,
        isPopular: false,
        featured: false,
        displayOrder: 1
      },
      {
        id: 2,
        name: '04 MATPASS',
        description: '4 sessions of 1 hour each',
        sessionsCount: 4,
        packageType: 'individual',
        maxGroupSize: 1,
        isActive: true,
        isPopular: false,
        featured: false,
        displayOrder: 2
      },
      {
        id: 3,
        name: '08 MATPASS',
        description: '8 sessions of 1 hour each',
        sessionsCount: 8,
        packageType: 'individual',
        maxGroupSize: 1,
        isActive: true,
        isPopular: true,
        featured: true,
        displayOrder: 3
      },
      {
        id: 4,
        name: '12 MATPASS',
        description: '12 sessions of 1 hour each',
        sessionsCount: 12,
        packageType: 'individual',
        maxGroupSize: 1,
        isActive: true,
        isPopular: false,
        featured: false,
        displayOrder: 4
      },
      {
        id: 5,
        name: '24 MATPASS',
        description: '24 sessions of 1 hour each',
        sessionsCount: 24,
        packageType: 'individual',
        maxGroupSize: 1,
        isActive: true,
        isPopular: false,
        featured: false,
        displayOrder: 5
      }
    ];

    for (const packageData of packages) {
      const pkg = await prisma.packageDefinition.upsert({
        where: { id: packageData.id },
        update: {
          name: packageData.name,
          description: packageData.description,
          sessionsCount: packageData.sessionsCount,
          packageType: packageData.packageType,
          maxGroupSize: packageData.maxGroupSize,
          isActive: packageData.isActive,
          isPopular: packageData.isPopular,
          featured: packageData.featured,
          displayOrder: packageData.displayOrder,
          sessionDurationId: 1
        },
        create: {
          ...packageData,
          sessionDurationId: 1
        }
      });
      console.log(`✅ Package created/updated: ${pkg.name}`);
    }

    // 4. Create package prices
    const prices = [
      { packageId: 1, price: 60.00 },
      { packageId: 2, price: 190.00 },
      { packageId: 3, price: 350.00 },
      { packageId: 4, price: 420.00 },
      { packageId: 5, price: 550.00 }
    ];

    for (const priceData of prices) {
      const packagePrice = await prisma.packagePrice.upsert({
        where: {
          packageDefinitionId_currencyId: {
            packageDefinitionId: priceData.packageId,
            currencyId: currency.id
          }
        },
        update: {
          price: priceData.price,
          pricingMode: 'custom',
          isActive: true
        },
        create: {
          packageDefinitionId: priceData.packageId,
          currencyId: currency.id,
          price: priceData.price,
          pricingMode: 'custom',
          isActive: true
        }
      });
      console.log(`✅ Price created/updated: ${priceData.price} ${currency.symbol} for package ${priceData.packageId}`);
    }

    // 5. Verify the data
    const allPackages = await prisma.packageDefinition.findMany({
      where: { isActive: true },
      include: {
        packagePrices: {
          where: { isActive: true },
          include: { currency: true }
        },
        sessionDuration: true
      },
      orderBy: { displayOrder: 'asc' }
    });

    console.log('\n📦 Packages created successfully:');
    allPackages.forEach(pkg => {
      const price = pkg.packagePrices[0];
      console.log(`${pkg.id}. ${pkg.name} - ${price?.currency?.symbol} ${price?.price} (${pkg.sessionsCount} sessions)`);
    });

    console.log('\n🎉 Package data seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding package data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedPackagesData()
  .then(() => {
    console.log('✅ Package seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Package seeding failed:', error);
    process.exit(1);
  });

export { seedPackagesData };
