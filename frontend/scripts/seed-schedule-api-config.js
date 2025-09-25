import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedScheduleApiConfig() {
  try {
    console.log('🌱 Seeding schedule API configuration...');

    // Check if schedule API config already exists
    const existingConfig = await prisma.externalAPIConfig.findFirst({
      where: {
        name: 'Schedule API'
      }
    });

    if (existingConfig) {
      console.log('✅ Schedule API config already exists, updating...');
      
      // Update existing config
      const updatedConfig = await prisma.externalAPIConfig.update({
        where: { id: existingConfig.id },
        data: {
          connectionType: 'schedule',
          provider: 'internal',
          category: 'scheduling',
          apiUrl: process.env.SCHEDULE_API_URL || '/api/schedules',
          description: 'Internal schedule API for packages, products, and internal products',
          version: '1.0.0',
          isActive: true,
          testMode: process.env.NODE_ENV === 'development',
          rateLimit: 1000,
          timeout: 30000,
          healthStatus: 'healthy',
          config: {
            endpoints: {
              schedules: '/api/schedules',
              availableSlots: '/api/teacher-schedule-slots',
              scheduleTemplates: '/api/admin/schedule-templates'
            },
            features: [
              'schedule_management',
              'availability_checking',
              'time_slot_booking',
              'schedule_templates'
            ],
            supportedEntities: [
              'packages',
              'products',
              'internal_products'
            ]
          }
        }
      });

      console.log('✅ Updated schedule API config:', updatedConfig.id);
    } else {
      console.log('🆕 Creating new schedule API config...');
      
      // Create new config
      const newConfig = await prisma.externalAPIConfig.create({
        data: {
          name: 'Schedule API',
          connectionType: 'schedule',
          provider: 'internal',
          category: 'scheduling',
          apiUrl: process.env.SCHEDULE_API_URL || '/api/schedules',
          description: 'Internal schedule API for packages, products, and internal products',
          version: '1.0.0',
          isActive: true,
          testMode: process.env.NODE_ENV === 'development',
          rateLimit: 1000,
          timeout: 30000,
          healthStatus: 'healthy',
          config: {
            endpoints: {
              schedules: '/api/schedules',
              availableSlots: '/api/teacher-schedule-slots',
              scheduleTemplates: '/api/admin/schedule-templates'
            },
            features: [
              'schedule_management',
              'availability_checking',
              'time_slot_booking',
              'schedule_templates'
            ],
            supportedEntities: [
              'packages',
              'products',
              'internal_products'
            ]
          }
        }
      });

      console.log('✅ Created schedule API config:', newConfig.id);
    }

    // Also create configs for packages, products, and internal products
    const entityConfigs = [
      {
        name: 'Packages Schedule API',
        connectionType: 'schedule',
        provider: 'internal',
        category: 'packages',
        description: 'Schedule API integration for packages',
        config: {
          entity: 'packages',
          endpoint: '/api/packages',
          scheduleEndpoint: '/api/schedules'
        }
      },
      {
        name: 'Products Schedule API',
        connectionType: 'schedule',
        provider: 'internal',
        category: 'products',
        description: 'Schedule API integration for products',
        config: {
          entity: 'products',
          endpoint: '/api/products',
          scheduleEndpoint: '/api/schedules'
        }
      },
      {
        name: 'Internal Products Schedule API',
        connectionType: 'schedule',
        provider: 'internal',
        category: 'internal_products',
        description: 'Schedule API integration for internal products',
        config: {
          entity: 'internal_products',
          endpoint: '/api/internal-products',
          scheduleEndpoint: '/api/schedules'
        }
      }
    ];

    for (const configData of entityConfigs) {
      const existingEntityConfig = await prisma.externalAPIConfig.findFirst({
        where: { name: configData.name }
      });

      if (existingEntityConfig) {
        console.log(`✅ ${configData.name} config already exists, updating...`);
        await prisma.externalAPIConfig.update({
          where: { id: existingEntityConfig.id },
          data: {
            ...configData,
            apiUrl: configData.config.endpoint,
            isActive: true,
            testMode: process.env.NODE_ENV === 'development',
            rateLimit: 1000,
            timeout: 30000,
            healthStatus: 'healthy'
          }
        });
      } else {
        console.log(`🆕 Creating ${configData.name} config...`);
        await prisma.externalAPIConfig.create({
          data: {
            ...configData,
            apiUrl: configData.config.endpoint,
            isActive: true,
            testMode: process.env.NODE_ENV === 'development',
            rateLimit: 1000,
            timeout: 30000,
            healthStatus: 'healthy'
          }
        });
      }
    }

    console.log('🎉 Schedule API configuration seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding schedule API configuration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedScheduleApiConfig()
  .then(() => {
    console.log('✅ Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });

export { seedScheduleApiConfig };
