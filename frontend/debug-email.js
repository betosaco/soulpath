// Debug email sending
import { sendOrderConfirmationEmail } from './lib/send-order-confirmation-email.js';

const testData = {
  customerName: "Test User",
  customerEmail: "alberto@matmax.world",
  customerPhone: "+51 981281297",
  orderNumber: "DEBUG-001",
  orderId: "debug-order-123",
  orderDate: "2025-01-09",
  orderStatus: "confirmed",
  orderStatusText: "Confirmado",
  paymentStatus: "completed",
  paymentStatusText: "Completado",
  billingDocumentType: "boleta_simple",
  dni: "12345678",
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
    }
  ],
  subtotal: 60,
  taxAmount: 9.15,
  shippingAmount: 0,
  totalAmount: 60,
  currency: "PEN",
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
    }
  ],
  order_url: "https://matmax.world/orders/debug-123"
};

async function debugEmail() {
  try {
    console.log('🔍 Debugging email sending...');
    console.log('📧 Sending to:', testData.customerEmail);
    
    const result = await sendOrderConfirmationEmail(testData);
    
    if (result) {
      console.log('✅ Email sent successfully!');
    } else {
      console.log('❌ Email failed to send');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugEmail();
