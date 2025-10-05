/**
 * 📋 Email Scenarios Configuration
 * 
 * Defines all possible email scenarios and their component requirements
 */

import { EmailScenario } from '../types';

export const EMAIL_SCENARIOS: EmailScenario[] = [
  // NEW CUSTOMER SCENARIOS
  {
    id: 'new_customer_matpass_only',
    name: 'New Customer - MatPass Only',
    description: 'Welcome email for new customers purchasing only MatPass',
    customerType: 'new',
    orderTypes: ['matpass'],
    components: [
      { id: 'welcome_header', order: 1 },
      { id: 'matpass_info', order: 2 },
      { id: 'order_summary', order: 3 },
      { id: 'next_steps', order: 4 },
      { id: 'standard_footer', order: 5 }
    ],
    subjectTemplate: 'new_customer_matpass',
    priority: 100,
    isActive: true
  },
  {
    id: 'new_customer_matpass_booking',
    name: 'New Customer - MatPass + Booking',
    description: 'Welcome email for new customers with MatPass and booking',
    customerType: 'new',
    orderTypes: ['matpass', 'booking'],
    components: [
      { id: 'welcome_header', order: 1 },
      { id: 'matpass_info', order: 2 },
      { id: 'booking_info', order: 3 },
      { id: 'order_summary', order: 4 },
      { id: 'next_steps', order: 5 },
      { id: 'standard_footer', order: 6 }
    ],
    subjectTemplate: 'new_customer_matpass_booking',
    priority: 90,
    isActive: true
  },
  {
    id: 'new_customer_matpass_products',
    name: 'New Customer - MatPass + Products',
    description: 'Welcome email for new customers with MatPass and products',
    customerType: 'new',
    orderTypes: ['matpass', 'product'],
    components: [
      { id: 'welcome_header', order: 1 },
      { id: 'matpass_info', order: 2 },
      { id: 'product_info', order: 3 },
      { id: 'order_summary', order: 4 },
      { id: 'shipping_info', order: 5 },
      { id: 'next_steps', order: 6 },
      { id: 'standard_footer', order: 7 }
    ],
    subjectTemplate: 'new_customer_matpass_products',
    priority: 85,
    isActive: true
  },
  {
    id: 'new_customer_matpass_booking_products',
    name: 'New Customer - MatPass + Booking + Products',
    description: 'Welcome email for new customers with MatPass, booking, and products',
    customerType: 'new',
    orderTypes: ['matpass', 'booking', 'product'],
    components: [
      { id: 'welcome_header', order: 1 },
      { id: 'matpass_info', order: 2 },
      { id: 'booking_info', order: 3 },
      { id: 'product_info', order: 4 },
      { id: 'order_summary', order: 5 },
      { id: 'shipping_info', order: 6 },
      { id: 'next_steps', order: 7 },
      { id: 'standard_footer', order: 8 }
    ],
    subjectTemplate: 'new_customer_complete',
    priority: 80,
    isActive: true
  },

  // EXISTING CUSTOMER SCENARIOS
  {
    id: 'existing_customer_matpass_only',
    name: 'Existing Customer - MatPass Only',
    description: 'Renewal email for existing customers purchasing only MatPass',
    customerType: 'existing',
    orderTypes: ['matpass'],
    components: [
      { id: 'renewal_header', order: 1 },
      { id: 'matpass_info', order: 2 },
      { id: 'order_summary', order: 3 },
      { id: 'reminders', order: 4 },
      { id: 'next_steps', order: 5 },
      { id: 'standard_footer', order: 6 }
    ],
    subjectTemplate: 'existing_customer_matpass',
    priority: 95,
    isActive: true
  },
  {
    id: 'existing_customer_matpass_booking',
    name: 'Existing Customer - MatPass + Booking',
    description: 'Renewal email for existing customers with MatPass and booking',
    customerType: 'existing',
    orderTypes: ['matpass', 'booking'],
    components: [
      { id: 'renewal_header', order: 1 },
      { id: 'matpass_info', order: 2 },
      { id: 'booking_info', order: 3 },
      { id: 'order_summary', order: 4 },
      { id: 'reminders', order: 5 },
      { id: 'next_steps', order: 6 },
      { id: 'standard_footer', order: 7 }
    ],
    subjectTemplate: 'existing_customer_matpass_booking',
    priority: 85,
    isActive: true
  },
  {
    id: 'existing_customer_matpass_products',
    name: 'Existing Customer - MatPass + Products',
    description: 'Renewal email for existing customers with MatPass and products',
    customerType: 'existing',
    orderTypes: ['matpass', 'product'],
    components: [
      { id: 'renewal_header', order: 1 },
      { id: 'matpass_info', order: 2 },
      { id: 'product_info', order: 3 },
      { id: 'order_summary', order: 4 },
      { id: 'shipping_info', order: 5 },
      { id: 'reminders', order: 6 },
      { id: 'next_steps', order: 7 },
      { id: 'standard_footer', order: 8 }
    ],
    subjectTemplate: 'existing_customer_matpass_products',
    priority: 80,
    isActive: true
  },
  {
    id: 'existing_customer_matpass_booking_products',
    name: 'Existing Customer - MatPass + Booking + Products',
    description: 'Renewal email for existing customers with MatPass, booking, and products',
    customerType: 'existing',
    orderTypes: ['matpass', 'booking', 'product'],
    components: [
      { id: 'renewal_header', order: 1 },
      { id: 'matpass_info', order: 2 },
      { id: 'booking_info', order: 3 },
      { id: 'product_info', order: 4 },
      { id: 'order_summary', order: 5 },
      { id: 'shipping_info', order: 6 },
      { id: 'reminders', order: 7 },
      { id: 'next_steps', order: 8 },
      { id: 'standard_footer', order: 9 }
    ],
    subjectTemplate: 'existing_customer_complete',
    priority: 75,
    isActive: true
  },

  // FALLBACK SCENARIOS
  {
    id: 'fallback_generic',
    name: 'Generic Fallback',
    description: 'Generic email for unmatched scenarios',
    customerType: 'both',
    orderTypes: ['matpass', 'booking', 'product'],
    components: [
      { id: 'generic_header', order: 1 },
      { id: 'order_summary', order: 2 },
      { id: 'standard_footer', order: 3 }
    ],
    subjectTemplate: 'generic',
    priority: 1,
    isActive: true
  }
];
