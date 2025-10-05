/**
 * 🚀 Modular Email Service
 * 
 * Main orchestrator for the modular email template system
 */

import { OrderData, EmailScenario, ComponentConfig, EmailResult, SubjectTemplate } from './types';
import { ScenarioDetector } from './scenario-detector';
import { ComponentEngine } from './component-engine';
import { SubjectGenerator } from './subject-generator';

export class ModularEmailService {
  private scenarioDetector: ScenarioDetector;
  private componentEngine: ComponentEngine;
  private subjectGenerator: SubjectGenerator;

  constructor(
    scenarios: EmailScenario[],
    components: ComponentConfig[],
    subjectTemplates: { [key: string]: SubjectTemplate }
  ) {
    this.scenarioDetector = new ScenarioDetector(scenarios);
    this.componentEngine = new ComponentEngine(components);
    this.subjectGenerator = new SubjectGenerator(subjectTemplates);
  }

  /**
   * Generate email for order data
   */
  async generateEmail(orderData: OrderData): Promise<EmailResult> {
    try {
      console.log('🚀 ModularEmailService: Starting email generation...');
      console.log('📊 Order data:', {
        customerName: orderData.customerName,
        isNewCustomer: orderData.isNewCustomer,
        hasMatpass: orderData.matpassItems?.length > 0,
        hasBookings: orderData.bookings?.length > 0,
        hasProducts: orderData.products?.length > 0
      });

      // Step 1: Detect scenario
      const scenario = this.scenarioDetector.detectScenario(orderData);
      if (!scenario) {
        throw new Error('No suitable scenario found for order');
      }

      console.log(`✅ Selected scenario: ${scenario.name}`);

      // Step 2: Get matching components
      const componentIds = scenario.components.map(c => c.id);
      const matchingComponents = this.componentEngine.getMatchingComponents(orderData, componentIds);

      if (matchingComponents.length === 0) {
        throw new Error('No matching components found for scenario');
      }

      console.log(`✅ Selected ${matchingComponents.length} components`);

      // Step 3: Generate subject
      const subject = this.subjectGenerator.generateSubject(scenario.id, orderData);

      // Step 4: Process components
      const processedComponents = matchingComponents.map(component => {
        const processedContent = this.componentEngine.processComponent(component, orderData);
        console.log(`✅ Processed component: ${component.name}`);
        return {
          id: component.id,
          name: component.name,
          content: processedContent
        };
      });

      // Step 5: Assemble final email
      const content = this.assembleEmail(processedComponents);

      console.log('✅ Email generation completed successfully');

      return {
        success: true,
        subject,
        content,
        scenario: scenario.id,
        components: processedComponents.map(c => c.id),
      };

    } catch (error) {
      console.error('❌ Error generating email:', error);
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
   * Assemble components into final email
   */
  private assembleEmail(components: Array<{ id: string; name: string; content: string }>): string {
    const htmlParts = [
      '<!DOCTYPE html>',
      '<html>',
      '<head>',
      '    <meta charset="utf-8">',
      '    <title>MATMAX Wellness Studio</title>',
      '    <style>',
      '        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }',
      '        .container { max-width: 600px; margin: 0 auto; padding: 20px; }',
      '        .component { margin-bottom: 20px; }',
      '    </style>',
      '</head>',
      '<body>',
      '    <div class="container">'
    ];

    // Add each component
    components.forEach(component => {
      htmlParts.push(`        <div class="component" data-component="${component.id}">`);
      htmlParts.push(component.content);
      htmlParts.push('        </div>');
    });

    htmlParts.push('    </div>');
    htmlParts.push('</body>');
    htmlParts.push('</html>');

    return htmlParts.join('\n');
  }

  /**
   * Get available scenarios
   */
  getAvailableScenarios(): EmailScenario[] {
    return this.scenarioDetector['scenarios'];
  }

  /**
   * Get available components
   */
  getAvailableComponents(): ComponentConfig[] {
    return Array.from(this.componentEngine['components'].values());
  }
}
