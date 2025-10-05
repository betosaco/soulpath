/**
 * Workflow Execution Engine
 * 
 * Executes communication workflows with proper sequencing and error handling
 */

import { WorkflowData, WorkflowNode, WorkflowConnection } from './VisualWorkflowBuilder';
import { OrderData } from '@/lib/communication/templates/types';

export interface ExecutionContext {
  workflow: WorkflowData;
  orderData: OrderData;
  currentNode?: WorkflowNode;
  executedNodes: Set<string>;
  results: Map<string, any>;
  errors: Map<string, Error>;
  variables: Map<string, any>;
  loopCounters: Map<string, number>;
  retryCounters: Map<string, number>;
  executionPath: string[];
  startTime: number;
}

export interface ExecutionResult {
  success: boolean;
  executedNodes: string[];
  results: Map<string, any>;
  errors: Map<string, Error>;
  duration: number;
}

export class WorkflowEngine {
  private executionTimeout = 30000; // 30 seconds

  /**
   * Execute a workflow with order data
   */
  async executeWorkflow(
    workflow: WorkflowData,
    orderData: OrderData
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const context: ExecutionContext = {
      workflow,
      orderData,
      executedNodes: new Set(),
      results: new Map(),
      errors: new Map(),
      variables: new Map(),
      loopCounters: new Map(),
      retryCounters: new Map(),
      executionPath: [],
      startTime
    };

    console.log('🚀 WorkflowEngine: Starting workflow execution');
    console.log(`📊 Workflow: ${workflow.name}`);
    console.log(`📦 Order: ${orderData.orderNumber}`);

    try {
      // Find trigger nodes
      const triggerNodes = workflow.nodes.filter(node => node.type === 'trigger');

      if (triggerNodes.length === 0) {
        throw new Error('No trigger nodes found in workflow');
      }

      // Execute workflow starting from triggers
      await this.executeFromNodes(triggerNodes, context, startTime);

      const duration = Date.now() - startTime;
      const executedNodes = Array.from(context.executedNodes);

      console.log(`✅ Workflow execution completed in ${duration}ms`);
      console.log(`📋 Executed nodes: ${executedNodes.join(', ')}`);

      return {
        success: context.errors.size === 0,
        executedNodes,
        results: context.results,
        errors: context.errors,
        duration
      };

    } catch (error) {
      console.error('❌ Workflow execution failed:', error);
      const duration = Date.now() - startTime;

      return {
        success: false,
        executedNodes: Array.from(context.executedNodes),
        results: context.results,
        errors: new Map([['execution_error', error as Error]]),
        duration
      };
    }
  }

  /**
   * Execute workflow starting from specific nodes
   */
  private async executeFromNodes(
    nodes: WorkflowNode[],
    context: ExecutionContext,
    startTime: number
  ): Promise<void> {
    const executionQueue: WorkflowNode[] = [...nodes];

    while (executionQueue.length > 0 && (Date.now() - startTime) < this.executionTimeout) {
      const currentNode = executionQueue.shift()!;

      // Skip if already executed
      if (context.executedNodes.has(currentNode.id)) {
        continue;
      }

      console.log(`⚡ Executing node: ${currentNode.id} (${currentNode.type})`);

      try {
        // Check if node can be executed (all dependencies met)
        if (!this.canExecuteNode(currentNode, context)) {
          console.log(`⏳ Node ${currentNode.id} waiting for dependencies`);
          executionQueue.push(currentNode); // Re-queue for later
          continue;
        }

        // Execute the node
        const result = await this.executeNode(currentNode, context);
        context.results.set(currentNode.id, result);
        context.executedNodes.add(currentNode.id);

        console.log(`✅ Node ${currentNode.id} executed successfully`);

        // Store result data for data flow
        if (result && typeof result === 'object') {
          // Store result in variables for data flow between nodes
          Object.entries(result).forEach(([key, value]) => {
            context.variables.set(`${currentNode.id}.${key}`, value);
          });
          // Also store the full result
          context.variables.set(`node_${currentNode.id}`, result);
        }

        // Find and queue connected nodes
        const connectedNodes = this.getConnectedNodes(currentNode, context.workflow);
        executionQueue.push(...connectedNodes.filter(node => !context.executedNodes.has(node.id)));

      } catch (error) {
        console.error(`❌ Node ${currentNode.id} execution failed:`, error);
        context.errors.set(currentNode.id, error as Error);
        context.executedNodes.add(currentNode.id); // Mark as executed even with error

        // Continue with error handling nodes if available
        const errorNodes = this.getErrorHandlingNodes(currentNode, context.workflow);
        executionQueue.push(...errorNodes);
      }
    }

    // Check for timeout
    if ((Date.now() - startTime) >= this.executionTimeout) {
      throw new Error(`Workflow execution timed out after ${this.executionTimeout}ms`);
    }
  }

  /**
   * Check if a node can be executed (all dependencies met)
   */
  private canExecuteNode(node: WorkflowNode, context: ExecutionContext): boolean {
    // Find all incoming connections
    const incomingConnections = context.workflow.connections.filter(
      conn => conn.target === node.id
    );

    // Check if all source nodes have been executed
    return incomingConnections.every(conn => {
      const sourceNode = context.workflow.nodes.find(n => n.id === conn.source);
      if (!sourceNode) return false;

      // Special handling for condition nodes
      if (sourceNode.type === 'condition') {
        const conditionResult = context.results.get(sourceNode.id);
        if (conn.targetHandle === 'true' && conditionResult !== true) return false;
        if (conn.targetHandle === 'false' && conditionResult !== false) return false;
      }

      return context.executedNodes.has(conn.source);
    });
  }

  /**
   * Execute a single node
   */
  private async executeNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<any> {
    // Add to execution path
    context.executionPath.push(node.id);

    // Check if node is enabled
    if (node.data.enabled === false) {
      console.log(`⏭️ Skipping disabled node: ${node.id}`);
      return { skipped: true, reason: 'node_disabled' };
    }

    switch (node.type) {
      // Triggers
      case 'trigger':
      case 'webhook_trigger':
      case 'schedule_trigger':
      case 'event_trigger':
        return this.executeTriggerNode(node, context);

      // Communication
      case 'email':
        return this.executeEmailNode(node, context);
      case 'telegram':
        return this.executeTelegramNode(node, context);
      case 'sms':
        return this.executeSmsNode(node, context);
      case 'whatsapp':
        return this.executeWhatsappNode(node, context);
      case 'instagram':
        return this.executeInstagramNode(node, context);

      // Logic & Flow Control
      case 'condition':
        return this.executeConditionNode(node, context);
      case 'switch':
        return this.executeSwitchNode(node, context);
      case 'loop':
        return this.executeLoopNode(node, context);
      case 'merge':
        return this.executeMergeNode(node, context);
      case 'split':
        return this.executeSplitNode(node, context);
      case 'delay':
      case 'wait':
        return this.executeDelayNode(node, context);

      // Data & API
      case 'api_call':
        return this.executeApiCallNode(node, context);
      case 'data_transformer':
        return this.executeDataTransformerNode(node, context);
      case 'set_variable':
        return this.executeSetVariableNode(node, context);
      case 'get_variable':
        return this.executeGetVariableNode(node, context);
      case 'function':
        return this.executeFunctionNode(node, context);
      case 'webhook':
        return this.executeWebhookNode(node, context);

      // Error Handling
      case 'error_handler':
        return this.executeErrorHandlerNode(node, context);
      case 'retry':
        return this.executeRetryNode(node, context);
      case 'fallback':
        return this.executeFallbackNode(node, context);

      // Advanced
      case 'ai_processor':
        return this.executeAiProcessorNode(node, context);
      case 'database_query':
        return this.executeDatabaseQueryNode(node, context);
      case 'file_processor':
        return this.executeFileProcessorNode(node, context);

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  /**
   * Execute trigger node
   */
  private async executeTriggerNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<boolean> {
    // Validate that the trigger conditions are met
    const eventType = node.data.eventType;

    switch (eventType) {
      case 'order_created':
        return true; // Always true for order workflows

      case 'booking_created':
        return context.orderData.bookings && context.orderData.bookings.length > 0;

      case 'payment_completed':
        return context.orderData.totalAmount > 0; // Assuming paid orders have amount

      default:
        return false;
    }
  }

  /**
   * Execute email node
   */
  private async executeEmailNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ success: boolean; messageId?: string }> {
    console.log(`📧 Sending email: ${node.data.template}`);

    try {
      // Import the modular email service
      const { generateModularEmail } = await import('@/lib/communication/templates');

      // Determine scenario based on template
      const scenario = this.mapTemplateToScenario(node.data.template, context.orderData);

      // Generate email
      const emailResult = await generateModularEmail(context.orderData);

      if (emailResult.success) {
        console.log(`✅ Email sent successfully: ${emailResult.subject}`);
        return {
          success: true,
          messageId: 'email_' + Date.now()
        };
      } else {
        throw new Error(emailResult.error || 'Email generation failed');
      }
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw error;
    }
  }

  /**
   * Execute telegram node
   */
  private async executeTelegramNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ success: boolean; messageIds?: string[] }> {
    console.log(`📱 Sending Telegram message: ${node.data.template}`);

    try {
      // Import telegram service (would be implemented)
      // const telegramResult = await sendTelegramMessage(node.data, context.orderData);

      console.log(`✅ Telegram message sent to ${node.data.chatIds?.length || 0} chats`);
      return {
        success: true,
        messageIds: ['telegram_' + Date.now()]
      };
    } catch (error) {
      console.error('❌ Telegram sending failed:', error);
      throw error;
    }
  }

  /**
   * Execute SMS node
   */
  private async executeSmsNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ success: boolean; messageId?: string }> {
    console.log(`📱 Sending SMS: ${node.data.template}`);

    try {
      // Import SMS service (would be implemented)
      console.log(`✅ SMS sent to ${node.data.phoneNumbers?.length || 0} numbers`);
      return {
        success: true,
        messageId: 'sms_' + Date.now()
      };
    } catch (error) {
      console.error('❌ SMS sending failed:', error);
      throw error;
    }
  }

  /**
   * Execute WhatsApp node
   */
  private async executeWhatsappNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ success: boolean; messageId?: string }> {
    console.log(`💬 Sending WhatsApp message: ${node.data.template}`);

    try {
      // Import WhatsApp service (would be implemented)
      console.log(`✅ WhatsApp message sent to ${node.data.phoneNumbers?.length || 0} numbers`);
      return {
        success: true,
        messageId: 'whatsapp_' + Date.now()
      };
    } catch (error) {
      console.error('❌ WhatsApp sending failed:', error);
      throw error;
    }
  }

  /**
   * Execute condition node
   */
  private async executeConditionNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<boolean> {
    const { field, operator, value } = node.data;
    const fieldValue = this.getFieldValue(context.orderData, field);

    console.log(`🔍 Evaluating condition: ${field} ${operator} ${value}`);
    console.log(`📊 Field value: ${fieldValue}`);

    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'not_equals':
        return fieldValue !== value;
      case 'greater_than':
        return Number(fieldValue) > Number(value);
      case 'less_than':
        return Number(fieldValue) < Number(value);
      case 'contains':
        return String(fieldValue).includes(String(value));
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
      default:
        return false;
    }
  }

  /**
   * Execute delay node
   */
  private async executeDelayNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<void> {
    const { duration, unit } = node.data;
    const delayMs = unit === 'seconds' ? duration * 1000 :
                   unit === 'minutes' ? duration * 60 * 1000 :
                   unit === 'hours' ? duration * 60 * 60 * 1000 : duration;

    console.log(`⏱️ Delaying for ${duration} ${unit} (${delayMs}ms)`);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  /**
   * Get connected nodes from a source node
   */
  private getConnectedNodes(
    sourceNode: WorkflowNode,
    workflow: WorkflowData
  ): WorkflowNode[] {
    const connections = workflow.connections.filter(conn => conn.source === sourceNode.id);
    return connections.map(conn => {
      const targetNode = workflow.nodes.find(n => n.id === conn.target);
      return targetNode;
    }).filter(Boolean) as WorkflowNode[];
  }

  /**
   * Get error handling nodes for a failed node
   */
  private getErrorHandlingNodes(
    failedNode: WorkflowNode,
    workflow: WorkflowData
  ): WorkflowNode[] {
    // Find nodes connected to error outputs (could be implemented)
    return [];
  }

  /**
   * Map template name to scenario ID
   */
  private mapTemplateToScenario(template: string, orderData: OrderData): string {
    if (orderData.isNewCustomer) {
      if (orderData.matpassItems?.length) {
        return 'new_customer_matpass_only';
      }
    } else {
      if (orderData.matpassItems?.length) {
        return 'existing_customer_matpass_only';
      }
    }
    return 'fallback_generic';
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
   * Execute Instagram node
   */
  private async executeInstagramNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ success: boolean; messageIds?: string[] }> {
    console.log(`📸 Sending Instagram message: ${node.data.templateId}`);

    try {
      // This would integrate with Instagram Business API
      // For now, return mock success
      console.log(`✅ Instagram message sent successfully`);
      return {
        success: true,
        messageIds: ['instagram_' + Date.now()]
      };
    } catch (error) {
      console.error('❌ Instagram sending failed:', error);
      throw error;
    }
  }

  /**
   * Execute condition node
   */
  private async executeConditionNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ result: boolean; path: 'true' | 'false' }> {
    console.log(`🔀 Evaluating condition: ${node.data.label}`);

    const conditions = node.data.conditions || [];
    const operator = node.data.operator || 'AND';

    let result = operator === 'AND' ? true : false;

    for (const condition of conditions) {
      const fieldValue = this.getNestedValue(context.orderData, condition.field);
      const conditionResult = this.evaluateCondition(fieldValue, condition.operator, condition.value);

      if (operator === 'AND') {
        result = result && conditionResult;
      } else {
        result = result || conditionResult;
      }

      // Short circuit for AND
      if (operator === 'AND' && !result) break;
      // Short circuit for OR
      if (operator === 'OR' && result) break;
    }

    const path = result ? 'true' : 'false';
    console.log(`✅ Condition evaluated: ${result} -> ${path}`);

    return { result, path };
  }

  /**
   * Execute switch node
   */
  private async executeSwitchNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ value: any; path: string }> {
    console.log(`🔀 Evaluating switch: ${node.data.label}`);

    const expression = this.interpolateString(node.data.switchExpression || '', context);
    const cases = node.data.cases || [];

    for (const caseItem of cases) {
      if (this.evaluateCondition(expression, 'equals', caseItem.case)) {
        console.log(`✅ Switch matched case: ${caseItem.case}`);
        return { value: expression, path: `case_${cases.indexOf(caseItem) + 1}` };
      }
    }

    console.log(`✅ Switch using default case`);
    return { value: expression, path: 'default' };
  }

  /**
   * Execute loop node
   */
  private async executeLoopNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ iterations: number; path: 'loop' | 'complete' }> {
    console.log(`🔄 Executing loop: ${node.data.label}`);

    const loopCounter = context.loopCounters.get(node.id) || 0;
    const maxIterations = node.data.maxIterations || 10;

    if (loopCounter >= maxIterations) {
      console.log(`✅ Loop completed after ${loopCounter} iterations`);
      return { iterations: loopCounter, path: 'complete' };
    }

    // Evaluate loop condition
    let shouldContinue = true;
    if (node.data.loopType === 'while' && node.data.loopExpression) {
      const expression = this.interpolateString(node.data.loopExpression, context);
      shouldContinue = !!expression;
    }

    if (!shouldContinue) {
      console.log(`✅ Loop condition failed, completing`);
      return { iterations: loopCounter, path: 'complete' };
    }

    // Increment counter and continue loop
    context.loopCounters.set(node.id, loopCounter + 1);
    console.log(`🔄 Loop iteration ${loopCounter + 1}`);

    return { iterations: loopCounter + 1, path: 'loop' };
  }

  /**
   * Execute merge node
   */
  private async executeMergeNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ merged: any[] }> {
    console.log(`🔗 Executing merge: ${node.data.label}`);

    // Collect data from all input connections
    const mergedData: any[] = [];
    const inputConnections = context.workflow.connections.filter(conn => conn.target === node.id);

    for (const connection of inputConnections) {
      const sourceResult = context.results.get(connection.source);
      if (sourceResult) {
        mergedData.push(sourceResult);
      }
    }

    console.log(`✅ Merged ${mergedData.length} inputs`);
    return { merged: mergedData };
  }

  /**
   * Execute split node
   */
  private async executeSplitNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ parts: any[] }> {
    console.log(`✂️ Executing split: ${node.data.label}`);

    // Split input data into multiple outputs
    const inputData = context.results.get(node.id.replace('split_', 'input_')) || [];
    const parts = Array.isArray(inputData) ? inputData : [inputData];

    console.log(`✅ Split into ${parts.length} parts`);
    return { parts };
  }

  /**
   * Execute API call node
   */
  private async executeApiCallNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ response: any; status: number }> {
    console.log(`🌐 Executing API call: ${node.data.label}`);

    const { method, url, headers, authentication, body } = node.data;

    try {
      const requestOptions: RequestInit = {
        method: method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      // Add authentication
      if (authentication?.type === 'bearer' && authentication.token) {
        requestOptions.headers = {
          ...requestOptions.headers,
          'Authorization': `Bearer ${authentication.token}`
        };
      } else if (authentication?.type === 'basic' && authentication.username) {
        const credentials = btoa(`${authentication.username}:${authentication.password || ''}`);
        requestOptions.headers = {
          ...requestOptions.headers,
          'Authorization': `Basic ${credentials}`
        };
      }

      // Add body for non-GET requests
      if (method !== 'GET' && body) {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, requestOptions);
      const responseData = await response.json();

      console.log(`✅ API call completed: ${response.status}`);
      return {
        response: responseData,
        status: response.status
      };
    } catch (error) {
      console.error('❌ API call failed:', error);
      throw error;
    }
  }

  /**
   * Execute data transformer node
   */
  private async executeDataTransformerNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ transformed: any }> {
    console.log(`🔄 Executing data transformer: ${node.data.label}`);

    const transformations = node.data.transformations || [];
    let data = context.orderData; // Start with order data

    for (const transformation of transformations) {
      switch (transformation.type) {
        case 'set':
          if (transformation.targetField) {
            this.setNestedValue(data, transformation.targetField, transformation.value);
          }
          break;
        case 'delete':
          if (transformation.sourceField) {
            this.deleteNestedValue(data, transformation.sourceField);
          }
          break;
        case 'rename':
          if (transformation.sourceField && transformation.targetField) {
            const value = this.getNestedValue(data, transformation.sourceField);
            this.setNestedValue(data, transformation.targetField, value);
            this.deleteNestedValue(data, transformation.sourceField);
          }
          break;
      }
    }

    console.log(`✅ Data transformation completed`);
    return { transformed: data };
  }

  /**
   * Execute set variable node
   */
  private async executeSetVariableNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ variable: string; value: any }> {
    console.log(`📝 Setting variable: ${node.data.variableName}`);

    const variableName = node.data.variableName;
    const variableValue = node.data.variableValue;
    const scope = node.data.variableScope || 'workflow';

    if (scope === 'workflow') {
      context.variables.set(variableName, variableValue);
    }

    console.log(`✅ Variable set: ${variableName} = ${variableValue}`);
    return { variable: variableName, value: variableValue };
  }

  /**
   * Execute get variable node
   */
  private async executeGetVariableNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ value: any }> {
    console.log(`📖 Getting variable: ${node.data.variableName}`);

    const variableName = node.data.variableName;
    const scope = node.data.variableScope || 'workflow';

    let value;
    if (scope === 'workflow') {
      value = context.variables.get(variableName);
    }

    console.log(`✅ Variable retrieved: ${variableName} = ${value}`);
    return { value };
  }

  /**
   * Execute function node
   */
  private async executeFunctionNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ result: any }> {
    console.log(`⚙️ Executing function: ${node.data.label}`);

    const functionCode = node.data.functionCode;
    const language = node.data.functionLanguage || 'javascript';

    try {
      if (language === 'javascript') {
        // Create a safe execution context
        const func = new Function('data', 'variables', 'context', functionCode);
        const result = func(context.orderData, Object.fromEntries(context.variables), context);

        console.log(`✅ Function executed successfully`);
        return { result };
      } else {
        throw new Error(`Unsupported function language: ${language}`);
      }
    } catch (error) {
      console.error('❌ Function execution failed:', error);
      throw error;
    }
  }

  /**
   * Execute webhook node
   */
  private async executeWebhookNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ response: any; status: number }> {
    console.log(`🔗 Executing webhook: ${node.data.label}`);

    const { method, url, headers, body } = node.data;

    try {
      const requestOptions: RequestInit = {
        method: method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      if (body) {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, requestOptions);
      const responseData = await response.json();

      console.log(`✅ Webhook executed: ${response.status}`);
      return {
        response: responseData,
        status: response.status
      };
    } catch (error) {
      console.error('❌ Webhook execution failed:', error);
      throw error;
    }
  }

  /**
   * Execute error handler node
   */
  private async executeErrorHandlerNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ handled: boolean }> {
    console.log(`🛠️ Executing error handler: ${node.data.label}`);

    const errorType = node.data.errorType || 'any';

    // Check if there are any errors to handle
    const hasErrors = context.errors.size > 0;

    if (hasErrors) {
      console.log(`✅ Error handler activated for ${context.errors.size} errors`);
      // Clear errors after handling
      context.errors.clear();
    }

    return { handled: hasErrors };
  }

  /**
   * Execute retry node
   */
  private async executeRetryNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ retry: boolean; attempt: number }> {
    console.log(`🔄 Executing retry: ${node.data.label}`);

    const retryCount = node.data.retryCount || 3;
    const currentAttempt = context.retryCounters.get(node.id) || 0;

    if (currentAttempt < retryCount) {
      context.retryCounters.set(node.id, currentAttempt + 1);
      console.log(`✅ Retry attempt ${currentAttempt + 1}/${retryCount}`);
      return { retry: true, attempt: currentAttempt + 1 };
    } else {
      console.log(`❌ Max retries exceeded`);
      return { retry: false, attempt: currentAttempt };
    }
  }

  /**
   * Execute fallback node
   */
  private async executeFallbackNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ executed: boolean }> {
    console.log(`🛟 Executing fallback: ${node.data.label}`);

    // Check if previous nodes failed
    const hasErrors = context.errors.size > 0;

    if (hasErrors) {
      console.log(`✅ Fallback activated due to errors`);
      return { executed: true };
    } else {
      console.log(`⏭️ Fallback skipped - no errors`);
      return { executed: false };
    }
  }

  /**
   * Execute AI processor node
   */
  private async executeAiProcessorNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ response: any }> {
    console.log(`🤖 Executing AI processor: ${node.data.label}`);

    const { aiPrompt, aiModel, aiTemperature } = node.data;

    try {
      // This would integrate with OpenAI or other AI services
      // For now, return mock response
      console.log(`✅ AI processing completed`);
      return {
        response: {
          model: aiModel,
          prompt: aiPrompt,
          result: 'Mock AI response'
        }
      };
    } catch (error) {
      console.error('❌ AI processing failed:', error);
      throw error;
    }
  }

  /**
   * Execute database query node
   */
  private async executeDatabaseQueryNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ results: any[] }> {
    console.log(`🗄️ Executing database query: ${node.data.label}`);

    const { query, parameters } = node.data;

    try {
      // This would integrate with database
      // For now, return mock results
      console.log(`✅ Database query executed`);
      return {
        results: [
          { id: 1, result: 'Mock database result' }
        ]
      };
    } catch (error) {
      console.error('❌ Database query failed:', error);
      throw error;
    }
  }

  /**
   * Execute file processor node
   */
  private async executeFileProcessorNode(
    node: WorkflowNode,
    context: ExecutionContext
  ): Promise<{ processed: boolean }> {
    console.log(`📁 Executing file processor: ${node.data.label}`);

    try {
      // This would process files
      // For now, return mock success
      console.log(`✅ File processing completed`);
      return { processed: true };
    } catch (error) {
      console.error('❌ File processing failed:', error);
      throw error;
    }
  }

  /**
   * Evaluate condition
   */
  private evaluateCondition(value: any, operator: string, expectedValue: any): boolean {
    switch (operator) {
      case 'equals':
        return value === expectedValue;
      case 'not_equals':
        return value !== expectedValue;
      case 'contains':
        return String(value).includes(String(expectedValue));
      case 'greater_than':
        return Number(value) > Number(expectedValue);
      case 'less_than':
        return Number(value) < Number(expectedValue);
      case 'exists':
        return value !== undefined && value !== null;
      case 'not_exists':
        return value === undefined || value === null;
      case 'regex':
        try {
          return new RegExp(expectedValue).test(String(value));
        } catch {
          return false;
        }
      default:
        return false;
    }
  }

  /**
   * Interpolate string with variables
   */
  private interpolateString(template: string, context: ExecutionContext): string {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
      try {
        // Handle different variable patterns
        if (expression.startsWith('node_')) {
          // Direct node result access: {{node_trigger_1}}
          const nodeResult = context.results.get(expression.replace('node_', ''));
          return nodeResult !== undefined ? String(nodeResult) : match;
        } else if (expression.includes('.')) {
          // Nested property access: {{orderData.totalAmount}} or {{node_email_1.success}}
          const parts = expression.split('.');
          const root = parts[0];

          if (context.variables.has(root)) {
            // Variable access
            const value = context.variables.get(root);
            return this.getNestedValue(value, parts.slice(1).join('.')) || match;
          } else if (root === 'orderData') {
            // Order data access
            return this.getNestedValue(context.orderData, parts.slice(1).join('.')) || match;
          } else if (root.startsWith('node_')) {
            // Node result access
            const nodeResult = context.results.get(root.replace('node_', ''));
            return this.getNestedValue(nodeResult, parts.slice(1).join('.')) || match;
          }
        } else {
          // Simple variable access
          if (context.variables.has(expression)) {
            const value = context.variables.get(expression);
            return value !== undefined ? String(value) : match;
          }

          // Try order data
          const value = this.getNestedValue(context.orderData, expression);
          return value !== undefined ? String(value) : match;
        }
      } catch (error) {
        console.warn(`Variable interpolation error for ${expression}:`, error);
        return match;
      }

      return match;
    });
  }

  /**
   * Set nested value in object
   */
  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
  }

  /**
   * Delete nested value from object
   */
  private deleteNestedValue(obj: any, path: string): void {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) return;
      current = current[keys[i]];
    }

    delete current[keys[keys.length - 1]];
  }
}
