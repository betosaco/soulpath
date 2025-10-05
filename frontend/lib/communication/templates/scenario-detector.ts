/**
 * 🎯 Scenario Detection Engine
 * 
 * Intelligently determines the best email scenario based on order data
 */

import { OrderData, EmailScenario, Condition } from './types';

export class ScenarioDetector {
  private scenarios: EmailScenario[] = [];

  constructor(scenarios: EmailScenario[]) {
    this.scenarios = scenarios.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Detect the best scenario for the given order data
   */
  detectScenario(orderData: OrderData): EmailScenario | null {
    console.log('🔍 ScenarioDetector: Analyzing order data...');
    console.log('📊 Order composition:', {
      isNewCustomer: orderData.isNewCustomer,
      hasMatpass: orderData.matpassItems?.length > 0,
      hasBookings: orderData.bookings?.length > 0,
      hasProducts: orderData.products?.length > 0,
      matpassCount: orderData.matpassItems?.length || 0,
      bookingCount: orderData.bookings?.length || 0,
      productCount: orderData.products?.length || 0
    });

    for (const scenario of this.scenarios) {
      if (!scenario.isActive) continue;

      console.log(`🔍 Checking scenario: ${scenario.id}`);

      // Check customer type match
      if (!this.matchesCustomerType(scenario, orderData)) {
        console.log(`❌ Customer type mismatch for ${scenario.id}`);
        continue;
      }

      // Check order composition match
      if (!this.matchesOrderComposition(scenario, orderData)) {
        console.log(`❌ Order composition mismatch for ${scenario.id}`);
        continue;
      }

      // Check all conditions
      if (!this.validateScenarioConditions(scenario, orderData)) {
        console.log(`❌ Conditions not met for ${scenario.id}`);
        continue;
      }

      console.log(`✅ Selected scenario: ${scenario.id} - ${scenario.name}`);
      return scenario;
    }

    console.log('❌ No matching scenario found, using fallback');
    return this.getFallbackScenario();
  }

  /**
   * Check if customer type matches scenario requirements
   */
  private matchesCustomerType(scenario: EmailScenario, orderData: OrderData): boolean {
    if (scenario.customerType === 'both') return true;
    if (scenario.customerType === 'new' && orderData.isNewCustomer) return true;
    if (scenario.customerType === 'existing' && !orderData.isNewCustomer) return true;
    return false;
  }

  /**
   * Check if order composition matches scenario requirements
   */
  private matchesOrderComposition(scenario: EmailScenario, orderData: OrderData): boolean {
    const hasMatpass = orderData.matpassItems && orderData.matpassItems.length > 0;
    const hasBookings = orderData.bookings && orderData.bookings.length > 0;
    const hasProducts = orderData.products && orderData.products.length > 0;

    // Check if scenario supports the order types present
    const orderTypes = [];
    if (hasMatpass) orderTypes.push('matpass');
    if (hasBookings) orderTypes.push('booking');
    if (hasProducts) orderTypes.push('product');

    // If no order types, it's an empty order (shouldn't happen)
    if (orderTypes.length === 0) return false;

    // Check if scenario supports all present order types
    return orderTypes.every(type => scenario.orderTypes.includes(type));
  }

  /**
   * Validate all conditions for a scenario
   */
  private validateScenarioConditions(scenario: EmailScenario, orderData: OrderData): boolean {
    // Check component conditions
    for (const component of scenario.components) {
      if (!this.validateConditions(component.conditions, orderData)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Validate a set of conditions against order data
   */
  private validateConditions(conditions: Condition[], orderData: OrderData): boolean {
    for (const condition of conditions) {
      if (!this.evaluateCondition(condition, orderData)) {
        return false;
      }
    }
    return true;
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
   * Get fallback scenario for unmatched orders
   */
  private getFallbackScenario(): EmailScenario | null {
    return this.scenarios.find(s => s.id === 'fallback_generic') || null;
  }
}
