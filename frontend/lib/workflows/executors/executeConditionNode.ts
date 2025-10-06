import { WorkflowNode, ExecutionContext } from '../types';

export interface ConditionData {
  conditions: Array<{
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
    value: any;
    logic: 'AND' | 'OR';
  }>;
}

export async function executeConditionNode(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<any> {
  const nodeData = node.data as ConditionData;

  try {
    // Get input data from context
    const inputData = context.variables;

    // Evaluate conditions
    const result = evaluateConditions(nodeData.conditions, inputData);

    // Emit execution event for debugging
    context.emit('node:success', {
      nodeId: node.id,
      result,
      conditions: nodeData.conditions.length,
      inputData,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      result,
      inputData,
      conditions: nodeData.conditions.length
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

function evaluateConditions(
  conditions: ConditionData['conditions'],
  data: Record<string, any>
): boolean {
  if (!conditions || conditions.length === 0) {
    return true;
  }

  let result = true;

  for (let i = 0; i < conditions.length; i++) {
    const condition = conditions[i];
    const fieldValue = getNestedValue(data, condition.field);
    const conditionResult = evaluateCondition(condition, fieldValue);

    if (i === 0) {
      result = conditionResult;
    } else {
      // Apply logic operator
      if (condition.logic === 'AND') {
        result = result && conditionResult;
      } else if (condition.logic === 'OR') {
        result = result || conditionResult;
      }
    }
  }

  return result;
}

function evaluateCondition(
  condition: ConditionData['conditions'][0],
  fieldValue: any
): boolean {
  const { operator, value } = condition;

  switch (operator) {
    case 'equals':
      return fieldValue === value;

    case 'not_equals':
      return fieldValue !== value;

    case 'contains':
      if (typeof fieldValue === 'string' && typeof value === 'string') {
        return fieldValue.toLowerCase().includes(value.toLowerCase());
      }
      return false;

    case 'not_contains':
      if (typeof fieldValue === 'string' && typeof value === 'string') {
        return !fieldValue.toLowerCase().includes(value.toLowerCase());
      }
      return true;

    case 'greater_than':
      return Number(fieldValue) > Number(value);

    case 'less_than':
      return Number(fieldValue) < Number(value);

    case 'is_empty':
      return fieldValue === null || fieldValue === undefined ||
             (typeof fieldValue === 'string' && fieldValue.trim() === '') ||
             (Array.isArray(fieldValue) && fieldValue.length === 0);

    case 'is_not_empty':
      return fieldValue !== null && fieldValue !== undefined &&
             (typeof fieldValue !== 'string' || fieldValue.trim() !== '') &&
             (!Array.isArray(fieldValue) || fieldValue.length > 0);

    default:
      return false;
  }
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}
