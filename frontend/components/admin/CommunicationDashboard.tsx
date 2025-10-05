'use client';

import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import {
  Settings,
  Mail,
  MessageSquare,
  Smartphone,
  Send,
  Layers,
  Workflow,
  BarChart3,
  FileText,
  Globe,
  Shield,
  Zap,
  Users,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Bot,
  Instagram,
  MessageCircle,
  TestTube,
  X,
  Save
} from 'lucide-react';

// Import all communication components
import { CommunicationConfigRefactored } from '../communication/CommunicationConfigRefactored';
import { ModularTemplateDashboard } from './templates/ModularTemplateDashboard';
import { VisualWorkflowBuilder, WorkflowData } from './workflows/VisualWorkflowBuilder';
import { WorkflowTestModal } from './WorkflowTestModal';
import { DashboardKPICards } from './DashboardKPICards';
import { MessageVolumeChart } from './MessageVolumeChart';
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics';
import { useCommunicationConfig } from '../../hooks/useCommunicationConfig';
import { toast } from 'sonner';

interface CommunicationDashboardProps {
  className?: string;
  initialLanguage?: 'en' | 'es';
  initialTab?: string;
}

export function CommunicationDashboard({
  className,
  initialLanguage = 'es',
  initialTab = 'overview'
}: CommunicationDashboardProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [language, setLanguage] = useState<'en' | 'es'>(initialLanguage);

  // Global save state using Zustand
  const { config, updateConfig, isLoading: isConfigLoading } = useCommunicationConfig();
  const [initialConfig, setInitialConfig] = useState(config);
  const hasUnsavedChanges = JSON.stringify(config) !== JSON.stringify(initialConfig);

  useEffect(() => {
    if (config && !isConfigLoading) {
      setInitialConfig(config);
    }
  }, [config, isConfigLoading]);

  const handleGlobalSave = async () => {
    toast.promise(updateConfig(config), {
      loading: 'Saving configuration...',
      success: () => {
        setInitialConfig(config);
        return 'Configuration saved successfully!';
      },
      error: 'Failed to save configuration.',
    });
  };

  const translations = {
    en: {
      title: 'Communication Center',
      subtitle: 'Unified management for all communication channels and workflows',
      overview: 'Overview',
      apis: 'API Settings',
      templates: 'Templates',
      workflows: 'Workflows',
      analytics: 'Analytics',
      logs: 'Activity Logs',
      settings: 'Settings',
      quickActions: 'Quick Actions',
      createWorkflow: 'Create Workflow',
      testTemplates: 'Test Templates',
      configureAPIs: 'Configure APIs',
      viewAnalytics: 'View Analytics',
      recentActivity: 'Recent Activity',
      systemStatus: 'System Status',
      activeWorkflows: 'Active Workflows',
      templatesConfigured: 'Templates Configured',
      messagesSent: 'Messages Sent Today',
      systemHealth: 'System Health',
      allSystemsOperational: 'All systems operational',
      lastUpdated: 'Last updated',
      workflowExecuted: 'Workflow executed successfully',
      templateUpdated: 'Template updated',
      apiConfigured: 'API configured',
      errorDetected: 'Error detected in workflow',
      configureEmailAPI: 'Configure Email API',
      configureTelegramAPI: 'Configure Telegram API',
      configureSMSAPI: 'Configure SMS API',
      createNewTemplate: 'Create New Template',
      buildWorkflow: 'Build Visual Workflow',
      viewReports: 'View Communication Reports',
      manageUsers: 'Manage Communication Users'
    },
    es: {
      title: 'Centro de Comunicación',
      subtitle: 'Gestión unificada de todos los canales de comunicación y flujos de trabajo',
      overview: 'Resumen',
      apis: 'Configuración de APIs',
      templates: 'Plantillas',
      workflows: 'Flujos de Trabajo',
      analytics: 'Analíticas',
      logs: 'Registros de Actividad',
      settings: 'Configuración',
      quickActions: 'Acciones Rápidas',
      createWorkflow: 'Crear Flujo',
      testTemplates: 'Probar Plantillas',
      configureAPIs: 'Configurar APIs',
      viewAnalytics: 'Ver Analíticas',
      recentActivity: 'Actividad Reciente',
      systemStatus: 'Estado del Sistema',
      activeWorkflows: 'Flujos Activos',
      templatesConfigured: 'Plantillas Configuradas',
      messagesSent: 'Mensajes Enviados Hoy',
      systemHealth: 'Salud del Sistema',
      allSystemsOperational: 'Todos los sistemas operativos',
      lastUpdated: 'Última actualización',
      workflowExecuted: 'Flujo ejecutado exitosamente',
      templateUpdated: 'Plantilla actualizada',
      apiConfigured: 'API configurada',
      errorDetected: 'Error detectado en flujo',
      configureEmailAPI: 'Configurar API de Email',
      configureTelegramAPI: 'Configurar API de Telegram',
      configureSMSAPI: 'Configurar API de SMS',
      createNewTemplate: 'Crear Nueva Plantilla',
      buildWorkflow: 'Construir Flujo Visual',
      viewReports: 'Ver Reportes de Comunicación',
      manageUsers: 'Gestionar Usuarios de Comunicación'
    }
  };

  // Workflow handlers
  const handleWorkflowSave = async (workflow: WorkflowData) => {
    console.log('🚀 handleWorkflowSave called with workflow:', workflow);

    // Ensure workflow has a name
    const workflowToSave = {
      ...workflow,
      name: workflow.name?.trim() || `Workflow ${new Date().toLocaleDateString()}`
    };

    console.log('📋 Workflow data to send:', {
      name: workflowToSave.name,
      description: workflowToSave.description,
      nodeCount: workflowToSave.nodes?.length || 0,
      connectionCount: workflowToSave.connections?.length || 0
    });
    try {
      console.log('💾 Saving workflow:', workflowToSave);

      const response = await fetch('/api/admin/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...workflowToSave,
          saveAsTemplate: true // Always save as template for now
        }),
      });

      console.log('📡 Save response status:', response.status);
      console.log('📡 Save response ok:', response.ok);

      const data = await response.json();
      console.log('📊 Save response data:', data);

      if (data.success) {
        console.log('✅ Workflow saved successfully:', data);
        alert(`✅ Flujo "${workflowToSave.name}" guardado exitosamente!\n\n📊 ${workflowToSave.nodes?.length || 0} nodos, ${workflowToSave.connections?.length || 0} conexiones`);
      } else {
        console.error('❌ Failed to save workflow:', data);
        alert('❌ Error al guardar el flujo: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('❌ Error saving workflow:', error);
      alert('❌ Error de conexión al guardar el flujo: ' + (error instanceof Error ? error.message : 'Error de red'));
    }
  };


  const t = translations[language];

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-600 mt-1">{t.subtitle}</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Live Service Status Indicators */}
              <div className="flex items-center gap-2" title="Live Service Status">
                <span
                  className={`w-3 h-3 rounded-full ${config?.email_enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                  title={`Email: ${config?.email_enabled ? 'Enabled' : 'Disabled'}`}
                />
                <span
                  className={`w-3 h-3 rounded-full ${config?.sms_enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                  title={`SMS: ${config?.sms_enabled ? 'Enabled' : 'Disabled'}`}
                />
                <span
                  className={`w-3 h-3 rounded-full ${config?.telegram_enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                  title={`Telegram: ${config?.telegram_enabled ? 'Enabled' : 'Disabled'}`}
                />
              </div>

              {/* Global Save Button */}
              {hasUnsavedChanges && (
                <BaseButton
                  onClick={handleGlobalSave}
                  disabled={isConfigLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm"
                >
                  {isConfigLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isConfigLoading ? 'Saving...' : 'Save Changes'}
                </BaseButton>
              )}

              {/* Language Switcher */}
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-gray-500" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* System Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <CheckCircle size={14} />
                <span>{t.allSystemsOperational}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs */}
          <TabsList className="grid w-full grid-cols-7 bg-white border shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 size={16} />
              <span className="hidden sm:inline">{t.overview}</span>
            </TabsTrigger>
            <TabsTrigger value="apis" className="flex items-center gap-2">
              <Settings size={16} />
              <span className="hidden sm:inline">{t.apis}</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText size={16} />
              <span className="hidden sm:inline">{t.templates}</span>
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <Workflow size={16} />
              <span className="hidden sm:inline">{t.workflows}</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp size={16} />
              <span className="hidden sm:inline">{t.analytics}</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Activity size={16} />
              <span className="hidden sm:inline">{t.logs}</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Shield size={16} />
              <span className="hidden sm:inline">{t.settings}</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <OverviewDashboard language={language} translations={t} />
          </TabsContent>

          {/* APIs Tab */}
          <TabsContent value="apis" className="space-y-6">
            <APIDashboard language={language} translations={t} />
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <ModularTemplateDashboard />
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows" className="space-y-6">
            <WorkflowDashboard
              language={language}
              translations={t}
              onSave={handleWorkflowSave}
              onTest={(workflow) => {
                // This will be handled by WorkflowDashboard internally
                console.log('Workflow test initiated for:', workflow.name);
              }}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard language={language} translations={t} />
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <LogsDashboard language={language} translations={t} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <SettingsDashboard language={language} translations={t} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Overview Dashboard Component
function OverviewDashboard({ language, translations: t }: { language: 'en' | 'es'; translations: any }) {
  const { data: metrics, isLoading } = useDashboardMetrics();
  const hasErrors = metrics?.recentErrors && metrics.recentErrors.length > 0;

  return (
    <div className="space-y-6">
      {/* Real-time KPI Cards */}
      <DashboardKPICards />

      {/* Message Volume Chart */}
      <MessageVolumeChart />

      {/* Enhanced Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          {t.quickActions}
          {hasErrors && (
            <Badge variant="destructive" className="text-xs">
              Action Required
            </Badge>
          )}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton
            icon={<Workflow />}
            title={t.createWorkflow}
            description="Build visual communication workflows"
            variant={hasErrors ? "default" : "outline"}
            onClick={() => console.log('Create workflow')}
          />
          <QuickActionButton
            icon={<FileText />}
            title={t.testTemplates}
            description="Test email and message templates"
            variant="outline"
            onClick={() => console.log('Test templates')}
          />
          <QuickActionButton
            icon={<Settings />}
            title={t.configureAPIs}
            description="Set up communication APIs"
            variant={hasErrors ? "destructive" : "outline"}
            onClick={() => console.log('Configure APIs')}
          />
          <QuickActionButton
            icon={<BarChart3 />}
            title={t.viewAnalytics}
            description="View communication analytics"
            variant="outline"
            onClick={() => console.log('View analytics')}
          />
          {hasErrors && (
            <QuickActionButton
              icon={<AlertTriangle />}
              title="View Error Logs"
              description={`${metrics?.recentErrors.length} errors detected`}
              variant="destructive"
              onClick={() => console.log('View error logs')}
            />
          )}
        </div>

        {/* System Status Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Activity className={`w-4 h-4 ${
                metrics?.systemHealth.status === 'healthy' ? 'text-green-600' :
                metrics?.systemHealth.status === 'warning' ? 'text-yellow-600' :
                'text-red-600'
              }`} />
              <span className="font-medium">
                {metrics?.systemHealth.status === 'healthy' ? 'All Systems Operational' :
                 metrics?.systemHealth.status === 'warning' ? 'Minor Issues Detected' :
                 'Critical Issues Detected'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
              <span>•</span>
              <span>Auto-refresh: 30s</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">{t.recentActivity}</h3>
          <div className="space-y-3">
            <ActivityItem
              icon={<CheckCircle className="text-green-500" size={16} />}
              message={t.workflowExecuted}
              time="2 minutes ago"
            />
            <ActivityItem
              icon={<FileText className="text-blue-500" size={16} />}
              message={t.templateUpdated}
              time="15 minutes ago"
            />
            <ActivityItem
              icon={<Settings className="text-purple-500" size={16} />}
              message={t.apiConfigured}
              time="1 hour ago"
            />
            <ActivityItem
              icon={<AlertTriangle className="text-orange-500" size={16} />}
              message={t.errorDetected}
              time="2 hours ago"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">{t.systemStatus}</h3>
          <div className="space-y-4">
            <SystemStatusItem
              name="Email Service"
              status="operational"
              responseTime="120ms"
            />
            <SystemStatusItem
              name="Telegram Bot"
              status="operational"
              responseTime="85ms"
            />
            <SystemStatusItem
              name="SMS Gateway"
              status="operational"
              responseTime="200ms"
            />
            <SystemStatusItem
              name="WhatsApp API"
              status="maintenance"
              responseTime="-"
            />
          </div>
          <div className="mt-4 text-xs text-gray-500">
            {t.lastUpdated}: 2 minutes ago
          </div>
        </Card>
      </div>
    </div>
  );
}

// API Dashboard Component
function APIDashboard({ language, translations: t }: { language: 'en' | 'es'; translations: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t.apis}</h2>
          <p className="text-gray-600 mt-1">
            {language === 'es'
              ? 'Configure las APIs de servicios de comunicación'
              : 'Configure communication service APIs'
            }
          </p>
        </div>
      </div>

      {/* Integrated Communication Configuration - Full UI */}
      <CommunicationConfigRefactored />
    </div>
  );
}

// Workflow Dashboard Component
function WorkflowDashboard({
  language,
  translations: t,
  onSave,
  onTest
}: {
  language: 'en' | 'es';
  translations: any;
  onSave: (workflow: WorkflowData) => void;
  onTest: (workflow: WorkflowData) => void;
}) {
  const [activeWorkflows, setActiveWorkflows] = useState<any[]>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<any>(null);
  const [showWorkflowTestModal, setShowWorkflowTestModal] = useState(false);
  const [selectedWorkflowForTest, setSelectedWorkflowForTest] = useState<WorkflowData | null>(null);

  // Load active workflows
  useEffect(() => {
    const loadWorkflows = async () => {
      setLoadingWorkflows(true);
      try {
        const response = await fetch('/api/admin/workflows?includeInactive=false&limit=50');
        const data = await response.json();

        if (data.success) {
          setActiveWorkflows(data.workflows || []);
        }
      } catch (error) {
        console.error('Error loading workflows:', error);
      } finally {
        setLoadingWorkflows(false);
      }
    };

    loadWorkflows();
  }, []);

  const toggleWorkflowStatus = async (workflowId: string, currentStatus: boolean) => {
    try {
      console.log('🔄 Toggling workflow status:', workflowId, 'from', currentStatus, 'to', !currentStatus);
      const response = await fetch(`/api/admin/workflows/${workflowId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus
        }),
      });

      const data = await response.json();
      console.log('📡 Toggle response:', data);

      if (data.success) {
        // Update local state
        setActiveWorkflows(prev =>
          prev.map(w =>
            w.id === workflowId ? { ...w, isActive: !currentStatus } : w
          )
        );
        console.log('✅ Workflow status updated locally');
      } else {
        console.error('❌ Failed to update workflow status:', data);
      }
    } catch (error) {
      console.error('❌ Error updating workflow status:', error);
    }
  };

  const deleteWorkflow = async (workflowId: string, workflowName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el flujo "${workflowName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      console.log('🗑️ Deleting workflow:', workflowId);
      const response = await fetch(`/api/admin/workflows/${workflowId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      console.log('📡 Delete response:', data);

      if (data.success) {
        // Remove from local state
        setActiveWorkflows(prev => prev.filter(w => w.id !== workflowId));
        console.log('✅ Workflow deleted successfully');
      } else {
        console.error('❌ Failed to delete workflow:', data);
        alert('Error al eliminar el flujo: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('❌ Error deleting workflow:', error);
      alert('Error de conexión al eliminar el flujo');
    }
  };

  const editWorkflow = async (workflowId: string) => {
    try {
      console.log('✏️ Loading workflow for editing:', workflowId);
      const response = await fetch(`/api/admin/workflows/${workflowId}`);
      const data = await response.json();

      if (data.success && data.workflow) {
        // Extract the workflow data from the database format
        const workflowData = data.workflow.data;

        // Create a workflow object that matches the VisualWorkflowBuilder format
        const workflowForEditing = {
          id: data.workflow.id,
          name: data.workflow.name,
          description: data.workflow.description,
          nodes: workflowData.nodes || [],
          connections: workflowData.connections || [],
          settings: workflowData.settings || {
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
          createdAt: new Date(data.workflow.createdAt),
          updatedAt: new Date(data.workflow.updatedAt)
        };

        console.log('✅ Workflow loaded for editing:', data.workflow.name);
        setEditingWorkflow(workflowForEditing);
      } else {
        console.error('❌ Failed to load workflow for editing:', data);
        alert('Error al cargar el flujo para edición');
      }
    } catch (error) {
      console.error('❌ Error loading workflow for editing:', error);
      alert('Error de conexión al cargar el flujo');
    }
  };

  const handleWorkflowTest = (workflow: WorkflowData) => {
    console.log('🧪 Opening workflow test modal for:', workflow.name);
    setSelectedWorkflowForTest(workflow);
    setShowWorkflowTestModal(true);
  };

  const handleRunWorkflowTest = async (workflow: WorkflowData, selectedUser: any) => {
    console.log('🧪 Running workflow test for:', workflow.name, 'with user:', selectedUser.email);

    try {
      const response = await fetch('/api/admin/workflows/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow,
          testData: {
            userName: selectedUser.fullName || 'Usuario de Prueba',
            userEmail: selectedUser.email,
            orderId: `TEST-${Date.now()}`,
            orderTotal: 150,
            products: [],
            matpassData: {
              type: 'MatPass 8 clases',
              description: 'Acceso ilimitado por 30 días',
              price: 150,
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            },
            bookingData: null,
            eventContext: {
              user: {
                id: selectedUser.id,
                email: selectedUser.email,
                fullName: selectedUser.fullName
              }
            },
            userRole: selectedUser.role,
            telegramChatId: selectedUser.telegramChatId
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Workflow test completed successfully:', data);
        const executedNodes = data.results?.executedNodes?.length || 0;
        const duration = data.results?.duration || 0;
        alert(`✅ Prueba del flujo completada exitosamente!\n\n👤 Usuario: ${selectedUser.fullName || selectedUser.email}\n⚡ ${executedNodes} nodos ejecutados\n⏱️ ${duration}ms de duración\n📊 Resultados disponibles en consola`);
      } else {
        console.error('❌ Workflow test failed:', data);
        alert('❌ Error en la prueba del flujo: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('❌ Error testing workflow:', error);
      alert('❌ Error de conexión al probar el flujo: ' + (error instanceof Error ? error.message : 'Error de red'));
    }
  };

  const handleCloseTestModal = () => {
    setShowWorkflowTestModal(false);
    setSelectedWorkflowForTest(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visual Workflows</h2>
          <p className="text-gray-600 mt-1">Create and manage communication workflows</p>
        </div>
        <BaseButton className="bg-blue-600 hover:bg-blue-700 text-white">
          <Workflow size={16} className="mr-2" />
          Create New Workflow
        </BaseButton>
      </div>

      {/* Active Workflows Management */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🏃 Active Workflows
        </h3>

        {loadingWorkflows ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-600">Loading workflows...</p>
          </div>
        ) : activeWorkflows.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Workflow size={48} className="mx-auto mb-4 opacity-50" />
            <p>No active workflows yet</p>
            <p className="text-sm">Save a workflow below to see it here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeWorkflows.map(workflow => (
              <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{workflow.name}</h4>
                  <p className="text-sm text-gray-600">{workflow.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>📊 {workflow.nodeCount} nodes</span>
                    <span>🔗 {workflow.connectionCount} connections</span>
                    <span>📅 {new Date(workflow.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    workflow.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {workflow.isActive ? '🟢 Active' : '⚪ Inactive'}
                  </span>

                  <div className="flex gap-1">
                    <button
                      onClick={() => editWorkflow(workflow.id)}
                      className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                      title="Edit Workflow"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => toggleWorkflowStatus(workflow.id, workflow.isActive)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        workflow.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      title={workflow.isActive ? 'Disable Workflow' : 'Enable Workflow'}
                    >
                      {workflow.isActive ? 'Disable' : 'Enable'}
                    </button>

                    <button
                      onClick={() => deleteWorkflow(workflow.id, workflow.name)}
                      className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                      title="Delete Workflow"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workflow Builder */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            ⚙️ Workflow Builder
          </h3>
          <p className="text-gray-600 mt-1">Design and test your communication workflows</p>
        </div>

        <div className="p-6">
          <VisualWorkflowBuilder
            language={language}
            onSave={onSave}
            onTest={handleWorkflowTest}
            initialWorkflow={editingWorkflow}
          />
        </div>
      </div>
    </div>
  );
}

// Analytics Dashboard Component
function AnalyticsDashboard({ language, translations: t }: { language: 'en' | 'es'; translations: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Communication Analytics</h2>
          <p className="text-gray-600 mt-1">Track performance and engagement metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Message Delivery</h3>
          <div className="space-y-3">
            <MetricItem label="Email Delivery Rate" value="98.5%" trend="up" />
            <MetricItem label="SMS Delivery Rate" value="95.2%" trend="up" />
            <MetricItem label="Telegram Delivery" value="99.8%" trend="up" />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Response Rates</h3>
          <div className="space-y-3">
            <MetricItem label="Email Open Rate" value="42.3%" trend="up" />
            <MetricItem label="Click Rate" value="8.7%" trend="down" />
            <MetricItem label="Conversion Rate" value="3.2%" trend="up" />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Top Templates</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Welcome MatPass</span>
              <span className="font-semibold">1,234 sent</span>
            </div>
            <div className="flex justify-between">
              <span>Renewal Reminder</span>
              <span className="font-semibold">856 sent</span>
            </div>
            <div className="flex justify-between">
              <span>Booking Confirmation</span>
              <span className="font-semibold">643 sent</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Logs Dashboard Component
function LogsDashboard({ language, translations: t }: { language: 'en' | 'es'; translations: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activity Logs</h2>
          <p className="text-gray-600 mt-1">Monitor communication activities and errors</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {/* Log entries would go here */}
          <LogEntry
            timestamp="2024-01-15 14:30:22"
            level="info"
            message="Workflow 'New Customer Welcome' executed successfully"
            details="Sent email and Telegram message"
          />
          <LogEntry
            timestamp="2024-01-15 14:25:10"
            level="warning"
            message="SMS delivery failed for +51 999 999 999"
            details="Gateway timeout - retry scheduled"
          />
          <LogEntry
            timestamp="2024-01-15 14:20:45"
            level="info"
            message="Template 'MatPass Renewal' updated"
            details="Subject line changed by admin"
          />
        </div>
      </Card>
    </div>
  );
}

// Settings Dashboard Component
function SettingsDashboard({ language, translations: t }: { language: 'en' | 'es'; translations: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-600 mt-1">Configure system-wide communication settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">General Settings</h3>
          <div className="space-y-4">
            <SettingItem
              label="Enable Debug Mode"
              description="Log detailed communication activities"
              type="toggle"
            />
            <SettingItem
              label="Default Language"
              description="Default language for templates"
              type="select"
              options={['Spanish', 'English']}
            />
            <SettingItem
              label="Rate Limiting"
              description="Messages per minute limit"
              type="number"
              value="100"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Security Settings</h3>
          <div className="space-y-4">
            <SettingItem
              label="API Key Rotation"
              description="Automatically rotate API keys"
              type="toggle"
            />
            <SettingItem
              label="Webhook Verification"
              description="Verify webhook signatures"
              type="toggle"
            />
            <SettingItem
              label="Audit Logging"
              description="Log all communication activities"
              type="toggle"
            />
          </div>
        </Card>
      </div>

      {/* Workflow Test Modal */}
      <WorkflowTestModal
        isOpen={showWorkflowTestModal}
        onClose={handleCloseTestModal}
        workflow={selectedWorkflowForTest}
        onRunTest={handleRunWorkflowTest}
      />
    </div>
  );
}

// Helper Components
function MetricCard({ title, value, change, trend, icon }: any) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {change} from last week
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded-full">
          {icon}
        </div>
      </div>
    </Card>
  );
}

function QuickActionButton({ icon, title, description, onClick, variant = "outline" }: any) {
  const getButtonClasses = () => {
    switch (variant) {
      case "destructive":
        return "p-4 border-2 border-red-200 bg-red-50 hover:bg-red-100 hover:shadow-md transition-all text-left";
      case "default":
        return "p-4 border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:shadow-md transition-all text-left";
      default:
        return "p-4 border rounded-lg hover:shadow-md transition-shadow text-left";
    }
  };

  const getIconBgClasses = () => {
    switch (variant) {
      case "destructive":
        return "p-2 bg-red-100 rounded-lg";
      case "default":
        return "p-2 bg-blue-100 rounded-lg";
      default:
        return "p-2 bg-blue-100 rounded-lg";
    }
  };

  return (
    <button
      onClick={onClick}
      className={getButtonClasses()}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={getIconBgClasses()}>
          {icon}
        </div>
        <h4 className="font-medium">{title}</h4>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}

function ActivityItem({ icon, message, time }: any) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      {icon}
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}

function SystemStatusItem({ name, status, responseTime }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{name}</span>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          status === 'operational' ? 'bg-green-500' :
          status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
        }`} />
        <span className="text-sm text-gray-600">{responseTime}</span>
      </div>
    </div>
  );
}


function MetricItem({ label, value, trend }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <span className={`font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {value}
      </span>
    </div>
  );
}

function LogEntry({ timestamp, level, message, details }: any) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs ${
            level === 'info' ? 'bg-blue-100 text-blue-800' :
            level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {level.toUpperCase()}
          </span>
          <span className="font-medium">{message}</span>
        </div>
        <span className="text-xs text-gray-500">{timestamp}</span>
      </div>
      <p className="text-sm text-gray-600">{details}</p>
    </div>
  );
}

function SettingItem({ label, description, type, value, options }: any) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <label className="font-medium">{label}</label>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div>
        {type === 'toggle' && (
          <input type="checkbox" className="rounded" />
        )}
        {type === 'select' && (
          <select className="px-3 py-1 border rounded">
            {options?.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
        {type === 'number' && (
          <input
            type="number"
            value={value}
            className="w-20 px-2 py-1 border rounded text-center"
          />
        )}
      </div>

    </div>
  );
}

