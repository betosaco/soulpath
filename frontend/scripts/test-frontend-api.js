// Test the frontend API call
const testAPI = async () => {
  try {
    console.log('🧪 Testing frontend API call...');
    
    // Simulate the exact request from the frontend
    const response = await fetch('http://localhost:3000/api/admin/communication/templates?type=email', {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('📊 Response data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
};

testAPI();
