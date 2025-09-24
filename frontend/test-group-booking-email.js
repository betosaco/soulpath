import { sendOrderConfirmationEmail } from './lib/send-order-confirmation-email.ts';

// Test data for group booking email
const testGroupBookingData = {
  customerName: "Jose Garfias",
  customerEmail: "alberto@matmax.world",
  customerPhone: "981281297",
  orderNumber: "ORD-TEST-001", // Test data - server generates real order numbers
  orderId: "test-order-123",
  orderDate: "2025-01-09",
  orderStatus: "confirmed",
  orderStatusText: "Confirmado",
  paymentStatus: "completed",
  paymentStatusText: "Completado",
  billingDocumentType: "boleta_simple",
  dni: "12345678",
  ruc: "",
  companyName: "",
  orderItems: [
    {
      name: "01 MATPASS",
      description: "Paquete de Yoga Individual",
      type_text: "Paquete de Yoga",
      quantity: 1,
      unit_price: 60,
      total_price: 60,
      sessions: 1,
      duration_minutes: 30
    },
    {
      name: "01 MATPASS",
      description: "Paquete de Yoga Individual", 
      type_text: "Paquete de Yoga",
      quantity: 1,
      unit_price: 60,
      total_price: 60,
      sessions: 1,
      duration_minutes: 30
    }
  ],
  subtotal: 100.85,
  tax_amount: 19.15,
  shipping_amount: 0,
  total_amount: 120,
  currency: "S/.",
  notes: "Test group booking order",
  shipping_address: null,
  scheduleDetails: {
    selectedDate: "2025-09-22",
    selectedTime: "08:15",
    teacher: "Lucia Meza",
    serviceType: "Hatha Yoga",
    venue: "MatMax Yoga Studio",
    dayOfWeek: "Monday"
  },
  packageBookingDetails: {
    packageName: "01 MATPASS",
    packageDescription: "Paquete de Yoga Individual",
    sessionsCount: 1,
    durationMinutes: 30,
    packageType: "individual"
  },
  // Group booking data
  is_group_booking: true,
  group_members_count: 2,
  group_members: [
    {
      first_name: "Jose",
      last_name: "Garfias",
      email: "jose@example.com",
      phone: "981281297",
      country_code: "PE",
      package_name: "01 MATPASS",
      birth_date: "1990-05-15",
      birth_time: "14:30",
      birth_place: "Lima, Peru",
      question: "¿Cuál es mi propósito en la vida?"
    },
    {
      first_name: "Alberto",
      last_name: "Saco",
      email: "alberto@matmax.world",
      phone: "981281297",
      country_code: "PE",
      package_name: "01 MATPASS",
      birth_date: "1985-12-10",
      birth_time: "09:15",
      birth_place: "Cusco, Peru",
      question: "¿Cómo puedo mejorar mi salud?"
    }
  ],
  order_url: "https://matmax.world/orders/test-order-123"
};

async function testGroupBookingEmail() {
  try {
    console.log('🧪 Testing group booking email...');
    console.log('📧 Sending test email to:', testGroupBookingData.customerEmail);
    console.log('👥 Group members:', testGroupBookingData.group_members_count);
    
    const result = await sendOrderConfirmationEmail(testGroupBookingData);
    
    if (result) {
      console.log('✅ Test email sent successfully!');
      console.log('📬 Check your email inbox for the group booking confirmation');
    } else {
      console.log('❌ Failed to send test email');
    }
  } catch (error) {
    console.error('❌ Error sending test email:', error);
  }
}

testGroupBookingEmail();
