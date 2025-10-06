const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  console.log('🔍 Checking data integrity...');

  // Check scenarios
  const scenarios = await prisma.emailScenario.findMany({
    include: {
      components: {
        include: {
          component: true
        }
      },
      subjectTemplate: true
    }
  });

  console.log(`📋 Found ${scenarios.length} scenarios`);

  // Check for any scenarios with undefined components
  let invalidCount = 0;
  scenarios.forEach((scenario, index) => {
    if (!scenario.id || !scenario.name) {
      console.log(`⚠️  Scenario ${index} has missing id/name`);
      invalidCount++;
    }

    scenario.components.forEach((comp, compIndex) => {
      if (!comp.component) {
        console.log(`⚠️  Scenario ${scenario.id} component ${compIndex} has null component`);
        invalidCount++;
      } else if (!comp.component.id || !comp.component.name) {
        console.log(`⚠️  Scenario ${scenario.id} component ${comp.component.id} has missing properties`);
        invalidCount++;
      }
    });
  });

  if (invalidCount === 0) {
    console.log('✅ All scenario data is valid');
  } else {
    console.log(`⚠️  Found ${invalidCount} invalid data points`);
  }

  prisma.$disconnect();
}

checkData();
