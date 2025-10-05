export interface Placeholder {
  key: string;
  description: string;
  category: string;
  example?: string;
  isConditional?: boolean;
}

export const EMAIL_PLACEHOLDERS: Record<string, Placeholder[]> = {
  basic: [
    { key: '{{userName}}', description: 'User\'s full name', category: 'basic', example: 'John Doe' },
    { key: '{{userEmail}}', description: 'User\'s email address', category: 'basic', example: 'john@example.com' },
    { key: '{{userPhone}}', description: 'User\'s phone number', category: 'basic', example: '+1234567890' },
    { key: '{{bookingId}}', description: 'Unique booking ID', category: 'basic', example: 'BK-12345' },
    { key: '{{language}}', description: 'Session language', category: 'basic', example: 'English' },
    { key: '{{adminEmail}}', description: 'Admin contact email', category: 'basic', example: 'admin@matmax.store' },
    { key: '{{submissionDate}}', description: 'When the booking was submitted', category: 'basic', example: '2024-01-15' },
    { key: '{{orderNumber}}', description: 'Order number', category: 'basic', example: 'ORD-12345' },
    { key: '{{orderDate}}', description: 'Order date', category: 'basic', example: '2024-01-15' },
    { key: '{{paymentMethod}}', description: 'Payment method used', category: 'basic', example: 'Credit Card' }
  ],
  booking: [
    { key: '{{birthDate}}', description: 'Client\'s birth date', category: 'booking', example: '1990-05-15' },
    { key: '{{birthTime}}', description: 'Client\'s birth time', category: 'booking', example: '14:30' },
    { key: '{{birthPlace}}', description: 'Client\'s birth location', category: 'booking', example: 'New York, USA' },
    { key: '{{clientQuestion}}', description: 'Client\'s specific question', category: 'booking', example: 'What does my future hold?' },
    { key: '{{bookingDate}}', description: 'Scheduled session date', category: 'booking', example: '2024-01-20' },
    { key: '{{bookingTime}}', description: 'Scheduled session time', category: 'booking', example: '10:00 AM' },
    { key: '{{reminderDate}}', description: 'Date reminder was sent', category: 'booking', example: '2024-01-19' },
    { key: '{{sessionType}}', description: 'Type of yoga session', category: 'booking', example: 'Hatha Yoga' },
    { key: '{{teacherName}}', description: 'Instructor name', category: 'booking', example: 'Maria Rodriguez' },
    { key: '{{venue}}', description: 'Studio location', category: 'booking', example: 'MATMAX Yoga Studio' }
  ],
  matpass: [
    { key: '{{matpassType}}', description: 'MatPass type name', category: 'matpass', example: '01 MATPASS' },
    { key: '{{matpassDescription}}', description: 'MatPass description', category: 'matpass', example: '12 sessions package' },
    { key: '{{matpassPrice}}', description: 'MatPass price', category: 'matpass', example: 'S/. 350.00' },
    { key: '{{matpassStartDate}}', description: 'MatPass start date', category: 'matpass', example: '2024-01-15' },
    { key: '{{matpassEndDate}}', description: 'MatPass expiry date', category: 'matpass', example: '2024-02-15' },
    { key: '{{matpassSessions}}', description: 'Number of sessions', category: 'matpass', example: '12' }
  ],
  products: [
    { key: '{{productName}}', description: 'Product name', category: 'products', example: 'Yoga Mat' },
    { key: '{{productDescription}}', description: 'Product description', category: 'products', example: 'Premium yoga mat' },
    { key: '{{productQuantity}}', description: 'Product quantity', category: 'products', example: '2' },
    { key: '{{productPrice}}', description: 'Product price', category: 'products', example: 'S/. 50.00' },
    { key: '{{productsPrice}}', description: 'Total products price', category: 'products', example: 'S/. 100.00' }
  ],
  order: [
    { key: '{{subtotal}}', description: 'Order subtotal', category: 'order', example: 'S/. 300.00' },
    { key: '{{taxRate}}', description: 'Tax rate percentage', category: 'order', example: '18' },
    { key: '{{taxAmount}}', description: 'Tax amount', category: 'order', example: 'S/. 54.00' },
    { key: '{{totalAmount}}', description: 'Total order amount', category: 'order', example: 'S/. 354.00' },
    { key: '{{currency}}', description: 'Currency symbol', category: 'order', example: 'S/.' }
  ],
  conditional: [
    { key: '{{hasMatpass}}', description: 'Has MatPass in order', category: 'conditional', example: 'true', isConditional: true },
    { key: '{{hasBooking}}', description: 'Has booking in order', category: 'conditional', example: 'true', isConditional: true },
    { key: '{{hasProducts}}', description: 'Has products in order', category: 'conditional', example: 'true', isConditional: true }
  ],
  shipping: [
    { key: '{{shippingAddress}}', description: 'Shipping address object', category: 'shipping', example: 'shippingAddress.address' },
    { key: '{{shippingAddress.address}}', description: 'Shipping street address', category: 'shipping', example: '123 Main St' },
    { key: '{{shippingAddress.city}}', description: 'Shipping city', category: 'shipping', example: 'Lima' },
    { key: '{{shippingAddress.state}}', description: 'Shipping state/province', category: 'shipping', example: 'Lima' },
    { key: '{{shippingAddress.zipCode}}', description: 'Shipping postal code', category: 'shipping', example: '15001' },
    { key: '{{shippingAddress.country}}', description: 'Shipping country', category: 'shipping', example: 'Peru' }
  ],
  scheduling: [
    { key: '{{newDate}}', description: 'New rescheduled date', category: 'scheduling', example: '2024-01-25' },
    { key: '{{newTime}}', description: 'New rescheduled time', category: 'scheduling', example: '2:00 PM' },
    { key: '{{oldDate}}', description: 'Previous date', category: 'scheduling', example: '2024-01-20' },
    { key: '{{oldTime}}', description: 'Previous time', category: 'scheduling', example: '10:00 AM' },
    { key: '{{rescheduleReason}}', description: 'Reason for rescheduling', category: 'scheduling', example: 'Emergency' },
    { key: '{{rescheduleDate}}', description: 'Date of reschedule', category: 'scheduling', example: '2024-01-18' }
  ],
  video: [
    { key: '{{videoConferenceLink}}', description: 'Video session link (when active)', category: 'video', example: 'https://meet.google.com/abc-defg-hij', isConditional: true },
    { key: '{{VIDEO_LINK}}', description: 'Direct video link placeholder', category: 'video', example: 'https://meet.google.com/abc-defg-hij' },
    { key: '{{#if videoConferenceLink}}...{{/if}}', description: 'Conditional video link block', category: 'video', example: '{{#if videoConferenceLink}}Join here: {{videoConferenceLink}}{{/if}}', isConditional: true }
  ]
};

export const SMS_PLACEHOLDERS: Record<string, Placeholder[]> = {
  basic: [
    { key: '{{userName}}', description: 'User\'s full name', category: 'basic', example: 'John Doe' },
    { key: '{{bookingId}}', description: 'Unique booking ID', category: 'basic', example: 'BK-12345' },
    { key: '{{language}}', description: 'Session language', category: 'basic', example: 'English' }
  ],
  verification: [
    { key: '{{otpCode}}', description: 'OTP verification code', category: 'verification', example: '123456' },
    { key: '{{expiryTime}}', description: 'OTP expiry time', category: 'verification', example: '10 minutes' }
  ],
  booking: [
    { key: '{{bookingDate}}', description: 'Scheduled session date', category: 'booking', example: '2024-01-20' },
    { key: '{{bookingTime}}', description: 'Scheduled session time', category: 'booking', example: '10:00 AM' },
    { key: '{{sessionType}}', description: 'Type of session', category: 'booking', example: 'Individual Reading' }
  ],
  scheduling: [
    { key: '{{newDate}}', description: 'New rescheduled date', category: 'scheduling', example: '2024-01-25' },
    { key: '{{newTime}}', description: 'New rescheduled time', category: 'scheduling', example: '2:00 PM' },
    { key: '{{rescheduleReason}}', description: 'Reason for rescheduling', category: 'scheduling', example: 'Emergency' }
  ]
};

export function getPlaceholders(type: 'email' | 'sms', category?: string): Placeholder[] {
  const placeholderMap = type === 'email' ? EMAIL_PLACEHOLDERS : SMS_PLACEHOLDERS;
  
  if (category && placeholderMap[category]) {
    return placeholderMap[category];
  }
  
  // Return all placeholders if no category specified
  return Object.values(placeholderMap).flat();
}

export function getPlaceholdersGrouped(type: 'email' | 'sms'): Record<string, Placeholder[]> {
  return type === 'email' ? EMAIL_PLACEHOLDERS : SMS_PLACEHOLDERS;
}

export function replacePlaceholders(content: string, data: Record<string, unknown>): string {
  let result = content;
  
  // Replace simple placeholders
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, 'g'), String(value || ''));
  });
  
  // Handle conditional blocks (simple implementation)
  result = result.replace(/\{\{#if\s+(\w+)\}\}(.*?)\{\{\/if\}\}/gs, (_, condition, content) => {
    if (data[condition]) {
      return content;
    }
    return '';
  });
  
  return result;
}

export function validatePlaceholders(content: string, type: 'email' | 'sms'): { valid: boolean; missing: string[] } {
  const placeholders = getPlaceholders(type);
  const placeholderKeys = placeholders.map(p => p.key.replace(/[{}]/g, ''));
  
  const usedPlaceholders = content.match(/\{\{(\w+)\}\}/g) || [];
  const usedKeys = usedPlaceholders.map(p => p.replace(/[{}]/g, ''));
  
  const missing = usedKeys.filter(key => !placeholderKeys.includes(key));
  
  return {
    valid: missing.length === 0,
    missing
  };
}
