/**
 * 🧩 Component Engine
 * 
 * Manages reusable email components and their assembly
 */

import { OrderData, ComponentConfig, Condition } from './types';

export class ComponentEngine {
  private components: Map<string, ComponentConfig> = new Map();

  constructor(components: ComponentConfig[]) {
    components.forEach(component => {
      this.components.set(component.id, component);
    });
  }

  /**
   * Get components that match the order data
   */
  getMatchingComponents(orderData: OrderData, componentIds: string[]): ComponentConfig[] {
    const matchingComponents: ComponentConfig[] = [];

    for (const componentId of componentIds) {
      const component = this.components.get(componentId);
      if (!component) {
        console.warn(`⚠️ Component not found: ${componentId}`);
        continue;
      }

      if (this.validateComponentConditions(component, orderData)) {
        matchingComponents.push(component);
        console.log(`✅ Component included: ${component.name}`);
      } else {
        console.log(`❌ Component excluded: ${component.name} (conditions not met)`);
      }
    }

    // Sort by order
    return matchingComponents.sort((a, b) => a.order - b.order);
  }

  /**
   * Validate component conditions
   */
  private validateComponentConditions(component: ComponentConfig, orderData: OrderData): boolean {
    if (component.conditions.length === 0) return true;

    return component.conditions.every(condition => 
      this.evaluateCondition(condition, orderData)
    );
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
   * Process component template with data
   */
  processComponent(component: ComponentConfig, orderData: OrderData): string {
    let processedTemplate = component.template;

    // Replace placeholders with data
    for (const [placeholder, mapping] of Object.entries(component.dataMapping)) {
      let value: string;
      
      if (typeof mapping === 'function') {
        value = mapping(orderData);
      } else {
        value = this.getFieldValue(orderData, mapping) || '';
      }

      // Format the value based on placeholder type
      value = this.formatValue(placeholder, value, orderData);
      
      processedTemplate = processedTemplate.replace(
        new RegExp(`{{${placeholder}}}`, 'g'),
        value
      );
    }

    return processedTemplate;
  }

  /**
   * Format value based on placeholder type
   */
  private formatValue(placeholder: string, value: any, orderData: OrderData): string {
    // Currency formatting
    if (placeholder.includes('Price') || placeholder.includes('Amount') || placeholder.includes('Total')) {
      const currency = this.getCurrencySymbol(orderData.currency);
      return `${currency} ${Number(value).toFixed(2)}`;
    }

    // Date formatting
    if (placeholder.includes('Date')) {
      if (value instanceof Date) {
        return value.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      if (typeof value === 'string' && value) {
        return new Date(value).toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    }

    // Default formatting
    return String(value || '');
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
}
