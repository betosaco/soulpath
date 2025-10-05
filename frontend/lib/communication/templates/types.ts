/**
 * 🏗️ Modular Email Template System - Type Definitions
 * 
 * This system provides a flexible, maintainable approach to email templates
 * that can handle complex scenarios with reusable components.
 */

export interface OrderData {
  // Customer Information
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  
  // Order Information
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  currency: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  
  // Order Items
  orderItems: OrderItem[];
  
  // Specific Item Types
  matpassItems?: MatpassItem[];
  bookings?: Booking[];
  products?: Product[];
  
  // Customer Type
  isNewCustomer: boolean;
  
  // URLs
  orderUrl: string;
  websiteUrl: string;
}

export interface OrderItem {
  id: string;
  name: string;
  type: 'matpass' | 'booking' | 'product';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
}

export interface MatpassItem {
  name: string;
  type: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sessions: number;
  expiryDate: string;
  description?: string;
}

export interface Booking {
  id: string;
  bookingDate: string;
  bookingTime: string;
  sessionType: string;
  teacherName: string;
  venue: string;
  duration: number;
}

export interface Product {
  name: string;
  type: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
}

export interface Condition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'exists';
  value: any;
}

export interface DataMapping {
  [placeholder: string]: string | ((data: OrderData) => string);
}

export interface ComponentConfig {
  id: string;
  name: string;
  type: 'header' | 'content' | 'section' | 'footer';
  template: string;
  conditions: Condition[];
  order: number;
  dataMapping: DataMapping;
  required: boolean;
}

export interface EmailScenario {
  id: string;
  name: string;
  description: string;
  customerType: 'new' | 'existing' | 'both';
  orderTypes: string[];
  components: ComponentConfig[];
  subjectTemplate: string;
  priority: number;
  isActive: boolean;
}

export interface SubjectTemplate {
  template: string;
  placeholders: string[];
  conditions?: Condition[];
  maxLength?: number;
}

export interface TemplateEngine {
  processTemplate(template: string, data: OrderData): string;
  processSubject(subjectTemplate: SubjectTemplate, data: OrderData): string;
  validateConditions(conditions: Condition[], data: OrderData): boolean;
}

export interface EmailResult {
  success: boolean;
  subject: string;
  content: string;
  scenario: string;
  components: string[];
  error?: string;
}
