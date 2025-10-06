/**
 * 📧 Email Template Database Seeding Script
 *
 * Migrates the existing modular template system from TypeScript configuration files
 * to the database-driven architecture.
 *
 * This script populates:
 * - EmailScenario: Scenario definitions with rules and priorities
 * - EmailComponent: Reusable template components
 * - EmailSubjectTemplate: Dynamic subject line templates
 */

import { PrismaClient } from '@prisma/client';
import { EMAIL_SCENARIOS } from '../../lib/communication/templates/config/scenarios';
import { EMAIL_COMPONENTS } from '../../lib/communication/templates/config/components';
import { SUBJECT_TEMPLATES } from '../../lib/communication/templates/config/subjects';

const prisma = new PrismaClient();

export async function seedEmailTemplates() {
  console.log('🌱 Seeding email templates...');

  try {
    // Step 1: Seed Email Components
    console.log('📝 Seeding email components...');
    for (const component of EMAIL_COMPONENTS) {
      // Convert dataMapping to handle functions
      const serializableDataMapping = {};
      for (const [key, value] of Object.entries(component.dataMapping)) {
        if (typeof value === 'function') {
          // Convert function to string representation
          serializableDataMapping[key] = value.toString();
        } else {
          serializableDataMapping[key] = value;
        }
      }

      await prisma.emailComponent.upsert({
        where: { componentKey: component.id },
        update: {
          name: component.name,
          type: component.type,
          template: component.template,
          conditions: component.conditions,
          dataMapping: serializableDataMapping,
          required: component.required,
          isActive: true,
          updatedAt: new Date(),
        },
        create: {
          componentKey: component.id,
          name: component.name,
          type: component.type,
          template: component.template,
          conditions: component.conditions,
          dataMapping: serializableDataMapping,
          required: component.required,
          isActive: true,
        },
      });
    }
    console.log(`✅ Seeded ${EMAIL_COMPONENTS.length} email components`);

    // Step 2: Seed Subject Templates
    console.log('📧 Seeding subject templates...');
    for (const [key, subject] of Object.entries(SUBJECT_TEMPLATES)) {
      await prisma.emailSubjectTemplate.upsert({
        where: { templateKey: key },
        update: {
          template: subject.template,
          placeholders: subject.placeholders,
          maxLength: subject.maxLength,
          isActive: true,
          updatedAt: new Date(),
        },
        create: {
          templateKey: key,
          template: subject.template,
          placeholders: subject.placeholders,
          maxLength: subject.maxLength,
          isActive: true,
        },
      });
    }
    console.log(`✅ Seeded ${Object.keys(SUBJECT_TEMPLATES).length} subject templates`);

    // Step 3: Seed Email Scenarios (with component relationships)
    console.log('🎭 Seeding email scenarios...');
    for (const scenario of EMAIL_SCENARIOS) {
      // First, find the subject template ID
      let subjectTemplateId = null;
      if (scenario.subjectTemplate) {
        const subjectTemplate = await prisma.emailSubjectTemplate.findUnique({
          where: { templateKey: scenario.subjectTemplate },
        });
        subjectTemplateId = subjectTemplate?.id || null;
      }

      // Create or update the scenario
      const dbScenario = await prisma.emailScenario.upsert({
        where: { scenarioKey: scenario.id },
        update: {
          name: scenario.name,
          description: scenario.description,
          customerType: scenario.customerType,
          orderTypes: scenario.orderTypes,
          priority: scenario.priority,
          isActive: scenario.isActive,
          subjectTemplateId,
          updatedAt: new Date(),
        },
        create: {
          scenarioKey: scenario.id,
          name: scenario.name,
          description: scenario.description,
          customerType: scenario.customerType,
          orderTypes: scenario.orderTypes,
          priority: scenario.priority,
          isActive: scenario.isActive,
          subjectTemplateId,
        },
      });

      // Step 4: Seed Scenario-Component Relationships
      console.log(`🔗 Seeding components for scenario: ${scenario.id}`);
      for (const component of scenario.components) {
        // Find the component in the database
        const dbComponent = await prisma.emailComponent.findUnique({
          where: { componentKey: component.id },
        });

        if (dbComponent) {
          await prisma.emailScenarioComponent.upsert({
            where: {
              scenarioId_componentId: {
                scenarioId: dbScenario.id,
                componentId: dbComponent.id,
              },
            },
            update: {
              order: component.order,
            },
            create: {
              scenarioId: dbScenario.id,
              componentId: dbComponent.id,
              order: component.order,
            },
          });
        } else {
          console.warn(`⚠️  Component ${component.id} not found in database`);
        }
      }
    }
    console.log(`✅ Seeded ${EMAIL_SCENARIOS.length} email scenarios`);

    console.log('🎉 Email template seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding email templates:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedEmailTemplates()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}
