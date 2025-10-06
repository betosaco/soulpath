/**
 * 🔄 Centralized Placeholder Registry
 *
 * Type-safe, resolver-based placeholder system shared between
 * the template system and workflow system.
 *
 * This registry provides:
 * - Type-safe placeholder definitions with resolvers
 * - Category-based organization
 * - Auto-completion support for editors
 * - Consistent data access across systems
 */

import { OrderData } from './templates/types';

export interface PlaceholderDefinition {
  description: string;
  category: PlaceholderCategory;
  resolver: (data: OrderData) => string | number | undefined;
  example?: string;
  required?: boolean;
}

export type PlaceholderCategory =
  | 'user'
  | 'order'
  | 'matpass'
  | 'booking'
  | 'product'
  | 'payment'
  | 'system';

export const placeholderRegistry: Record<string, PlaceholderDefinition> = {
  // 👤 User Information
  userName: {
    description: "Customer's full name",
    category: 'user',
    resolver: (data: OrderData) => data.customerName,
    example: 'Juan Pérez',
    required: true,
  },
  userEmail: {
    description: "Customer's email address",
    category: 'user',
    resolver: (data: OrderData) => data.customerEmail,
    example: 'juan@email.com',
    required: true,
  },
  userPhone: {
    description: "Customer's phone number",
    category: 'user',
    resolver: (data: OrderData) => data.customerPhone,
    example: '+51 999 123 456',
  },

  // 📦 Order Information
  orderNumber: {
    description: 'Unique order identifier',
    category: 'order',
    resolver: (data: OrderData) => data.orderNumber,
    example: 'ORD-2024-00123',
    required: true,
  },
  orderDate: {
    description: 'Order creation date',
    category: 'order',
    resolver: (data: OrderData) => data.orderDate,
    example: '2024-10-05',
    required: true,
  },
  orderTotal: {
    description: 'Total order amount',
    category: 'order',
    resolver: (data: OrderData) => data.totalAmount,
    example: '150.00',
    required: true,
  },
  orderCurrency: {
    description: 'Order currency code',
    category: 'order',
    resolver: (data: OrderData) => data.currency,
    example: 'PEN',
    required: true,
  },
  orderSubtotal: {
    description: 'Order subtotal (before tax)',
    category: 'order',
    resolver: (data: OrderData) => data.subtotal,
    example: '130.00',
  },
  orderTax: {
    description: 'Tax amount',
    category: 'order',
    resolver: (data: OrderData) => data.taxAmount,
    example: '20.00',
  },
  orderShipping: {
    description: 'Shipping amount',
    category: 'order',
    resolver: (data: OrderData) => data.shippingAmount,
    example: '10.00',
  },

  // 🧘 MatPass Information
  matpassType: {
    description: 'Name of the purchased MatPass',
    category: 'matpass',
    resolver: (data: OrderData) => data.matpassItems?.[0]?.name,
    example: 'MatPass 10 Clases',
  },
  matpassSessions: {
    description: 'Number of sessions in the MatPass',
    category: 'matpass',
    resolver: (data: OrderData) => data.matpassItems?.[0]?.sessions,
    example: '10',
  },
  matpassExpiry: {
    description: 'MatPass expiration date',
    category: 'matpass',
    resolver: (data: OrderData) => data.matpassItems?.[0]?.expiryDate,
    example: '2024-12-05',
  },
  matpassPrice: {
    description: 'MatPass unit price',
    category: 'matpass',
    resolver: (data: OrderData) => data.matpassItems?.[0]?.unitPrice,
    example: '120.00',
  },

  // 📅 Booking Information
  bookingDate: {
    description: 'Scheduled booking date',
    category: 'booking',
    resolver: (data: OrderData) => data.bookings?.[0]?.bookingDate,
    example: '2024-10-10',
  },
  bookingTime: {
    description: 'Scheduled booking time',
    category: 'booking',
    resolver: (data: OrderData) => data.bookings?.[0]?.bookingTime,
    example: '10:00',
  },
  bookingSessionType: {
    description: 'Type of wellness session',
    category: 'booking',
    resolver: (data: OrderData) => data.bookings?.[0]?.sessionType,
    example: 'Yoga Flow',
  },
  bookingTeacher: {
    description: 'Teacher/Instructor name',
    category: 'booking',
    resolver: (data: OrderData) => data.bookings?.[0]?.teacherName,
    example: 'María García',
  },
  bookingVenue: {
    description: 'Venue location',
    category: 'booking',
    resolver: (data: OrderData) => data.bookings?.[0]?.venue,
    example: 'Centro Lima',
  },
  bookingDuration: {
    description: 'Session duration in minutes',
    category: 'booking',
    resolver: (data: OrderData) => data.bookings?.[0]?.duration,
    example: '60',
  },

  // 🛍️ Product Information
  productName: {
    description: 'Name of the purchased product',
    category: 'product',
    resolver: (data: OrderData) => data.products?.[0]?.name,
    example: 'Yoga Mat Premium',
  },
  productDescription: {
    description: 'Product description',
    category: 'product',
    resolver: (data: OrderData) => data.products?.[0]?.description,
    example: 'High-quality yoga mat with non-slip surface',
  },

  // 💳 Payment Information
  paymentMethod: {
    description: 'Payment method used',
    category: 'payment',
    resolver: (data: OrderData) => 'TBD', // To be implemented
    example: 'Tarjeta de Crédito',
  },

  // 🔗 System URLs
  orderUrl: {
    description: 'Customer order details URL',
    category: 'system',
    resolver: (data: OrderData) => data.orderUrl,
    example: 'https://matmax.com/orders/ORD-2024-00123',
  },
  websiteUrl: {
    description: 'Company website URL',
    category: 'system',
    resolver: (data: OrderData) => data.websiteUrl,
    example: 'https://matmax.com',
  },

  // 🤖 Dynamic Placeholders (for workflow variables)
  workflowVar1: {
    description: 'Custom workflow variable 1',
    category: 'system',
    resolver: (data: OrderData) => data.workflowVar1, // Populated by workflow
    example: 'Custom value from workflow',
  },
  workflowVar2: {
    description: 'Custom workflow variable 2',
    category: 'system',
    resolver: (data: OrderData) => data.workflowVar2,
    example: 'Another custom value',
  },
};

// Utility Functions
export function getPlaceholdersByCategory(category: PlaceholderCategory): Record<string, PlaceholderDefinition> {
  return Object.fromEntries(
    Object.entries(placeholderRegistry).filter(([_, def]) => def.category === category)
  );
}

export function getAllPlaceholders(): Record<string, PlaceholderDefinition> {
  return placeholderRegistry;
}

export function getRequiredPlaceholders(): Record<string, PlaceholderDefinition> {
  return Object.fromEntries(
    Object.entries(placeholderRegistry).filter(([_, def]) => def.required)
  );
}

export function resolvePlaceholder(key: string, data: OrderData): string | number | undefined {
  const definition = placeholderRegistry[key];
  if (!definition) {
    console.warn(`Placeholder '${key}' not found in registry`);
    return `{{${key}}}`; // Return as-is if not found
  }

  try {
    const value = definition.resolver(data);
    return value !== undefined ? String(value) : `{{${key}}}`;
  } catch (error) {
    console.error(`Error resolving placeholder '${key}':`, error);
    return `{{${key}}}`; // Return as-is on error
  }
}

export function resolvePlaceholders(text: string, data: OrderData): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = resolvePlaceholder(key, data);
    return value !== undefined ? String(value) : match;
  });
}

// Type-safe placeholder keys for autocomplete
export type PlaceholderKey = keyof typeof placeholderRegistry;

// Categories for UI organization
export const placeholderCategories: Record<PlaceholderCategory, { label: string; icon: string; color: string }> = {
  user: { label: 'User Information', icon: '👤', color: '#3b82f6' },
  order: { label: 'Order Details', icon: '📦', color: '#10b981' },
  matpass: { label: 'MatPass', icon: '🧘', color: '#8b5cf6' },
  booking: { label: 'Bookings', icon: '📅', color: '#f59e0b' },
  product: { label: 'Products', icon: '🛍️', color: '#ec4899' },
  payment: { label: 'Payment', icon: '💳', color: '#06b6d4' },
  system: { label: 'System', icon: '🔗', color: '#64748b' },
};

// Validation helpers
export function validateRequiredPlaceholders(data: OrderData): { missing: string[]; valid: boolean } {
  const required = getRequiredPlaceholders();
  const missing: string[] = [];

  for (const [key, definition] of Object.entries(required)) {
    const value = definition.resolver(data);
    if (value === undefined || value === null || value === '') {
      missing.push(key);
    }
  }

  return {
    missing,
    valid: missing.length === 0,
  };
}

export function getPlaceholderSuggestions(searchTerm: string = '', category?: PlaceholderCategory): Array<{
  key: string;
  definition: PlaceholderDefinition;
  matchScore: number;
}> {
  let placeholders = Object.entries(placeholderRegistry);

  // Filter by category if specified
  if (category) {
    placeholders = placeholders.filter(([_, def]) => def.category === category);
  }

  // Filter and score by search term
  const scored = placeholders.map(([key, definition]) => {
    let score = 0;
    const search = searchTerm.toLowerCase();
    const keyLower = key.toLowerCase();
    const descLower = definition.description.toLowerCase();

    if (keyLower.includes(search)) score += 3;
    if (descLower.includes(search)) score += 2;
    if (definition.category.toLowerCase().includes(search)) score += 1;

    return { key, definition, matchScore: score };
  }).filter(item => item.matchScore > 0 || !searchTerm);

  // Sort by score (highest first)
  return scored.sort((a, b) => b.matchScore - a.matchScore);
}
