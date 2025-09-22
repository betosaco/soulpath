// Test script to check API endpoint
const testData = {
  customerInfo: {
    name: "Test User",
    email: "test@example.com",
    phone: "123456789",
    countryCode: "PE",
    language: "en"
  },
  items: [
    {
      id: "1",
      name: "Test Package",
      type: "package",
      quantity: 1,
      price: 100
    }
  ],
  totalAmount: 100,
  currency: "PEN",
  isGroupBooking: false
};

async function testAPI() {
  try {
    console.log('Testing API with data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('https://matmax.world/api/orders/create-unified', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    if (!response.ok) {
      try {
        const errorJson = JSON.parse(responseText);
        console.log('Parsed error:', errorJson);
      } catch (e) {
        console.log('Could not parse error as JSON');
      }
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

testAPI();
