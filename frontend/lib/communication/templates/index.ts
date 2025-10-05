/**
 * 🚀 Modular Email Template System - Main Entry Point
 * 
 * This is the main integration point for the modular email system.
 * It provides a clean API for generating emails using the modular approach.
 */

import { OrderData, EmailResult } from './types';
import { ModularEmailService } from './modular-email-service';
import { EMAIL_SCENARIOS } from './config/scenarios';
import { EMAIL_COMPONENTS } from './config/components';
import { SUBJECT_TEMPLATES } from './config/subjects';

// Initialize the modular email service
const modularEmailService = new ModularEmailService(
  EMAIL_SCENARIOS,
  EMAIL_COMPONENTS,
  SUBJECT_TEMPLATES
);

/**
 * Generate email using the modular system
 */
export async function generateModularEmail(orderData: OrderData): Promise<EmailResult> {
  console.log('🚀 Modular Email System: Starting email generation...');
  
  try {
    const result = await modularEmailService.generateEmail(orderData);
    
    if (result.success) {
      console.log('✅ Modular email generated successfully');
      console.log(`📧 Scenario: ${result.scenario}`);
      console.log(`🧩 Components: ${result.components.join(', ')}`);
      console.log(`📝 Subject: ${result.subject}`);
    } else {
      console.error('❌ Failed to generate modular email:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error in modular email generation:', error);
    return {
      success: false,
      subject: 'Error',
      content: 'Error generating email',
      scenario: 'error',
      components: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get available scenarios
 */
export function getAvailableScenarios() {
  return modularEmailService.getAvailableScenarios();
}

/**
 * Get available components
 */
export function getAvailableComponents() {
  return modularEmailService.getAvailableComponents();
}

/**
 * Test a specific scenario
 */
export async function testScenario(scenarioId: string, orderData: OrderData): Promise<EmailResult> {
  console.log(`🧪 Testing scenario: ${scenarioId}`);
  
  // Create a test order data with the scenario requirements
  const testData = {
    ...orderData,
    // Override specific fields to match scenario
  };
  
  return await generateModularEmail(testData);
}

// Export types for external use
export * from './types';
export { ModularEmailService } from './modular-email-service';
export { ScenarioDetector } from './scenario-detector';
export { ComponentEngine } from './component-engine';
export { SubjectGenerator } from './subject-generator';
