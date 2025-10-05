/**
 * 📝 Subject Templates Configuration
 * 
 * Defines dynamic subject templates for different scenarios
 */

import { SubjectTemplate } from '../types';

export const SUBJECT_TEMPLATES: { [key: string]: SubjectTemplate } = {
  // NEW CUSTOMER SUBJECTS
  new_customer_matpass: {
    template: '¡Bienvenido a MATMAX, {{userName}}! Tu MatPass está listo',
    placeholders: ['userName'],
    maxLength: 60
  },
  new_customer_matpass_booking: {
    template: '¡Bienvenido {{userName}}! Tu MatPass y reserva están listos',
    placeholders: ['userName'],
    maxLength: 60
  },
  new_customer_matpass_products: {
    template: '¡Bienvenido {{userName}}! Tu MatPass y productos están listos',
    placeholders: ['userName'],
    maxLength: 60
  },
  new_customer_complete: {
    template: '¡Bienvenido {{userName}}! Tu pedido completo está listo',
    placeholders: ['userName'],
    maxLength: 60
  },

  // EXISTING CUSTOMER SUBJECTS
  existing_customer_matpass: {
    template: 'MatPass Renovado - {{userName}} ({{matpassSessions}} sesiones)',
    placeholders: ['userName', 'matpassSessions'],
    maxLength: 60
  },
  existing_customer_matpass_booking: {
    template: 'MatPass Renovado + Reserva - {{userName}}',
    placeholders: ['userName'],
    maxLength: 60
  },
  existing_customer_matpass_products: {
    template: 'MatPass Renovado + Productos - {{userName}}',
    placeholders: ['userName'],
    maxLength: 60
  },
  existing_customer_complete: {
    template: 'Pedido Completo Renovado - {{userName}}',
    placeholders: ['userName'],
    maxLength: 60
  },

  // CONTACT FORM SUBJECTS
  contact_form_admin: {
    template: 'Nuevo mensaje de contacto de {{customerName}} - MatMax Yoga',
    placeholders: ['customerName'],
    maxLength: 60
  },
  contact_form_confirmation: {
    template: 'Gracias por contactarnos - MatMax Yoga',
    placeholders: [],
    maxLength: 60
  },
  order_confirmation: {
    template: 'Confirmación de Pedido - {{orderNumber}}',
    placeholders: ['orderNumber'],
    maxLength: 60
  },
  order_admin_notification: {
    template: 'Nuevo Pedido - {{orderNumber}} - {{customerName}}',
    placeholders: ['orderNumber', 'customerName'],
    maxLength: 60
  },

  // FALLBACK SUBJECTS
  generic: {
    template: 'Confirmación de Pedido - {{orderNumber}}',
    placeholders: ['orderNumber'],
    maxLength: 60
  }
};
