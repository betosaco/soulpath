import fetch from 'node-fetch';

async function testApiEndpoints() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing API Endpoints with Schedule Integration...\n');

  const endpoints = [
    {
      name: 'Packages API',
      url: `${baseUrl}/api/packages?includeSchedule=true`,
      expectedFields: ['success', 'data', 'meta']
    },
    {
      name: 'Products API', 
      url: `${baseUrl}/api/products?includeSchedule=true&limit=3`,
      expectedFields: ['success', 'data', 'pagination', 'schedule']
    },
    {
      name: 'Schedules API',
      url: `${baseUrl}/api/schedules`,
      expectedFields: ['success', 'data']
    }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`);
      const response = await fetch(endpoint.url);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${endpoint.name}: SUCCESS`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Success: ${data.success}`);
        
        // Check for expected fields
        const missingFields = endpoint.expectedFields.filter(field => !(field in data));
        if (missingFields.length === 0) {
          console.log(`   ✅ All expected fields present: ${endpoint.expectedFields.join(', ')}`);
        } else {
          console.log(`   ⚠️ Missing fields: ${missingFields.join(', ')}`);
        }
        
        // Show data summary
        if (data.data) {
          console.log(`   📊 Data count: ${Array.isArray(data.data) ? data.data.length : 'N/A'}`);
        }
        if (data.schedule) {
          console.log(`   📅 Schedule count: ${data.schedule.length}`);
        }
      } else {
        console.log(`❌ ${endpoint.name}: FAILED`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ERROR`);
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
  }

  console.log('🎉 API Endpoint Testing Completed!');
}

testApiEndpoints()
  .then(() => {
    console.log('✅ All endpoint tests completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Endpoint testing failed:', error);
    process.exit(1);
  });
