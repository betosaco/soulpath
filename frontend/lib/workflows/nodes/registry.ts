import React from 'react';
import { Mail, MessageSquare, Smartphone, Bot, Calendar, Clock, GitBranch, Zap, Database, Settings, Users, DollarSign } from 'lucide-react';

// Node Type Definitions
export type NodeType =
  | 'trigger'
  | 'email'
  | 'sms'
  | 'telegram'
  | 'whatsapp'
  | 'instagram'
  | 'delay'
  | 'condition'
  | 'api'
  | 'webhook'
  | 'database'
  | 'notification';

// Node Category Definitions
export type NodeCategory =
  | 'trigger'
  | 'communication'
  | 'logic'
  | 'integration'
  | 'data'
  | 'utility';

// Port Definitions
export interface NodePort {
  id: string;
  label: string;
  type: 'input' | 'output';
  dataType: string;
  required?: boolean;
  description?: string;
}

export interface NodeSchema {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: NodeCategory;
  color: string;
  defaultData: Record<string, any>;
  ports: {
    inputs: NodePort[];
    outputs: NodePort[];
  };
  propertiesComponent?: React.ComponentType<any>;
  validationSchema?: any; // Zod schema for validation
  executionSchema?: any; // Zod schema for execution
}

// Node Registry - Declarative Configuration
export const NodeRegistry: Record<NodeType, NodeSchema> = {
  trigger: {
    type: 'trigger',
    label: 'Workflow Trigger',
    description: 'Starts the workflow execution',
    icon: Zap,
    category: 'trigger',
    color: '#6366f1',
    defaultData: {
      event: 'manual',
      conditions: []
    },
    ports: {
      inputs: [],
      outputs: [
        {
          id: 'output',
          label: 'Trigger Output',
          type: 'output',
          dataType: 'object',
          description: 'Initial workflow data'
        }
      ]
    }
  },

  email: {
    type: 'email',
    label: 'Send Email',
    description: 'Send an email message',
    icon: Mail,
    category: 'communication',
    color: '#3b82f6',
    defaultData: {
      templateId: '',
      recipientType: 'dynamic',
      recipients: [],
      subject: '',
      content: '',
      attachments: []
    },
    ports: {
      inputs: [
        {
          id: 'input',
          label: 'Input Data',
          type: 'input',
          dataType: 'object',
          description: 'Data for email template'
        }
      ],
      outputs: [
        {
          id: 'success',
          label: 'Success',
          type: 'output',
          dataType: 'object',
          description: 'Email sent successfully'
        },
        {
          id: 'error',
          label: 'Error',
          type: 'output',
          dataType: 'object',
          description: 'Email sending failed'
        }
      ]
    }
  },

  sms: {
    type: 'sms',
    label: 'Send SMS',
    description: 'Send an SMS message',
    icon: Smartphone,
    category: 'communication',
    color: '#10b981',
    defaultData: {
      templateId: '',
      recipientType: 'dynamic',
      recipients: [],
      message: '',
      senderName: ''
    },
    ports: {
      inputs: [
        {
          id: 'input',
          label: 'Input Data',
          type: 'input',
          dataType: 'object',
          description: 'Data for SMS template'
        }
      ],
      outputs: [
        {
          id: 'success',
          label: 'Success',
          type: 'output',
          dataType: 'object',
          description: 'SMS sent successfully'
        },
        {
          id: 'error',
          label: 'Error',
          type: 'output',
          dataType: 'object',
          description: 'SMS sending failed'
        }
      ]
    }
  },

  telegram: {
    type: 'telegram',
    label: 'Send Telegram',
    description: 'Send a Telegram message',
    icon: Bot,
    category: 'communication',
    color: '#8b5cf6',
    defaultData: {
      templateId: '',
      recipientType: 'dynamic',
      recipients: [],
      message: '',
      parseMode: 'HTML'
    },
    ports: {
      inputs: [
        {
          id: 'input',
          label: 'Input Data',
          type: 'input',
          dataType: 'object',
          description: 'Data for Telegram template'
        }
      ],
      outputs: [
        {
          id: 'success',
          label: 'Success',
          type: 'output',
          dataType: 'object',
          description: 'Telegram message sent'
        },
        {
          id: 'error',
          label: 'Error',
          type: 'output',
          dataType: 'object',
          description: 'Telegram sending failed'
        }
      ]
    }
  },

  whatsapp: {
    type: 'whatsapp',
    label: 'Send WhatsApp',
    description: 'Send a WhatsApp message',
    icon: MessageSquare,
    category: 'communication',
    color: '#22c55e',
    defaultData: {
      templateId: '',
      recipientType: 'dynamic',
      recipients: [],
      message: ''
    },
    ports: {
      inputs: [
        {
          id: 'input',
          label: 'Input Data',
          type: 'input',
          dataType: 'object',
          description: 'Data for WhatsApp template'
        }
      ],
      outputs: [
        {
          id: 'success',
          label: 'Success',
          type: 'output',
          dataType: 'object',
          description: 'WhatsApp message sent'
        },
        {
          id: 'error',
          label: 'Error',
          type: 'output',
          dataType: 'object',
          description: 'WhatsApp sending failed'
        }
      ]
    }
  },

  instagram: {
    type: 'instagram',
    label: 'Send Instagram',
    description: 'Send an Instagram message',
    icon: MessageSquare,
    category: 'communication',
    color: '#ec4899',
    defaultData: {
      templateId: '',
      recipientType: 'dynamic',
      recipients: [],
      message: ''
    },
    ports: {
      inputs: [
        {
          id: 'input',
          label: 'Input Data',
          type: 'input',
          dataType: 'object',
          description: 'Data for Instagram template'
        }
      ],
      outputs: [
        {
          id: 'success',
          label: 'Success',
          type: 'output',
          dataType: 'object',
          description: 'Instagram message sent'
        },
        {
          id: 'error',
          label: 'Error',
          type: 'output',
          dataType: 'object',
          description: 'Instagram sending failed'
        }
      ]
    }
  },

  delay: {
    type: 'delay',
    label: 'Delay',
    description: 'Wait for a specified amount of time',
    icon: Clock,
    category: 'utility',
    color: '#f59e0b',
    defaultData: {
      duration: 60,
      unit: 'seconds'
    },
    ports: {
      inputs: [
        {
          id: 'input',
          label: 'Input',
          type: 'input',
          dataType: 'any',
          description: 'Any data to pass through'
        }
      ],
      outputs: [
        {
          id: 'output',
          label: 'Output',
          type: 'output',
          dataType: 'any',
          description: 'Data after delay'
        }
      ]
    }
  },

  condition: {
    type: 'condition',
    label: 'Condition',
    description: 'Branch workflow based on conditions',
    icon: GitBranch,
    category: 'logic',
    color: '#ef4444',
    defaultData: {
      conditions: [
        {
          field: '',
          operator: 'equals',
          value: '',
          logic: 'AND'
        }
      ]
    },
    ports: {
      inputs: [
        {
          id: 'input',
          label: 'Input Data',
          type: 'input',
          dataType: 'object',
          description: 'Data to evaluate conditions against'
        }
      ],
      outputs: [
        {
          id: 'true',
          label: 'True',
          type: 'output',
          dataType: 'object',
          description: 'Condition is true'
        },
        {
          id: 'false',
          label: 'False',
          type: 'output',
          dataType: 'object',
          description: 'Condition is false'
        }
      ]
    }
  },

  api: {
    type: 'api',
    label: 'API Call',
    description: 'Make an HTTP API call',
    icon: Zap,
    category: 'integration',
    color: '#06b6d4',
    defaultData: {
      method: 'GET',
      url: '',
      headers: {},
      body: '',
      timeout: 30000
    },
    ports: {
      inputs: [
        {
          id: 'input',
          label: 'Input Data',
          type: 'input',
          dataType: 'object',
          description: 'Data for API call'
        }
      ],
      outputs: [
        {
          id: 'success',
          label: 'Success',
          type: 'output',
          dataType: 'object',
          description: 'API call succeeded'
        },
        {
          id: 'error',
          label: 'Error',
          type: 'output',
          dataType: 'object',
          description: 'API call failed'
        }
      ]
    }
  },

  webhook: {
    type: 'webhook',
    label: 'Webhook',
    description: 'Send data to a webhook URL',
    icon: Zap,
    category: 'integration',
    color: '#8b5cf6',
    defaultData: {
      url: '',
      method: 'POST',
      headers: {},
      retryCount: 3
    },
    ports: {
      inputs: [
        {
          id: 'input',
          label: 'Webhook Data',
          type: 'input',
          dataType: 'object',
          description: 'Data to send to webhook'
        }
      ],
      outputs: [
        {
          id: 'success',
          label: 'Success',
          type: 'output',
          dataType: 'object',
          description: 'Webhook sent successfully'
        },
        {
          id: 'error',
          label: 'Error',
          type: 'output',
          dataType: 'object',
          description: 'Webhook failed'
        }
      ]
    }
  },

  database: {
    type: 'database',
    label: 'Database Query',
    description: 'Execute a database query',
    icon: Database,
    category: 'data',
    color: '#64748b',
    defaultData: {
      operation: 'query',
      table: '',
      conditions: {},
      fields: []
    },
    ports: {
      inputs: [
        {
          id: 'input',
          label: 'Query Parameters',
          type: 'input',
          dataType: 'object',
          description: 'Parameters for database operation'
        }
      ],
      outputs: [
        {
          id: 'success',
          label: 'Results',
          type: 'output',
          dataType: 'array',
          description: 'Query results'
        },
        {
          id: 'error',
          label: 'Error',
          type: 'output',
          dataType: 'object',
          description: 'Query failed'
        }
      ]
    }
  },

  notification: {
    type: 'notification',
    label: 'Admin Notification',
    description: 'Send notification to administrators',
    icon: Users,
    category: 'communication',
    color: '#f97316',
    defaultData: {
      type: 'email',
      priority: 'normal',
      title: '',
      message: ''
    },
    ports: {
      inputs: [
        {
          id: 'input',
          label: 'Notification Data',
          type: 'input',
          dataType: 'object',
          description: 'Data for admin notification'
        }
      ],
      outputs: [
        {
          id: 'sent',
          label: 'Sent',
          type: 'output',
          dataType: 'object',
          description: 'Notification sent to admins'
        }
      ]
    }
  }
};

// Utility functions for working with the registry
export function getNodeByType(type: NodeType): NodeSchema {
  return NodeRegistry[type];
}

export function getNodesByCategory(category: NodeCategory): NodeSchema[] {
  return Object.values(NodeRegistry).filter(node => node.category === category);
}

export function getAllNodes(): NodeSchema[] {
  return Object.values(NodeRegistry);
}

export function getCategories(): { id: NodeCategory; label: string; color: string; count: number }[] {
  const categories = Object.values(NodeRegistry).reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = 0;
    }
    acc[node.category]++;
    return acc;
  }, {} as Record<NodeCategory, number>);

  const categoryLabels: Record<NodeCategory, string> = {
    trigger: 'Triggers',
    communication: 'Communication',
    logic: 'Logic & Flow',
    integration: 'Integrations',
    data: 'Data & Storage',
    utility: 'Utilities'
  };

  const categoryColors: Record<NodeCategory, string> = {
    trigger: '#6366f1',
    communication: '#3b82f6',
    logic: '#ef4444',
    integration: '#06b6d4',
    data: '#64748b',
    utility: '#f59e0b'
  };

  return Object.entries(categories).map(([category, count]) => ({
    id: category as NodeCategory,
    label: categoryLabels[category as NodeCategory],
    color: categoryColors[category as NodeCategory],
    count
  }));
}
