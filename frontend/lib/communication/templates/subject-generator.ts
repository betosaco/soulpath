/**
 * 📝 Dynamic Subject Generator
 * 
 * Creates personalized email subjects based on order data and templates
 */

import { OrderData, SubjectTemplate, Condition } from './types';

export class SubjectGenerator {
  private subjectTemplates: Map<string, SubjectTemplate> = new Map();

  constructor(subjectTemplates: { [key: string]: SubjectTemplate }) {
    Object.entries(subjectTemplates).forEach(([key, template]) => {
      this.subjectTemplates.set(key, template);
    });
  }

  /**
   * Generate subject for a scenario
   */
  generateSubject(scenarioId: string, orderData: OrderData): string {
    const template = this.subjectTemplates.get(scenarioId);
    if (!template) {
      console.warn(`⚠️ Subject template not found for scenario: ${scenarioId}`);
      return this.getFallbackSubject(orderData);
    }

    // Check conditions if any
    if (template.conditions && !this.validateConditions(template.conditions, orderData)) {
      console.log(`❌ Subject conditions not met for scenario: ${scenarioId}`);
      return this.getFallbackSubject(orderData);
    }

    let subject = template.template;

    // Replace placeholders
    for (const placeholder of template.placeholders) {
      const value = this.getPlaceholderValue(placeholder, orderData);
      subject = subject.replace(new RegExp(`{{${placeholder}}}`, 'g'), value);
    }

    // Apply length limit if specified
    if (template.maxLength && subject.length > template.maxLength) {
      subject = subject.substring(0, template.maxLength - 3) + '...';
    }

    console.log(`📝 Generated subject: "${subject}"`);
    return subject;
  }

  /**
   * Get placeholder value from order data
   */
  private getPlaceholderValue(placeholder: string, orderData: OrderData): string {
    switch (placeholder) {
      case 'userName':
        return orderData.customerName;
      case 'userEmail':
        return orderData.customerEmail;
      case 'orderNumber':
        return orderData.orderNumber;
      case 'orderDate':
        return this.formatDate(orderData.orderDate);
      case 'orderTotal':
        return this.formatCurrency(orderData.totalAmount, orderData.currency);
      case 'matpassType':
        return orderData.matpassItems?.[0]?.name || 'MATPASS';
      case 'matpassSessions':
        return String(orderData.matpassItems?.[0]?.sessions || 0);
      case 'bookingCount':
        return String(orderData.bookings?.length || 0);
      case 'productCount':
        return String(orderData.products?.length || 0);
      case 'isNewCustomer':
        return orderData.isNewCustomer ? 'Nuevo' : 'Existente';
      case 'customerType':
        return orderData.isNewCustomer ? 'Nuevo Cliente' : 'Cliente Existente';
      default:
        console.warn(`⚠️ Unknown placeholder: ${placeholder}`);
        return '';
    }
  }

  /**
   * Format date for display
   */
  private formatDate(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  /**
   * Format currency for display
   */
  private formatCurrency(amount: number, currency: string): string {
    const currencySymbol = this.getCurrencySymbol(currency);
    return `${currencySymbol} ${amount.toFixed(2)}`;
  }

  /**
   * Get currency symbol
   */
  private getCurrencySymbol(currency: string): string {
    const currencyMap: { [key: string]: string } = {
      'PEN': 'S/.',
      'USD': '$',
      'EUR': '€'
    };
    return currencyMap[currency] || currency;
  }

  /**
   * Validate conditions
   */
  private validateConditions(conditions: Condition[], orderData: OrderData): boolean {
    return conditions.every(condition => this.evaluateCondition(condition, orderData));
  }

  /**
   * Evaluate a single condition
   */
  private evaluateCondition(condition: Condition, orderData: OrderData): boolean {
    const fieldValue = this.getFieldValue(orderData, condition.field);
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'not_equals':
        return fieldValue !== condition.value;
      case 'greater_than':
        return Number(fieldValue) > Number(condition.value);
      case 'less_than':
        return Number(fieldValue) < Number(condition.value);
      case 'contains':
        return String(fieldValue).includes(String(condition.value));
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
      default:
        return false;
    }
  }

  /**
   * Get field value from order data using dot notation
   */
  private getFieldValue(orderData: OrderData, field: string): any {
    const fields = field.split('.');
    let value: any = orderData;
    
    for (const f of fields) {
      if (value && typeof value === 'object' && f in value) {
        value = value[f];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  /**
   * Get fallback subject
   */
  private getFallbackSubject(orderData: OrderData): string {
    if (orderData.isNewCustomer) {
      return `¡Bienvenido a MATMAX, ${orderData.customerName}!`;
    } else {
      return `MatPass Renovado - ${orderData.customerName}`;
    }
  }
}
