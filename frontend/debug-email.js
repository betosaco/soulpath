// Debug email sending
import { OrderConfirmationService } from './lib/services/order-confirmation-service.js';

const testData = {
  customerName: "Test User",
  customerEmail: "alberto@matmax.world",
  customerPhone: "+51 981281297",
  orderNumber: "DEBUG-001", // Test data - server generates real order numbers
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
  currency: "S/.",
  scheduleDetails: [
    {
      selectedDate: "2025-01-15",
      selectedTime: "10:00",
      dayOfWeek: "Wednesday",
      teacher: "Test Teacher",
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

    // Transform test data to match OrderConfirmationService format
    const orderData = {
      id: testData.orderId,
      orderNumber: testData.orderNumber,
      customerName: testData.customerName,
      customerEmail: testData.customerEmail,
      customerPhone: testData.customerPhone,
      status: testData.orderStatus,
      paymentStatus: testData.paymentStatus,
      total: testData.totalAmount,
      currency: testData.currency,
      createdAt: testData.orderDate,
      items: testData.orderItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.unit_price,
        total: item.total_price
      })),
      scheduleDetails: testData.scheduleDetails
    };

    const result = await OrderConfirmationService.sendOrderConfirmation(orderData);

    if (result.success) {
      console.log('✅ Email sent successfully!');
    } else {
      console.log('❌ Email failed to send:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugEmail();
