import { CommunicationService } from '@/lib/services/communication-service';
import { RecipientService } from '@/lib/services/recipient-service';
import { WorkflowNode, ExecutionContext } from '../types';

export interface EmailNodeData {
  templateId?: string;
  recipientType: 'dynamic' | 'static';
  recipients: string[];
  subject?: string;
  content: string;
  attachments?: string[];
}

export async function executeEmailNode(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<any> {
  const nodeData = node.data as EmailNodeData;

  try {
    // Initialize services
    const communicationService = new CommunicationService();
    const recipientService = new RecipientService();

    // Resolve recipients
    let recipients: string[] = [];
    if (nodeData.recipientType === 'dynamic') {
      // Use RecipientService to resolve dynamic recipients
      recipients = await recipientService.resolveRecipients(
        nodeData.recipients,
        context.variables
      );
    } else {
      recipients = nodeData.recipients;
    }

    if (recipients.length === 0) {
      throw new Error('No recipients found for email node');
    }

    // Prepare email data
    const emailData = {
      to: recipients,
      subject: nodeData.subject || '',
      content: nodeData.content,
      templateId: nodeData.templateId,
      attachments: nodeData.attachments || []
    };

    // Send email using CommunicationService
    const result = await communicationService.sendEmail(emailData);

    // Emit execution event for debugging
    context.emit('node:success', {
      nodeId: node.id,
      output: result,
      recipients: recipients.length,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      recipients: recipients.length,
      result,
      ...result
    };

  } catch (error) {
    // Emit error event for debugging
    context.emit('node:error', {
      nodeId: node.id,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });

    throw error;
  }
}
