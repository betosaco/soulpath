'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Card } from '../../ui/card';
import { BaseButton } from '../../ui/BaseButton';
import { BaseInput } from '../../ui/BaseInput';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { TelegramUserSelectorModal } from './TelegramUserSelectorModal';
import {
  Play,
  Save,
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Trash2,
  Copy,
  Settings,
  Eye,
  TestTube,
  Workflow,
  Mail,
  MessageSquare,
  Smartphone,
  Send,
  MessageCircle,
  Globe,
  Code,
  Database,
  FileText,
  Zap,
  GitBranch,
  ArrowRight,
  Clock,
  AlertTriangle,
  RefreshCw,
  Shield,
  Brain,
  Webhook,
  Users
} from 'lucide-react';
import { WorkflowCanvas } from './WorkflowCanvas';
import { WorkflowNode } from './WorkflowNode';
import { WorkflowEngine } from './WorkflowEngine';

interface VisualWorkflowBuilderProps {
  language: 'en' | 'es';
  onSave?: (workflow: WorkflowData) => void;
  onTest?: (workflow: WorkflowData) => void;
  initialWorkflow?: WorkflowData;
}

export interface WorkflowData {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  settings: WorkflowSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
  inputs: NodePort[];
  outputs: NodePort[];
  settings?: NodeSettings;
}

export type NodeType =
  // Triggers
  | 'trigger'
  | 'webhook_trigger'
  | 'schedule_trigger'
  | 'event_trigger'

  // Communication
  | 'email'
  | 'telegram'
  | 'sms'
  | 'whatsapp'
  | 'instagram'

  // Logic & Flow Control
  | 'condition'
  | 'switch'
  | 'loop'
  | 'merge'
  | 'split'
  | 'delay'
  | 'wait'

  // Data & API
  | 'api_call'
  | 'data_transformer'
  | 'set_variable'
  | 'get_variable'
  | 'function'
  | 'webhook'

  // Error Handling
  | 'error_handler'
  | 'retry'
  | 'fallback'

  // Advanced
  | 'ai_processor'
  | 'database_query'
  | 'file_processor';

export interface NodeData {
  // Common fields
  label?: string;
  description?: string;
  enabled?: boolean;

  // Trigger specific
  triggerType?: 'order_created' | 'payment_received' | 'booking_confirmed' | 'user_registered';
  scheduleExpression?: string; // cron expression
  webhookUrl?: string;

  // Communication specific
  templateId?: string;
  recipientType?: 'customer' | 'admin' | 'custom';
  customRecipients?: string[];
  templateData?: Record<string, any>;

  // Condition specific
  conditions?: ConditionRule[];
  operator?: 'AND' | 'OR';

  // Switch specific
  switchExpression?: string;
  cases?: SwitchCase[];

  // Loop specific
  loopType?: 'for_each' | 'while' | 'repeat';
  loopExpression?: string;
  maxIterations?: number;

  // API specific
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url?: string;
  headers?: Record<string, string>;
  body?: any;
  authentication?: APIAuthentication;

  // Data transformer specific
  transformations?: DataTransformation[];
  inputData?: any;
  outputFormat?: 'json' | 'xml' | 'text';

  // Variable specific
  variableName?: string;
  variableValue?: any;
  variableScope?: 'workflow' | 'global';

  // Function specific
  functionCode?: string;
  functionLanguage?: 'javascript' | 'python';

  // Error handling specific
  errorType?: 'any' | 'timeout' | 'http_error' | 'validation_error';
  retryCount?: number;
  retryDelay?: number;

  // AI specific
  aiPrompt?: string;
  aiModel?: string;
  aiTemperature?: number;

  // Database specific
  query?: string;
  parameters?: Record<string, any>;
}

export interface ConditionRule {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'regex' | 'exists' | 'not_exists';
  value: any;
}

export interface SwitchCase {
  case: string;
  label?: string;
}

export interface DataTransformation {
  type: 'map' | 'filter' | 'reduce' | 'set' | 'delete' | 'rename';
  sourceField?: string;
  targetField?: string;
  value?: any;
  expression?: string;
}

export interface APIAuthentication {
  type: 'none' | 'basic' | 'bearer' | 'api_key' | 'oauth2';
  username?: string;
  password?: string;
  token?: string;
  apiKey?: string;
  apiKeyHeader?: string;
  oauth2Config?: {
    clientId: string;
    clientSecret: string;
    tokenUrl: string;
    scope?: string;
  };
}

export interface NodeSettings {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  continueOnError?: boolean;
  logLevel?: 'none' | 'error' | 'warn' | 'info' | 'debug';
  cacheResults?: boolean;
  cacheTTL?: number;
}

export interface NodePort {
  id: string;
  label: string;
  type: 'input' | 'output';
}

export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  label?: string; // For conditional routing (true/false, case labels, etc.)
  condition?: string; // Expression or condition for routing
  data?: any; // Additional data for the connection
}

export interface WorkflowSettings {
  // Trigger settings
  triggerOnOrder: boolean;
  triggerOnBooking: boolean;
  triggerOnPayment: boolean;
  triggerOnUserRegistration: boolean;
  triggerOnWebhook: boolean;
  triggerOnSchedule: boolean;

  // General settings
  enabled: boolean;
  maxExecutionTime: number; // in seconds
  maxRetries: number;
  retryDelay: number; // in seconds
  continueOnError: boolean;
  logLevel: 'none' | 'error' | 'warn' | 'info' | 'debug';

  // Advanced settings
  variables?: Record<string, any>;
  environment?: 'development' | 'staging' | 'production';
  tags?: string[];
  version?: string;
  description?: string;
}

export function VisualWorkflowBuilder({
  language,
  onSave,
  onTest,
  initialWorkflow
}: VisualWorkflowBuilderProps) {
  const [workflow, setWorkflow] = useState<WorkflowData>(initialWorkflow || {
    id: '',
    name: '',
    description: '',
    nodes: [],
    connections: [],
    settings: {
      triggerOnOrder: true,
      triggerOnBooking: false,
      triggerOnPayment: false,
      triggerOnUserRegistration: false,
      triggerOnWebhook: false,
      triggerOnSchedule: false,
      enabled: true,
      maxExecutionTime: 300,
      maxRetries: 3,
      retryDelay: 5,
      continueOnError: false,
      logLevel: 'info',
      variables: {},
      environment: 'development',
      tags: [],
      version: '1.0.0'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showProperties, setShowProperties] = useState(true);
  const [showTelegramUserModal, setShowTelegramUserModal] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const translations = {
    en: {
      title: 'Visual Workflow Builder',
      description: 'Create communication workflows with drag-and-drop nodes',
      workflowName: 'Workflow Name',
      workflowDescription: 'Description',
      settings: 'Settings',
      triggerOnOrder: 'Trigger on Order',
      triggerOnBooking: 'Trigger on Booking',
      triggerOnPayment: 'Trigger on Payment',
      triggerOnUserRegistration: 'Trigger on User Registration',
      triggerOnWebhook: 'Trigger on Webhook',
      triggerOnSchedule: 'Trigger on Schedule',
      enabled: 'Enabled',
      maxExecutionTime: 'Max Execution Time (sec)',
      maxRetries: 'Max Retries',
      retryDelay: 'Retry Delay (sec)',
      continueOnError: 'Continue on Error',
      logLevel: 'Log Level',
      save: 'Save Workflow',
      test: 'Test Workflow',
      export: 'Export',
      import: 'Import',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      reset: 'Reset View',
      addNode: 'Add Node',
      nodes: 'Available Nodes',

      // Node types
      trigger: 'Order Trigger',
      webhook_trigger: 'Webhook Trigger',
      schedule_trigger: 'Schedule Trigger',
      event_trigger: 'Event Trigger',
      email: 'Email',
      telegram: 'Telegram',
      sms: 'SMS',
      whatsapp: 'WhatsApp',
      instagram: 'Instagram',
      condition: 'Condition',
      switch: 'Switch',
      loop: 'Loop',
      merge: 'Merge',
      split: 'Split',
      delay: 'Delay',
      wait: 'Wait',
      api_call: 'API Call',
      data_transformer: 'Data Transformer',
      set_variable: 'Set Variable',
      get_variable: 'Get Variable',
      function: 'Function',
      webhook: 'Webhook',
      error_handler: 'Error Handler',
      retry: 'Retry',
      fallback: 'Fallback',
      ai_processor: 'AI Processor',
      database_query: 'Database Query',
      file_processor: 'File Processor',

      delete: 'Delete',
      copy: 'Copy',
      configure: 'Configure',
      testWorkflow: 'Test Workflow',
      workflowSaved: 'Workflow saved successfully',
      workflowTested: 'Workflow test completed'
    },
    es: {
      title: 'Constructor Visual de Flujos',
      description: 'Crea flujos de comunicación con nodos de arrastrar y soltar',
      workflowName: 'Nombre del Flujo',
      workflowDescription: 'Descripción',
      settings: 'Configuración',
      triggerOnOrder: 'Activar en Pedido',
      triggerOnBooking: 'Activar en Reserva',
      triggerOnPayment: 'Activar en Pago',
      triggerOnUserRegistration: 'Activar en Registro de Usuario',
      triggerOnWebhook: 'Activar en Webhook',
      triggerOnSchedule: 'Activar en Programación',
      enabled: 'Habilitado',
      maxExecutionTime: 'Tiempo Máx. de Ejecución (seg)',
      maxRetries: 'Máx. Reintentos',
      retryDelay: 'Retraso de Reintento (seg)',
      continueOnError: 'Continuar en Error',
      logLevel: 'Nivel de Log',
      save: 'Guardar Flujo',
      test: 'Probar Flujo',
      export: 'Exportar',
      import: 'Importar',
      zoomIn: 'Acercar',
      zoomOut: 'Alejar',
      reset: 'Reiniciar Vista',
      addNode: 'Agregar Nodo',
      nodes: 'Nodos Disponibles',

      // Node types
      trigger: 'Activador de Pedido',
      webhook_trigger: 'Activador Webhook',
      schedule_trigger: 'Activador Programado',
      event_trigger: 'Activador de Evento',
      email: 'Email',
      telegram: 'Telegram',
      sms: 'SMS',
      whatsapp: 'WhatsApp',
      instagram: 'Instagram',
      condition: 'Condición',
      switch: 'Interruptor',
      loop: 'Bucle',
      merge: 'Fusionar',
      split: 'Dividir',
      delay: 'Retraso',
      wait: 'Esperar',
      api_call: 'Llamada API',
      data_transformer: 'Transformador de Datos',
      set_variable: 'Establecer Variable',
      get_variable: 'Obtener Variable',
      function: 'Función',
      webhook: 'Webhook',
      error_handler: 'Manejador de Errores',
      retry: 'Reintentar',
      fallback: 'Alternativa',
      ai_processor: 'Procesador IA',
      database_query: 'Consulta BD',
      file_processor: 'Procesador de Archivos',

      delete: 'Eliminar',
      copy: 'Copiar',
      configure: 'Configurar',
      testWorkflow: 'Probar Flujo',
      workflowSaved: 'Flujo guardado exitosamente',
      workflowTested: 'Prueba del flujo completada'
    }
  };

  const t = translations[language];

  // Workflow templates
  const workflowTemplates = [
    {
      id: 'order_confirmation',
      name: 'Order Confirmation Flow',
      description: 'Send confirmation emails and notifications for new orders',
      category: 'ecommerce',
      nodes: [
        {
          id: 'trigger_1',
          type: 'trigger',
          position: { x: 100, y: 100 },
          data: { label: 'Order Created', triggerType: 'order_created', enabled: true },
          inputs: [],
          outputs: [{ id: 'output', label: 'Output', type: 'output' }]
        },
        {
          id: 'email_1',
          type: 'email',
          position: { x: 300, y: 100 },
          data: {
            label: 'Send Confirmation Email',
            templateId: 'order_confirmation',
            recipientType: 'customer',
            enabled: true
          },
          inputs: [{ id: 'input', label: 'Input', type: 'input' }],
          outputs: [{ id: 'output', label: 'Output', type: 'output' }]
        },
        {
          id: 'telegram_1',
          type: 'telegram',
          position: { x: 500, y: 100 },
          data: {
            label: 'Send Telegram Notification',
            templateId: 'order_notification',
            recipientType: 'admin',
            enabled: true
          },
          inputs: [{ id: 'input', label: 'Input', type: 'input' }],
          outputs: [{ id: 'output', label: 'Output', type: 'output' }]
        }
      ],
      connections: [
        { id: 'conn_1', source: 'trigger_1', target: 'email_1', sourceHandle: 'output', targetHandle: 'input' },
        { id: 'conn_2', source: 'email_1', target: 'telegram_1', sourceHandle: 'output', targetHandle: 'input' }
      ]
    },
    {
      id: 'conditional_pricing',
      name: 'Conditional Pricing Flow',
      description: 'Apply different pricing logic based on order conditions',
      category: 'ecommerce',
      nodes: [
        {
          id: 'trigger_1',
          type: 'trigger',
          position: { x: 100, y: 100 },
          data: { label: 'Order Created', triggerType: 'order_created', enabled: true },
          inputs: [],
          outputs: [{ id: 'output', label: 'Output', type: 'output' }]
        },
        {
          id: 'condition_1',
          type: 'condition',
          position: { x: 300, y: 100 },
          data: {
            label: 'Check Order Total',
            conditions: [{ field: 'totalAmount', operator: 'greater_than', value: 100 }],
            operator: 'AND',
            enabled: true
          },
          inputs: [{ id: 'input', label: 'Input', type: 'input' }],
          outputs: [
            { id: 'true', label: 'True', type: 'output' },
            { id: 'false', label: 'False', type: 'output' }
          ]
        },
        {
          id: 'email_premium',
          type: 'email',
          position: { x: 500, y: 50 },
          data: {
            label: 'Premium Customer Email',
            templateId: 'premium_order',
            recipientType: 'customer',
            enabled: true
          },
          inputs: [{ id: 'input', label: 'Input', type: 'input' }],
          outputs: [{ id: 'output', label: 'Output', type: 'output' }]
        },
        {
          id: 'email_standard',
          type: 'email',
          position: { x: 500, y: 150 },
          data: {
            label: 'Standard Customer Email',
            templateId: 'standard_order',
            recipientType: 'customer',
            enabled: true
          },
          inputs: [{ id: 'input', label: 'Input', type: 'input' }],
          outputs: [{ id: 'output', label: 'Output', type: 'output' }]
        }
      ],
      connections: [
        { id: 'conn_1', source: 'trigger_1', target: 'condition_1', sourceHandle: 'output', targetHandle: 'input' },
        { id: 'conn_2', source: 'condition_1', target: 'email_premium', sourceHandle: 'true', targetHandle: 'input', label: 'High Value' },
        { id: 'conn_3', source: 'condition_1', target: 'email_standard', sourceHandle: 'false', targetHandle: 'input', label: 'Standard' }
      ]
    },
    {
      id: 'api_integration',
      name: 'API Integration Flow',
      description: 'Call external APIs and process responses',
      category: 'integration',
      nodes: [
        {
          id: 'trigger_1',
          type: 'trigger',
          position: { x: 100, y: 100 },
          data: { label: 'Webhook Trigger', enabled: true },
          inputs: [],
          outputs: [{ id: 'output', label: 'Output', type: 'output' }]
        },
        {
          id: 'api_call_1',
          type: 'api_call',
          position: { x: 300, y: 100 },
          data: {
            label: 'Validate Order',
            method: 'POST',
            url: 'https://api.example.com/validate',
            authentication: { type: 'bearer' },
            enabled: true
          },
          inputs: [{ id: 'input', label: 'Input', type: 'input' }],
          outputs: [{ id: 'output', label: 'Output', type: 'output' }]
        },
        {
          id: 'condition_1',
          type: 'condition',
          position: { x: 500, y: 100 },
          data: {
            label: 'Check API Response',
            conditions: [{ field: 'response.valid', operator: 'equals', value: true }],
            enabled: true
          },
          inputs: [{ id: 'input', label: 'Input', type: 'input' }],
          outputs: [
            { id: 'true', label: 'Valid', type: 'output' },
            { id: 'false', label: 'Invalid', type: 'output' }
          ]
        },
        {
          id: 'email_success',
          type: 'email',
          position: { x: 700, y: 50 },
          data: {
            label: 'Success Email',
            templateId: 'order_validated',
            recipientType: 'customer',
            enabled: true
          },
          inputs: [{ id: 'input', label: 'Input', type: 'input' }],
          outputs: [{ id: 'output', label: 'Output', type: 'output' }]
        },
        {
          id: 'email_error',
          type: 'email',
          position: { x: 700, y: 150 },
          data: {
            label: 'Error Email',
            templateId: 'order_failed',
            recipientType: 'customer',
            enabled: true
          },
          inputs: [{ id: 'input', label: 'Input', type: 'input' }],
          outputs: [{ id: 'output', label: 'Output', type: 'output' }]
        }
      ],
      connections: [
        { id: 'conn_1', source: 'trigger_1', target: 'api_call_1', sourceHandle: 'output', targetHandle: 'input' },
        { id: 'conn_2', source: 'api_call_1', target: 'condition_1', sourceHandle: 'output', targetHandle: 'input' },
        { id: 'conn_3', source: 'condition_1', target: 'email_success', sourceHandle: 'true', targetHandle: 'input', label: 'Valid' },
        { id: 'conn_4', source: 'condition_1', target: 'email_error', sourceHandle: 'false', targetHandle: 'input', label: 'Invalid' }
      ]
    },
    {
      id: 'retry_workflow',
      name: 'Retry & Error Handling Flow',
      description: 'Handle failures with retry logic and error notifications',
      category: 'error_handling',
      nodes: [
        {
          id: 'trigger_1',
          type: 'trigger',
          position: { x: 100, y: 100 },
          data: { label: 'Order Created', triggerType: 'order_created', enabled: true },
          inputs: [],
          outputs: [{ id: 'output', label: 'Output', type: 'output' }]
        },
        {
          id: 'api_call_1',
          type: 'api_call',
          position: { x: 300, y: 100 },
          data: {
            label: 'Process Payment',
            method: 'POST',
            url: 'https://api.payment.com/charge',
            enabled: true
          },
          inputs: [{ id: 'input', label: 'Input', type: 'input' }],
          outputs: [{ id: 'output', label: 'Output', type: 'output' }]
        },
        {
          id: 'retry_1',
          type: 'retry',
          position: { x: 500, y: 100 },
          data: {
            label: 'Retry Payment',
            retryCount: 3,
            retryDelay: 5,
            enabled: true
          },
          inputs: [{ id: 'input', label: 'Input', type: 'input' }],
          outputs: [
            { id: 'success', label: 'Success', type: 'output' },
            { id: 'error', label: 'Error', type: 'output' }
          ]
        },
        {
          id: 'email_success',
          type: 'email',
          position: { x: 700, y: 50 },
          data: {
            label: 'Payment Success',
            templateId: 'payment_success',
            recipientType: 'customer',
            enabled: true
          },
          inputs: [{ id: 'input', label: 'Input', type: 'input' }],
          outputs: [{ id: 'output', label: 'Output', type: 'output' }]
        },
        {
          id: 'error_handler_1',
          type: 'error_handler',
          position: { x: 700, y: 150 },
          data: {
            label: 'Handle Payment Failure',
            errorType: 'any',
            enabled: true
          },
          inputs: [{ id: 'input', label: 'Input', type: 'input' }],
          outputs: [{ id: 'output', label: 'Output', type: 'output' }]
        }
      ],
      connections: [
        { id: 'conn_1', source: 'trigger_1', target: 'api_call_1', sourceHandle: 'output', targetHandle: 'input' },
        { id: 'conn_2', source: 'api_call_1', target: 'retry_1', sourceHandle: 'output', targetHandle: 'input' },
        { id: 'conn_3', source: 'retry_1', target: 'email_success', sourceHandle: 'success', targetHandle: 'input', label: 'Success' },
        { id: 'conn_4', source: 'retry_1', target: 'error_handler_1', sourceHandle: 'error', targetHandle: 'input', label: 'Failed' }
      ]
    }
  ];

  // Available node types
  const nodeTypes = [
    // Triggers
    { type: 'trigger', label: t.trigger, icon: Workflow, color: 'bg-blue-500', category: 'trigger' },
    { type: 'webhook_trigger', label: t.webhook_trigger, icon: Webhook, color: 'bg-blue-600', category: 'trigger' },
    { type: 'schedule_trigger', label: t.schedule_trigger, icon: Clock, color: 'bg-blue-700', category: 'trigger' },
    { type: 'event_trigger', label: t.event_trigger, icon: Zap, color: 'bg-blue-800', category: 'trigger' },

    // Communication
    { type: 'email', label: t.email, icon: Mail, color: 'bg-green-500', category: 'communication' },
    { type: 'telegram', label: t.telegram, icon: MessageSquare, color: 'bg-blue-400', category: 'communication' },
    { type: 'sms', label: t.sms, icon: Smartphone, color: 'bg-orange-500', category: 'communication' },
    { type: 'whatsapp', label: t.whatsapp, icon: MessageCircle, color: 'bg-green-600', category: 'communication' },
    { type: 'instagram', label: t.instagram, icon: MessageCircle, color: 'bg-pink-500', category: 'communication' },

    // Logic & Flow Control
    { type: 'condition', label: t.condition, icon: GitBranch, color: 'bg-purple-500', category: 'logic' },
    { type: 'switch', label: t.switch, icon: GitBranch, color: 'bg-purple-600', category: 'logic' },
    { type: 'loop', label: t.loop, icon: RefreshCw, color: 'bg-purple-700', category: 'logic' },
    { type: 'merge', label: t.merge, icon: GitBranch, color: 'bg-purple-800', category: 'logic' },
    { type: 'split', label: t.split, icon: GitBranch, color: 'bg-purple-900', category: 'logic' },
    { type: 'delay', label: t.delay, icon: Clock, color: 'bg-gray-500', category: 'logic' },
    { type: 'wait', label: t.wait, icon: Clock, color: 'bg-gray-600', category: 'logic' },

    // Data & API
    { type: 'api_call', label: t.api_call, icon: Globe, color: 'bg-yellow-500', category: 'data' },
    { type: 'data_transformer', label: t.data_transformer, icon: Settings, color: 'bg-yellow-600', category: 'data' },
    { type: 'set_variable', label: t.set_variable, icon: Settings, color: 'bg-yellow-700', category: 'data' },
    { type: 'get_variable', label: t.get_variable, icon: Settings, color: 'bg-yellow-800', category: 'data' },
    { type: 'function', label: t.function, icon: Code, color: 'bg-yellow-900', category: 'data' },
    { type: 'webhook', label: t.webhook, icon: Webhook, color: 'bg-cyan-500', category: 'data' },

    // Error Handling
    { type: 'error_handler', label: t.error_handler, icon: AlertTriangle, color: 'bg-red-500', category: 'error' },
    { type: 'retry', label: t.retry, icon: RefreshCw, color: 'bg-red-600', category: 'error' },
    { type: 'fallback', label: t.fallback, icon: Shield, color: 'bg-red-700', category: 'error' },

    // Advanced
    { type: 'ai_processor', label: t.ai_processor, icon: Brain, color: 'bg-indigo-500', category: 'advanced' },
    { type: 'database_query', label: t.database_query, icon: Database, color: 'bg-indigo-600', category: 'advanced' },
    { type: 'file_processor', label: t.file_processor, icon: FileText, color: 'bg-indigo-700', category: 'advanced' }
  ];

  const handleAddNode = useCallback((type: string, position?: { x: number; y: number }) => {
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type: type as any,
      position: position || { x: Math.random() * 400, y: Math.random() * 300 },
      data: getDefaultNodeData(type),
      inputs: getNodeInputs(type),
      outputs: getNodeOutputs(type)
    };

    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  }, []);

  const getDefaultNodeData = (type: string): NodeData => {
    switch (type) {
      // Triggers
      case 'trigger':
        return {
          label: 'Order Trigger',
          triggerType: 'order_created',
          enabled: true
        };
      case 'webhook_trigger':
        return {
          label: 'Webhook Trigger',
          webhookUrl: '',
          enabled: true
        };
      case 'schedule_trigger':
        return {
          label: 'Schedule Trigger',
          scheduleExpression: '0 9 * * *', // Daily at 9 AM
          enabled: true
        };
      case 'event_trigger':
        return {
          label: 'Event Trigger',
          triggerType: 'user_registered',
          enabled: true
        };

      // Communication
      case 'email':
        return {
          label: 'Send Email',
          templateId: '',
          recipientType: 'customer',
          customRecipients: [],
          templateData: {},
          enabled: true
        };
      case 'telegram':
        return {
          label: 'Send Telegram',
          templateId: '',
          recipientType: 'customer',
          customRecipients: [],
          templateData: {},
          enabled: true
        };
      case 'sms':
        return {
          label: 'Send SMS',
          templateId: '',
          recipientType: 'customer',
          customRecipients: [],
          templateData: {},
          enabled: true
        };
      case 'whatsapp':
        return {
          label: 'Send WhatsApp',
          templateId: '',
          recipientType: 'customer',
          customRecipients: [],
          templateData: {},
          enabled: true
        };
      case 'instagram':
        return {
          label: 'Send Instagram',
          templateId: '',
          recipientType: 'customer',
          customRecipients: [],
          templateData: {},
          enabled: true
        };

      // Logic & Flow Control
      case 'condition':
        return {
          label: 'Condition',
          conditions: [{
            field: 'orderTotal',
            operator: 'greater_than',
            value: 100
          }],
          operator: 'AND',
          enabled: true
        };
      case 'switch':
        return {
          label: 'Switch',
          switchExpression: '{{orderStatus}}',
          cases: [
            { case: 'pending', label: 'Pending' },
            { case: 'confirmed', label: 'Confirmed' },
            { case: 'completed', label: 'Completed' }
          ],
          enabled: true
        };
      case 'loop':
        return {
          label: 'Loop',
          loopType: 'for_each',
          loopExpression: '{{items}}',
          maxIterations: 10,
          enabled: true
        };
      case 'merge':
        return {
          label: 'Merge',
          enabled: true
        };
      case 'split':
        return {
          label: 'Split',
          enabled: true
        };
      case 'delay':
        return {
          label: 'Delay',
          enabled: true
        };
      case 'wait':
        return {
          label: 'Wait',
          enabled: true
        };

      // Data & API
      case 'api_call':
        return {
          label: 'API Call',
          method: 'GET',
          url: '',
          headers: {},
          authentication: { type: 'none' },
          enabled: true
        };
      case 'data_transformer':
        return {
          label: 'Transform Data',
          transformations: [],
          outputFormat: 'json',
          enabled: true
        };
      case 'set_variable':
        return {
          label: 'Set Variable',
          variableName: '',
          variableValue: '',
          variableScope: 'workflow',
          enabled: true
        };
      case 'get_variable':
        return {
          label: 'Get Variable',
          variableName: '',
          variableScope: 'workflow',
          enabled: true
        };
      case 'function':
        return {
          label: 'Function',
          functionCode: '',
          functionLanguage: 'javascript',
          enabled: true
        };
      case 'webhook':
        return {
          label: 'Webhook',
          method: 'POST',
          url: '',
          headers: {},
          enabled: true
        };

      // Error Handling
      case 'error_handler':
        return {
          label: 'Error Handler',
          errorType: 'any',
          enabled: true
        };
      case 'retry':
        return {
          label: 'Retry',
          retryCount: 3,
          retryDelay: 5,
          enabled: true
        };
      case 'fallback':
        return {
          label: 'Fallback',
          enabled: true
        };

      // Advanced
      case 'ai_processor':
        return {
          label: 'AI Processor',
          aiPrompt: '',
          aiModel: 'gpt-3.5-turbo',
          aiTemperature: 0.7,
          enabled: true
        };
      case 'database_query':
        return {
          label: 'Database Query',
          query: '',
          parameters: {},
          enabled: true
        };
      case 'file_processor':
        return {
          label: 'File Processor',
          enabled: true
        };

      default:
        return {
          label: type,
          enabled: true
        };
    }
  };

  const getNodeInputs = (type: string): NodePort[] => {
    switch (type) {
      // Triggers have no inputs
      case 'trigger':
      case 'webhook_trigger':
      case 'schedule_trigger':
      case 'event_trigger':
        return [];

      // Most nodes have one input
      case 'condition':
      case 'switch':
      case 'loop':
      case 'email':
      case 'telegram':
      case 'sms':
      case 'whatsapp':
      case 'instagram':
      case 'api_call':
      case 'data_transformer':
      case 'function':
      case 'webhook':
      case 'ai_processor':
      case 'database_query':
      case 'file_processor':
        return [{ id: 'input', label: 'Input', type: 'input' }];

      // Merge has multiple inputs
      case 'merge':
        return [
          { id: 'input1', label: 'Input 1', type: 'input' },
          { id: 'input2', label: 'Input 2', type: 'input' }
        ];

      // Variables and error handlers
      case 'set_variable':
      case 'get_variable':
      case 'error_handler':
      case 'retry':
      case 'fallback':
        return [{ id: 'input', label: 'Input', type: 'input' }];

      // Split and delay have inputs
      case 'split':
      case 'delay':
      case 'wait':
        return [{ id: 'input', label: 'Input', type: 'input' }];

      default:
        return [{ id: 'input', label: 'Input', type: 'input' }];
    }
  };

  const getNodeOutputs = (type: string): NodePort[] => {
    switch (type) {
      // Condition nodes have true/false outputs
      case 'condition':
        return [
          { id: 'true', label: 'True', type: 'output' },
          { id: 'false', label: 'False', type: 'output' }
        ];

      // Switch nodes have multiple case outputs
      case 'switch':
        return [
          { id: 'default', label: 'Default', type: 'output' },
          { id: 'case1', label: 'Case 1', type: 'output' },
          { id: 'case2', label: 'Case 2', type: 'output' },
          { id: 'case3', label: 'Case 3', type: 'output' }
        ];

      // Loop nodes have loop/complete outputs
      case 'loop':
        return [
          { id: 'loop', label: 'Loop', type: 'output' },
          { id: 'complete', label: 'Complete', type: 'output' }
        ];

      // Split nodes have multiple outputs
      case 'split':
        return [
          { id: 'output1', label: 'Output 1', type: 'output' },
          { id: 'output2', label: 'Output 2', type: 'output' }
        ];

      // Error handlers have success/error outputs
      case 'error_handler':
      case 'retry':
        return [
          { id: 'success', label: 'Success', type: 'output' },
          { id: 'error', label: 'Error', type: 'output' }
        ];

      // Most other nodes have single output
      case 'trigger':
      case 'webhook_trigger':
      case 'schedule_trigger':
      case 'event_trigger':
      case 'email':
      case 'telegram':
      case 'sms':
      case 'whatsapp':
      case 'instagram':
      case 'api_call':
      case 'data_transformer':
      case 'set_variable':
      case 'get_variable':
      case 'function':
      case 'webhook':
      case 'merge':
      case 'delay':
      case 'wait':
      case 'fallback':
      case 'ai_processor':
      case 'database_query':
      case 'file_processor':
        return [{ id: 'output', label: 'Output', type: 'output' }];

      default:
        return [{ id: 'output', label: 'Output', type: 'output' }];
    }
  };

  const handleNodeSelect = (node: WorkflowNode | null) => {
    setSelectedNode(node);
  };

  const handleNodeUpdate = (nodeId: string, updates: Partial<WorkflowNode>) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }));
  };

  const handleTelegramUsersChange = (users: any[]) => {
    if (selectedNode) {
      handleNodeUpdate(selectedNode.id, {
        data: {
          ...selectedNode.data,
          selectedUsers: users,
          chatIds: users.map(u => u.telegram_chat_id).filter(Boolean)
        }
      });
    }
  };

  const handleConnectionCreate = (connection: Omit<WorkflowConnection, 'id'>) => {
    const newConnection: WorkflowConnection = {
      ...connection,
      id: `connection_${Date.now()}`
    };
    setWorkflow(prev => ({
      ...prev,
      connections: [...prev.connections, newConnection]
    }));
  };

  const handleConnectionDelete = (connectionId: string) => {
    setWorkflow(prev => ({
      ...prev,
      connections: prev.connections.filter(conn => conn.id !== connectionId)
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(workflow);
    }
  };

  const handleTest = () => {
    if (onTest) {
      onTest(workflow);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault();
            handleZoomIn();
            break;
          case '-':
            e.preventDefault();
            handleZoomOut();
            break;
          case '0':
            e.preventDefault();
            handleResetZoom();
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 't':
            e.preventDefault();
            handleTest();
            break;
          case 'Delete':
          case 'Backspace':
            e.preventDefault();
            // Delete selected nodes
            if (selectedNode) {
              setWorkflow(prev => ({
                ...prev,
                nodes: prev.nodes.filter(n => n.id !== selectedNode.id),
                connections: prev.connections.filter(c =>
                  c.source !== selectedNode.id && c.target !== selectedNode.id
                )
              }));
              setSelectedNode(null);
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode]);

  const handleLoadTemplate = (templateId: string) => {
    const template = workflowTemplates.find(t => t.id === templateId);
    if (template) {
      setWorkflow(prev => ({
        ...prev,
        name: template.name,
        description: template.description,
        nodes: template.nodes,
        connections: template.connections
      }));
    }
  };

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-gray-600 mt-1">{t.description}</p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Top Row - Controls */}
            <div className="flex items-center gap-3">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 border rounded bg-white">
                <button
                  onClick={handleZoomOut}
                  className="px-1.5 py-1 hover:bg-gray-100 rounded-l text-xs"
                  title="Zoom Out"
                >
                  <ZoomOut size={12} />
                </button>
                <span className="px-2 text-xs font-mono bg-gray-50">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={handleZoomIn}
                  className="px-1.5 py-1 hover:bg-gray-100 text-xs"
                  title="Zoom In"
                >
                  <ZoomIn size={12} />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="px-1.5 py-1 hover:bg-gray-100 rounded-r text-xs"
                  title="Reset Zoom"
                >
                  <RotateCcw size={12} />
                </button>
              </div>

        {/* Properties Toggle */}
        <button
          onClick={() => setShowProperties(!showProperties)}
          className={`px-2 py-1 rounded border text-xs font-medium transition-colors ${
            showProperties 
              ? 'bg-blue-100 text-blue-700 border-blue-300' 
              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
          }`}
          title={showProperties ? 'Hide Properties Panel' : 'Show Properties Panel'}
        >
          <Settings size={14} className="mr-1 inline" />
          {showProperties ? 'Hide' : 'Show'}
        </button>

        {/* Test Modal Button */}
        <button
          onClick={() => {
            console.log('🧪 Test modal button clicked');
            setShowTelegramUserModal(true);
          }}
          className="px-2 py-1 rounded border text-xs font-medium bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
        >
          Test Modal
        </button>

              {/* Action Buttons */}
              <BaseButton
                onClick={handleTest}
                className="px-2 py-1 text-xs h-7"
                size="sm"
              >
                <TestTube size={14} className="mr-1" />
                {t.test}
              </BaseButton>

              <BaseButton
                onClick={handleSave}
                className="px-2 py-1 text-xs h-7 bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <Save size={14} className="mr-1" />
                {t.save}
              </BaseButton>
            </div>

            {/* Bottom Row - Template Selector */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Select 
                  value={selectedTemplateId} 
                  onValueChange={(value) => {
                    setSelectedTemplateId(value);
                    handleLoadTemplate(value);
                  }}
                >
                  <SelectTrigger className="w-full h-8 text-sm border rounded-md px-3 py-1 overflow-hidden">
                    <div className="flex items-center w-full min-w-0 max-w-full">
                      {selectedTemplateId ? (
                        <span className="truncate text-sm text-gray-900 max-w-full block">
                          {workflowTemplates.find(t => t.id === selectedTemplateId)?.name || 'Template'}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">📋 Load Template...</span>
                      )}
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-80 w-full">
                    {workflowTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id} className="py-2">
                        <div className="flex flex-col w-full">
                          <span className="font-medium text-sm truncate">{template.name}</span>
                          <span className="text-xs text-gray-500 mt-1 truncate">{template.description}</span>
                          <span className="text-xs text-blue-600 mt-1">
                            {template.nodes.length} nodes • {template.connections.length} connections
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedTemplateId && (
                <button
                  onClick={() => {
                    setSelectedTemplateId('');
                    setWorkflow(prev => ({
                      ...prev,
                      name: '',
                      description: '',
                      nodes: [],
                      connections: []
                    }));
                  }}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  title="Clear Template"
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Workflow Settings */}
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs font-medium text-gray-700">{t.workflowName}</Label>
            <BaseInput
              value={workflow.name}
              onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
              className="h-7 text-sm"
              placeholder="Workflow name..."
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">{t.description}</Label>
            <BaseInput
              value={workflow.description}
              onChange={(e) => setWorkflow(prev => ({ ...prev, description: e.target.value }))}
              className="h-7 text-sm"
              placeholder="Description..."
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={workflow.settings.enabled}
                onChange={(e) => setWorkflow(prev => ({
                  ...prev,
                  settings: { ...prev.settings, enabled: e.target.checked }
                }))}
                className="rounded"
              />
              <span className="text-gray-700">{t.enabled}</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Node Palette */}
        <div className="w-56 bg-white border-r p-3 overflow-y-auto">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">{t.nodes}</h3>

          <div className="space-y-4">
            {['trigger', 'communication', 'logic', 'data', 'error', 'advanced'].map((category) => {
              const categoryNodes = nodeTypes.filter(node => node.category === category);
              if (categoryNodes.length === 0) return null;

              const categoryLabels = {
                trigger: 'Triggers',
                communication: 'Communication',
                logic: 'Logic & Flow',
                data: 'Data & API',
                error: 'Error Handling',
                advanced: 'Advanced'
              };

              return (
                <div key={category}>
                  <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </h4>
                  <div className="space-y-1">
                    {categoryNodes.map((nodeType) => {
                      const IconComponent = nodeType.icon;
                      return (
                        <div
                          key={nodeType.type}
                          className={`p-1.5 border rounded cursor-move hover:shadow-sm transition-all duration-200 ${nodeType.color} text-white text-xs`}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('application/node-type', nodeType.type);
                            setIsDragging(true);
                          }}
                          onDragEnd={() => setIsDragging(false)}
                          title={nodeType.label}
                        >
                          <div className="flex items-center gap-1.5">
                            <IconComponent size={12} />
                            <span className="truncate">{nodeType.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Keyboard Shortcuts */}
          <div className="mt-4 pt-3 border-t">
            <h4 className="font-semibold text-gray-900 mb-2 text-xs">Shortcuts</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl</kbd>+<kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">+/-</kbd> Zoom</div>
              <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl</kbd>+<kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">S</kbd> Save</div>
              <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Del</kbd> Delete</div>
            </div>
          </div>

          {/* Workflow Settings */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-semibold text-gray-900 mb-3">{t.settings}</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={workflow.settings.triggerOnOrder}
                  onChange={(e) => setWorkflow(prev => ({
                    ...prev,
                    settings: { ...prev.settings, triggerOnOrder: e.target.checked }
                  }))}
                  className="rounded"
                />
                <span className="text-sm">{t.triggerOnOrder}</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={workflow.settings.triggerOnBooking}
                  onChange={(e) => setWorkflow(prev => ({
                    ...prev,
                    settings: { ...prev.settings, triggerOnBooking: e.target.checked }
                  }))}
                  className="rounded"
                />
                <span className="text-sm">{t.triggerOnBooking}</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={workflow.settings.triggerOnPayment}
                  onChange={(e) => setWorkflow(prev => ({
                    ...prev,
                    settings: { ...prev.settings, triggerOnPayment: e.target.checked }
                  }))}
                  className="rounded"
                />
                <span className="text-sm">{t.triggerOnPayment}</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={workflow.settings.enabled}
                  onChange={(e) => setWorkflow(prev => ({
                    ...prev,
                    settings: { ...prev.settings, enabled: e.target.checked }
                  }))}
                  className="rounded"
                />
                <span className="text-sm">{t.enabled}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative">
          <WorkflowCanvas
            workflow={workflow}
            onNodeSelect={handleNodeSelect}
            onNodeUpdate={handleNodeUpdate}
            onConnectionCreate={handleConnectionCreate}
            onConnectionDelete={handleConnectionDelete}
            onAddNode={handleAddNode}
            zoom={zoom}
            isDragging={isDragging}
          />
        </div>

        {/* Properties Panel */}
        {selectedNode && showProperties && (
          <div className="w-80 bg-white border-l p-4 overflow-y-auto">
            <NodePropertiesPanel
              node={selectedNode}
              onUpdate={(updates) => handleNodeUpdate(selectedNode.id, updates)}
              onDelete={() => {
                setWorkflow(prev => ({
                  ...prev,
                  nodes: prev.nodes.filter(n => n.id !== selectedNode.id),
                  connections: prev.connections.filter(
                    conn => conn.source !== selectedNode.id && conn.target !== selectedNode.id
                  )
                }));
                setSelectedNode(null);
              }}
              language={language}
              translations={t}
              onOpenTelegramModal={() => {
                console.log('🔧 Parent: Opening modal, current state:', showTelegramUserModal);
                setShowTelegramUserModal(true);
                console.log('🔧 Parent: Modal state set to true');
              }}
            />
          </div>
        )}

        {/* No mini panel - when properties are hidden, just show the canvas */}
      </div>
    </div>
  );
}

interface NodePropertiesPanelProps {
  node: WorkflowNode;
  onUpdate: (updates: Partial<WorkflowNode>) => void;
  onDelete: () => void;
  language: 'en' | 'es';
  translations: any;
  onOpenTelegramModal: () => void;
}

function NodePropertiesPanel({ node, onUpdate, onDelete, language, translations: t, onOpenTelegramModal }: NodePropertiesPanelProps) {
  console.log('🔧 NodePropertiesPanel: onOpenTelegramModal prop:', typeof onOpenTelegramModal);
  const renderNodeProperties = () => {
    switch (node.type) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div>
              <Label className="dashboard-label">Event Type</Label>
              <Select
                value={node.data.eventType}
                onValueChange={(value) => onUpdate({
                  data: { ...node.data, eventType: value }
                })}
              >
                <SelectTrigger className="dashboard-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order_created">Order Created</SelectItem>
                  <SelectItem value="booking_created">Booking Created</SelectItem>
                  <SelectItem value="payment_completed">Payment Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <Label className="dashboard-label">Email Template</Label>
              <Select
                value={node.data.template}
                onValueChange={(value) => onUpdate({
                  data: { ...node.data, template: value }
                })}
              >
                <SelectTrigger className="dashboard-input">
                  <SelectValue placeholder="Select template..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome_matpass">Welcome MatPass</SelectItem>
                  <SelectItem value="renewal_matpass">Renewal MatPass</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="dashboard-label">Recipients</Label>
              <BaseInput
                value={node.data.recipients?.join(', ') || ''}
                onChange={(e) => onUpdate({
                  data: {
                    ...node.data,
                    recipients: e.target.value.split(',').map(s => s.trim())
                  }
                })}
                className="dashboard-input"
                placeholder="customer@example.com, admin@example.com"
              />
            </div>
          </div>
        );

      case 'telegram':
        return (
          <div className="space-y-4">
            <div>
              <Label className="dashboard-label">Telegram Template</Label>
              <Select
                value={node.data.template}
                onValueChange={(value) => onUpdate({
                  data: { ...node.data, template: value }
                })}
              >
                <SelectTrigger className="dashboard-input">
                  <SelectValue placeholder="Select template..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_purchase_confirmation">New Purchase</SelectItem>
                  <SelectItem value="booking_reminder">Booking Reminder</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="dashboard-label">Select Users</Label>
              <div className="space-y-2">
                <BaseButton
                  onClick={() => {
                    console.log('🔧 Opening Telegram user modal...', { 
                      nodeType: node.type,
                      nodeId: node.id,
                      onOpenTelegramModal: typeof onOpenTelegramModal
                    });
                    if (onOpenTelegramModal) {
                      onOpenTelegramModal();
                      console.log('🔧 Modal opening function called');
                    } else {
                      console.error('❌ onOpenTelegramModal is not defined!');
                    }
                  }}
                  className="w-full justify-start"
                  size="sm"
                >
                  <Users size={16} className="mr-2" />
                  {node.data.selectedUsers?.length > 0 
                    ? `${node.data.selectedUsers.length} user${node.data.selectedUsers.length !== 1 ? 's' : ''} selected`
                    : 'Select Users'
                  }
                </BaseButton>
                
                {node.data.selectedUsers?.length > 0 && (
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    <div className="font-medium">Selected Users:</div>
                    {node.data.selectedUsers.map((user, index) => (
                      <div key={user.id} className="mt-1">
                        {user.fullName || 'No Name'} 
                        {user.telegram_chat_id && (
                          <span className="text-green-600 ml-2">
                            (Chat ID: {user.telegram_chat_id})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <Label className="dashboard-label">Field</Label>
              <Select
                value={node.data.field}
                onValueChange={(value) => onUpdate({
                  data: { ...node.data, field: value }
                })}
              >
                <SelectTrigger className="dashboard-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="orderTotal">Order Total</SelectItem>
                  <SelectItem value="isNewCustomer">Is New Customer</SelectItem>
                  <SelectItem value="hasMatpass">Has MatPass</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="dashboard-label">Operator</Label>
              <Select
                value={node.data.operator}
                onValueChange={(value) => onUpdate({
                  data: { ...node.data, operator: value }
                })}
              >
                <SelectTrigger className="dashboard-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="greater_than">Greater Than</SelectItem>
                  <SelectItem value="less_than">Less Than</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="dashboard-label">Value</Label>
              <BaseInput
                value={node.data.value}
                onChange={(e) => onUpdate({
                  data: { ...node.data, value: e.target.value }
                })}
                className="dashboard-input"
              />
            </div>
          </div>
        );

      default:
        return <div>No configuration available for this node type.</div>;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Node Properties</h3>
        <BaseButton
          onClick={onDelete}
          className="dashboard-button-danger"
          size="sm"
        >
          <Trash2 size={14} />
        </BaseButton>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="dashboard-label">Node Type</Label>
          <div className="text-sm text-gray-600 capitalize">{node.type}</div>
        </div>

        <div>
          <Label className="dashboard-label">Node ID</Label>
          <div className="text-sm text-gray-600 font-mono">{node.id}</div>
        </div>

        {renderNodeProperties()}
      </div>
    </div>
  );
}

// Telegram User Selector Component
interface TelegramUser {
  id: string;
  fullName: string;
  email: string;
  telegram_chat_id: string | null;
  telegram_username: string | null;
}

interface TelegramUserSelectorProps {
  selectedUsers: TelegramUser[];
  onUsersChange: (users: TelegramUser[]) => void;
}

function TelegramUserSelector({ selectedUsers, onUsersChange }: TelegramUserSelectorProps) {
  const [users, setUsers] = useState<TelegramUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch users with Telegram chat IDs
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/users/telegram');
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error('Failed to fetch Telegram users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    (user.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserToggle = (user: TelegramUser) => {
    const isSelected = selectedUsers.some(u => u.id === user.id);
    if (isSelected) {
      onUsersChange(selectedUsers.filter(u => u.id !== user.id));
    } else {
      onUsersChange([...selectedUsers, user]);
    }
  };

  const handleSelectAll = () => {
    const usersWithChatIds = filteredUsers.filter(user => user.telegram_chat_id);
    onUsersChange(usersWithChatIds);
  };

  const handleClearAll = () => {
    onUsersChange([]);
  };

  return (
    <div className="space-y-3">
      {/* Search */}
      <BaseInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search users..."
        className="w-full"
      />

      {/* Actions */}
      <div className="flex gap-2">
        <BaseButton
          onClick={handleSelectAll}
          size="sm"
          className="text-xs"
        >
          Select All with Chat ID
        </BaseButton>
        <BaseButton
          onClick={handleClearAll}
          size="sm"
          className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Clear All
        </BaseButton>
      </div>

      {/* User List */}
      <div className="max-h-48 overflow-y-auto border rounded-md">
        {loading ? (
          <div className="p-3 text-center text-sm text-gray-500">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-3 text-center text-sm text-gray-500">No users found</div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredUsers.map((user) => {
              const isSelected = selectedUsers.some(u => u.id === user.id);
              const hasChatId = !!user.telegram_chat_id;
              
              return (
                <div
                  key={user.id}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                  } ${!hasChatId ? 'opacity-50' : ''}`}
                  onClick={() => hasChatId && handleUserToggle(user)}
                >
                  <Checkbox
                    checked={isSelected}
                    disabled={!hasChatId}
                    onChange={() => hasChatId && handleUserToggle(user)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {user.fullName || 'No Name'}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user.email || 'No Email'}
                    </div>
                    {user.telegram_chat_id && (
                      <div className="text-xs text-green-600">
                        Chat ID: {user.telegram_chat_id}
                      </div>
                    )}
                    {!hasChatId && (
                      <div className="text-xs text-red-500">
                        No Telegram Chat ID
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Users Summary */}
      {selectedUsers.length > 0 && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          <strong>{selectedUsers.length}</strong> user{selectedUsers.length !== 1 ? 's' : ''} selected
          {selectedUsers.length > 0 && (
            <div className="mt-1">
              Chat IDs: {selectedUsers.map(u => u.telegram_chat_id).filter(Boolean).join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Telegram User Selector Modal */}
      {console.log('🔧 Modal state:', { showTelegramUserModal, selectedNode: selectedNode?.id })}
      {showTelegramUserModal && console.log('🔧 Modal should be rendering now...')}
      {showTelegramUserModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'red', zIndex: 9999 }}>
          <div style={{ color: 'white', fontSize: '24px', padding: '20px' }}>
            🔧 DEBUG: Modal should be visible now!
          </div>
        </div>
      )}
      <TelegramUserSelectorModal
        isOpen={showTelegramUserModal}
        onClose={() => {
          console.log('🔧 Closing Telegram user modal...');
          setShowTelegramUserModal(false);
        }}
        selectedUsers={selectedNode?.data?.selectedUsers || []}
        onUsersChange={handleTelegramUsersChange}
      />
    </div>
  );
}
