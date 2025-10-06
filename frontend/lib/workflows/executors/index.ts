// Export all node executors
export { executeEmailNode } from './executeEmailNode';
export { executeConditionNode } from './executeConditionNode';
export { executeDelayNode } from './executeDelayNode';

// Placeholder exports for future executors
// export { executeSmsNode } from './executeSmsNode';
// export { executeTelegramNode } from './executeTelegramNode';
// export { executeWhatsappNode } from './executeWhatsappNode';
// export { executeInstagramNode } from './executeInstagramNode';
// export { executeApiNode } from './executeApiNode';
// export { executeWebhookNode } from './executeWebhookNode';
// export { executeDatabaseNode } from './executeDatabaseNode';
// export { executeNotificationNode } from './executeNotificationNode';

// Map of node types to their executor functions
import { NodeType } from '../nodes/registry';
import { executeEmailNode } from './executeEmailNode';
import { executeConditionNode } from './executeConditionNode';
import { executeDelayNode } from './executeDelayNode';

export const executors: Partial<Record<NodeType, Function>> = {
  email: executeEmailNode,
  condition: executeConditionNode,
  delay: executeDelayNode,
  // sms: executeSmsNode,
  // telegram: executeTelegramNode,
  // whatsapp: executeWhatsappNode,
  // instagram: executeInstagramNode,
  // api: executeApiNode,
  // webhook: executeWebhookNode,
  // database: executeDatabaseNode,
  // notification: executeNotificationNode,
};
