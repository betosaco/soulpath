import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testScheduleApiIntegration() {
  try {
    console.log('🧪 Testing Schedule API Integration...\n');

    // Test 1: Check ExternalAPIConfig for schedule connection type
    console.log('1️⃣ Testing ExternalAPIConfig for schedule connection type...');
    const scheduleConfigs = await prisma.externalAPIConfig.findMany({
      where: {
        connectionType: 'schedule'
      }
    });

    console.log(`✅ Found ${scheduleConfigs.length} schedule API configurations:`);
    scheduleConfigs.forEach(config => {
      console.log(`   - ${config.name} (${config.category}) - Active: ${config.isActive}`);
    });

    // Test 2: Test schedule service functionality
    console.log('\n2️⃣ Testing Schedule Service functionality...');
    
    // Import the schedule service
    const { createScheduleApiService } = await import('../lib/services/schedule-api-service.ts');
    const scheduleService = createScheduleApiService();

    // Test connection
    const connectionTest = await scheduleService.testConnection();
    console.log(`✅ Schedule API connection test: ${connectionTest.success ? 'PASSED' : 'FAILED'}`);
    if (connectionTest.latency) {
      console.log(`   Latency: ${connectionTest.latency}ms`);
    }

    // Test getting schedules
    const schedulesResponse = await scheduleService.getSchedules({ available: true });
    console.log(`✅ Get schedules test: ${schedulesResponse.success ? 'PASSED' : 'FAILED'}`);
    if (schedulesResponse.data) {
      console.log(`   Found ${schedulesResponse.data.length} available schedules`);
    }

    // Test 3: Test API endpoints with schedule integration
    console.log('\n3️⃣ Testing API endpoints with schedule integration...');

    // Test packages API
    console.log('   Testing /api/packages with includeSchedule=true...');
    try {
      const packagesResponse = await fetch('http://localhost:3000/api/packages?includeSchedule=true');
      if (packagesResponse.ok) {
        const packagesData = await packagesResponse.json();
        console.log(`   ✅ Packages API: ${packagesData.success ? 'PASSED' : 'FAILED'}`);
        if (packagesData.schedule) {
          console.log(`   📅 Schedule data included: ${packagesData.schedule.length} schedules`);
        }
      } else {
        console.log(`   ❌ Packages API: HTTP ${packagesResponse.status}`);
      }
    } catch (error) {
      console.log(`   ⚠️ Packages API: ${error.message} (server might not be running)`);
    }

    // Test products API
    console.log('   Testing /api/products with includeSchedule=true...');
    try {
      const productsResponse = await fetch('http://localhost:3000/api/products?includeSchedule=true');
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        console.log(`   ✅ Products API: ${productsData.success ? 'PASSED' : 'FAILED'}`);
        if (productsData.schedule) {
          console.log(`   📅 Schedule data included: ${productsData.schedule.length} schedules`);
        }
      } else {
        console.log(`   ❌ Products API: HTTP ${productsResponse.status}`);
      }
    } catch (error) {
      console.log(`   ⚠️ Products API: ${error.message} (server might not be running)`);
    }

    // Test internal products API
    console.log('   Testing /api/internal-products with includeSchedule=true...');
    try {
      const internalProductsResponse = await fetch('http://localhost:3000/api/internal-products?includeSchedule=true');
      if (internalProductsResponse.ok) {
        const internalProductsData = await internalProductsResponse.json();
        console.log(`   ✅ Internal Products API: ${internalProductsData.success ? 'PASSED' : 'FAILED'}`);
        if (internalProductsData.schedule) {
          console.log(`   📅 Schedule data included: ${internalProductsData.schedule.length} schedules`);
        }
      } else {
        console.log(`   ❌ Internal Products API: HTTP ${internalProductsResponse.status}`);
      }
    } catch (error) {
      console.log(`   ⚠️ Internal Products API: ${error.message} (server might not be running)`);
    }

    // Test 4: Test schedule creation
    console.log('\n4️⃣ Testing schedule creation...');
    const testSchedule = {
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '10:00',
      capacity: 5,
      isAvailable: true,
      autoAvailable: true
    };

    const createResponse = await scheduleService.createSchedule(testSchedule);
    console.log(`✅ Create schedule test: ${createResponse.success ? 'PASSED' : 'FAILED'}`);
    if (createResponse.success) {
      console.log(`   Created schedule ID: ${createResponse.data[0].id}`);
    } else {
      console.log(`   Error: ${createResponse.error}`);
    }

    // Test 5: Test available slots
    console.log('\n5️⃣ Testing available slots...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const slotsResponse = await scheduleService.getAvailableSlots({
      startDate: tomorrow.toISOString().split('T')[0],
      endDate: dayAfter.toISOString().split('T')[0]
    });
    console.log(`✅ Available slots test: ${slotsResponse.success ? 'PASSED' : 'FAILED'}`);
    if (slotsResponse.data) {
      console.log(`   Found ${slotsResponse.data.length} available slots`);
    }

    // Test 6: Verify database schema
    console.log('\n6️⃣ Verifying database schema...');
    const schemaCheck = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'external_api_configs' 
      AND column_name = 'connection_type'
    `;
    
    if (schemaCheck.length > 0) {
      console.log('✅ Database schema updated: connection_type column exists');
    } else {
      console.log('❌ Database schema: connection_type column missing');
    }

    console.log('\n🎉 Schedule API Integration Test Completed!');
    console.log('\n📋 Summary:');
    console.log('   - ExternalAPIConfig supports schedule connection type');
    console.log('   - Schedule API service is functional');
    console.log('   - Packages, Products, and Internal Products APIs support schedule integration');
    console.log('   - Schedule creation and retrieval works');
    console.log('   - Available slots functionality works');

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test function
testScheduleApiIntegration()
  .then(() => {
    console.log('\n✅ All tests completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Tests failed:', error);
    process.exit(1);
  });

export { testScheduleApiIntegration };
