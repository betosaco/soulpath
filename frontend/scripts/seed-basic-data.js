import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedBasicData() {
  try {
    console.log('🌱 Starting basic data seeding...');

    // 1. Create PEN currency
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
    console.log('✅ Currency created:', currency.code);

    // 2. Create session duration
    const sessionDuration = await prisma.sessionDuration.create({
      data: {
        name: '1 Hour Session',
        duration_minutes: 60,
        description: 'Standard 1-hour wellness class',
        isActive: true
      }
    });
    console.log('✅ Session duration created:', sessionDuration.name);

    // 3. Create packages
    const packages = [
      {
        name: '01 MATPASS',
        description: '1 session of 1 hour',
        sessionsCount: 1,
        packageType: 'individual',
        maxGroupSize: 1,
        isActive: true,
        isPopular: false,
        featured: false,
        displayOrder: 1,
        price: 60.00
      },
      {
        name: '04 MATPASS',
        description: '4 sessions of 1 hour each',
        sessionsCount: 4,
        packageType: 'individual',
        maxGroupSize: 1,
        isActive: true,
        isPopular: false,
        featured: false,
        displayOrder: 2,
        price: 190.00
      },
      {
        name: '08 MATPASS',
        description: '8 sessions of 1 hour each',
        sessionsCount: 8,
        packageType: 'individual',
        maxGroupSize: 1,
        isActive: true,
        isPopular: true,
        featured: true,
        displayOrder: 3,
        price: 350.00
      },
      {
        name: '12 MATPASS',
        description: '12 sessions of 1 hour each',
        sessionsCount: 12,
        packageType: 'individual',
        maxGroupSize: 1,
        isActive: true,
        isPopular: false,
        featured: false,
        displayOrder: 4,
        price: 420.00
      },
      {
        name: '24 MATPASS',
        description: '24 sessions of 1 hour each',
        sessionsCount: 24,
        packageType: 'individual',
        maxGroupSize: 1,
        isActive: true,
        isPopular: false,
        featured: false,
        displayOrder: 5,
        price: 550.00
      }
    ];

    for (const packageData of packages) {
      // Create package definition
      const pkg = await prisma.packageDefinition.create({
        data: {
          name: packageData.name,
          description: packageData.description,
          sessionsCount: packageData.sessionsCount,
          packageType: packageData.packageType,
          maxGroupSize: packageData.maxGroupSize,
          isActive: packageData.isActive,
          isPopular: packageData.isPopular,
          featured: packageData.featured,
          displayOrder: packageData.displayOrder,
          sessionDurationId: sessionDuration.id
        }
      });

      // Create package price
      await prisma.packagePrice.create({
        data: {
          packageDefinitionId: pkg.id,
          currencyId: currency.id,
          price: packageData.price,
          pricingMode: 'custom',
          isActive: true
        }
      });

      console.log(`✅ Package created: ${pkg.name} - ${currency.symbol} ${packageData.price}`);
    }

    // 4. Create some schedule templates
    const scheduleTemplates = [
      {
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        capacity: 10,
        isAvailable: true,
        autoAvailable: true
      },
      {
        dayOfWeek: 'Tuesday',
        startTime: '10:00',
        endTime: '11:00',
        capacity: 8,
        isAvailable: true,
        autoAvailable: true
      },
      {
        dayOfWeek: 'Wednesday',
        startTime: '18:00',
        endTime: '19:00',
        capacity: 12,
        isAvailable: true,
        autoAvailable: true
      },
      {
        dayOfWeek: 'Thursday',
        startTime: '19:00',
        endTime: '20:00',
        capacity: 10,
        isAvailable: true,
        autoAvailable: true
      },
      {
        dayOfWeek: 'Friday',
        startTime: '17:00',
        endTime: '18:00',
        capacity: 8,
        isAvailable: true,
        autoAvailable: true
      }
    ];

    for (const scheduleData of scheduleTemplates) {
      const schedule = await prisma.scheduleTemplate.create({
        data: {
          ...scheduleData,
          sessionDurationId: sessionDuration.id
        }
      });
      console.log(`✅ Schedule created: ${schedule.dayOfWeek} ${schedule.startTime}-${schedule.endTime}`);
    }

    console.log('\n🎉 Basic data seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding basic data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedBasicData()
  .then(() => {
    console.log('✅ Basic data seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Basic data seeding failed:', error);
    process.exit(1);
  });

export { seedBasicData };
