// Test group booking with multiple schedules
const testData = {
  customerInfo: {
    name: "Jose Garfias",
    email: "alberto@matmax.world",
    phone: "981281297",
    countryCode: "+51",
    language: "en",
    billingDocumentType: "boleta_simple",
    dni: "12345678"
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
    },
    {
      id: "2",
      name: "01 MATPASS",
      type: "package",
      quantity: 1,
      price: 60,
      sessions: 1,
      duration: 30,
      packageType: "individual"
    }
  ],
  totalAmount: 120,
  currency: "PEN",
  isGroupBooking: true,
  groupMembers: [
    {
      firstName: "Jose",
      lastName: "Garfias",
      email: "jose@example.com",
      phone: "981281297",
      countryCode: "+51",
      packageId: "1",
      birthDate: "1990-05-15",
      birthTime: "14:30",
      birthPlace: "Lima, Peru",
      question: "¿Cuál es mi propósito en la vida?"
    },
    {
      firstName: "Alberto",
      lastName: "Saco",
      email: "alberto@matmax.world",
      phone: "981281297",
      countryCode: "+51",
      packageId: "2",
      birthDate: "1985-12-10",
      birthTime: "09:15",
      birthPlace: "Cusco, Peru",
      question: "¿Cómo puedo mejorar mi salud?"
    }
  ],
  // Multiple scheduled sessions for group booking
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
    }
  ]
};

async function testGroupMultipleSchedules() {
  try {
    console.log('🧪 Testing group booking with multiple schedules...');
    console.log('📧 Will send email to:', testData.customerInfo.email);
    console.log('👥 Group members:', testData.groupMembers.length);
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
      console.log('📬 Check your email inbox for the group booking with multiple schedules');
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

testGroupMultipleSchedules();
