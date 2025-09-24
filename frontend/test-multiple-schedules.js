// Test multiple booking schedules
const testData = {
  customerInfo: {
    name: "Maria Rodriguez",
    email: "alberto@matmax.world",
    phone: "981281297",
    countryCode: "+51",
    language: "en",
    billingDocumentType: "boleta_simple",
    dni: "87654321"
  },
  items: [
    {
      id: "1",
      name: "01 MATPASS",
      type: "package",
      quantity: 1,
      price: 60,
      sessions: 1,
      duration: 30,
      packageType: "individual"
    }
  ],
  totalAmount: 60,
  currency: "S/.",
  isGroupBooking: false,
  // Multiple scheduled sessions
  scheduleDetails: [
    {
      selectedDate: "2025-01-15",
      selectedTime: "10:00",
      dayOfWeek: "Wednesday",
      teacher: "Lucia Meza",
      serviceType: "Hatha Yoga",
      venue: "MatMax Yoga Studio"
    },
    {
      selectedDate: "2025-01-17",
      selectedTime: "14:00",
      dayOfWeek: "Friday",
      teacher: "Carlos Rodriguez",
      serviceType: "Vinyasa Yoga",
      venue: "MatMax Yoga Studio"
    },
    {
      selectedDate: "2025-01-20",
      selectedTime: "09:00",
      dayOfWeek: "Monday",
      teacher: "Ana Silva",
      serviceType: "Yin Yoga",
      venue: "MatMax Yoga Studio"
    },
    {
      selectedDate: "2025-01-22",
      selectedTime: "16:00",
      dayOfWeek: "Wednesday",
      teacher: "Pedro Martinez",
      serviceType: "Power Yoga",
      venue: "MatMax Yoga Studio"
    }
  ]
};

async function testMultipleSchedules() {
  try {
    console.log('🧪 Testing multiple booking schedules...');
    console.log('📧 Will send email to:', testData.customerInfo.email);
    console.log('📅 Scheduled sessions:', testData.scheduleDetails.length);
    
    const response = await fetch('http://localhost:3000/api/orders/create-unified', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test order created successfully!');
      console.log('📬 Check your email inbox for the multiple schedules confirmation');
      console.log('📱 Check your Telegram for the notification');
      console.log('Order ID:', result.orderId);
    } else {
      const errorText = await response.text();
      console.log('❌ Failed to create test order:', errorText);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testMultipleSchedules();
