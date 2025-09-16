// Test script to verify Izipay credentials
import https from 'https';

// Test credentials from .env.local
const credentials = {
  username: '88569105',
  password: 'testpassword_NS]pdOEIQsM4RMu16WF89kCViBW9ddilhEdsq02sHA2T',
  apiBaseUrl: 'https://api.micuentaweb.pe'
};

// Test payload
const payload = {
  amount: 10000, // 100.00 PEN in cents
  currency: 'PEN',
  orderId: 'test-credentials-' + Date.now(),
  customer: {
    email: 'test@example.com',
    reference: 'test-credentials-' + Date.now()
  }
};

// Create Basic Auth header
const auth = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');

const options = {
  hostname: 'api.micuentaweb.pe',
  port: 443,
  path: '/api-payment/V4/Charge/CreatePayment',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json'
  }
};

console.log('🔍 Testing Izipay credentials...');
console.log('📦 Payload:', JSON.stringify(payload, null, 2));
console.log('🔑 Auth header:', `Basic ${auth.substring(0, 20)}...`);

const req = https.request(options, (res) => {
  console.log('📡 Response status:', res.statusCode);
  console.log('📡 Response headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📊 Response body:', data);
    
    try {
      const parsed = JSON.parse(data);
      console.log('📊 Parsed response:', JSON.stringify(parsed, null, 2));
      
      if (parsed.status === 'SUCCESS') {
        console.log('✅ Credentials are valid!');
      } else {
        console.log('❌ Credentials failed:', parsed.answer?.errorMessage || 'Unknown error');
      }
    } catch (e) {
      console.log('❌ Failed to parse response:', e.message);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error);
});

req.write(JSON.stringify(payload));
req.end();
