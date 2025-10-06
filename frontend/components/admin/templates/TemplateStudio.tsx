/**
 * 🎨 Template Studio
 *
 * Visual template management interface with three-pane layout:
 * - Left: Scenario selector and component assembly
 * - Center: Component editing and drag-drop canvas
 * - Right: Live preview with real-time updates
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseButton } from '@/components/ui/BaseButton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import {
  Plus,
  Save,
  Eye,
  Play,
  Settings,
  Copy,
  Trash2,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface EmailScenario {
  id: number;
  scenarioKey: string;
  name: string;
  description?: string;
  customerType: string;
  orderTypes: string[];
  priority: number;
  isActive: boolean;
  components: EmailScenarioComponent[];
  subjectTemplateId?: number | null;
  subjectTemplate?: EmailSubjectTemplate;
}

interface EmailScenarioComponent {
  id: number;
  componentId: number;
  order: number;
  component: EmailComponent;
}

interface EmailComponent {
  id: number;
  componentKey: string;
  name: string;
  type: string;
  template: string;
  conditions: any;
  dataMapping: any;
  required: boolean;
  isActive: boolean;
}

interface EmailSubjectTemplate {
  id: number;
  templateKey: string;
  template: string;
  placeholders: string[];
  maxLength: number;
  isActive: boolean;
}

export function TemplateStudio() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();

  const [scenarios, setScenarios] = useState<EmailScenario[]>([]);
  const [availableComponents, setAvailableComponents] = useState<EmailComponent[]>([]);
  const [availableSubjectTemplates, setAvailableSubjectTemplates] = useState<EmailSubjectTemplate[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<EmailScenario | null>(null);
  const [previewData, setPreviewData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCustomerType, setFilterCustomerType] = useState('all');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataLoadError, setDataLoadError] = useState<string | null>(null);

  // Load initial data only when authenticated
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      loadAllData();
    }
  }, [authLoading, user, isAdmin]);

  const loadAllData = async () => {
    setIsDataLoading(true);
    setDataLoadError(null);
    try {
      await Promise.all([
        loadScenarios(),
        loadAvailableComponents(),
        loadAvailableSubjectTemplates(),
        loadPreviewData()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      setDataLoadError('Failed to load template data. Please check your connection and try again.');
    } finally {
      setIsDataLoading(false);
    }
  };

  const loadScenarios = async () => {
    try {
      const response = await fetch('/api/admin/communication/templates/scenarios', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success) {
        setScenarios(data.data);
      } else {
        console.error('Failed to load scenarios:', data.error);
      }
    } catch (error) {
      console.error('Failed to load scenarios:', error);
      alert('Failed to load email scenarios. Please check your connection and try again.');
    }
  };

  const loadAvailableComponents = async () => {
    try {
      const response = await fetch('/api/admin/communication/templates/render-preview', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success) {
        setAvailableComponents(data.data.availableComponents || []);
      } else {
        console.error('Failed to load components:', data.error);
      }
    } catch (error) {
      console.error('Failed to load components:', error);
      setAvailableComponents([]);
    }
  };

  const loadAvailableSubjectTemplates = async () => {
    try {
      const response = await fetch('/api/admin/communication/templates/subjects', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success) {
        setAvailableSubjectTemplates(data.data || []);
      } else {
        console.error('Failed to load subject templates:', data.error);
      }
    } catch (error) {
      console.error('Failed to load subject templates:', error);
      setAvailableSubjectTemplates([]);
    }
  };

  const loadPreviewData = async () => {
    try {
      const response = await fetch('/api/admin/communication/templates/render-preview', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setPreviewData(data.data.testData);
      }
    } catch (error) {
      console.error('Failed to load preview data:', error);
    }
  };

  const createNewScenario = async () => {
    const newScenario: Partial<EmailScenario> = {
      scenarioKey: `scenario_${Date.now()}`,
      name: 'Nuevo Escenario',
      description: '',
      customerType: 'new',
      orderTypes: ['matpass'],
      priority: 0,
      isActive: true,
      components: [],
    };

    try {
      const response = await fetch('/api/admin/communication/templates/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newScenario),
      });

      const data = await response.json();
      if (data.success) {
        setScenarios(prev => [...prev, data.data]);
        setSelectedScenario(data.data);
      }
    } catch (error) {
      console.error('Failed to create scenario:', error);
    }
  };

  const updateScenario = async (scenarioId: number, updates: Partial<EmailScenario>) => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/admin/communication/templates/scenarios/${scenarioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (data.success) {
        setScenarios(prev => prev.map(s => s.id === scenarioId ? data.data : s));
        setSelectedScenario(data.data);
        console.log('✅ Scenario saved successfully');
      } else {
        console.error('Failed to save scenario:', data.error);
      }
    } catch (error) {
      console.error('Failed to update scenario:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteScenario = async (scenarioId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este escenario?')) return;

    try {
      const response = await fetch(`/api/admin/communication/templates/scenarios/${scenarioId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        setScenarios(prev => prev.filter(s => s.id !== scenarioId));
        if (selectedScenario?.id === scenarioId) {
          setSelectedScenario(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete scenario:', error);
    }
  };

  const duplicateScenario = async (scenarioId: number) => {
    const originalScenario = scenarios.find(s => s.id === scenarioId);
    if (!originalScenario) return;

    const duplicatedScenario: Partial<EmailScenario> = {
      scenarioKey: `${originalScenario.scenarioKey}_copy_${Date.now()}`,
      name: `${originalScenario.name} (Copia)`,
      description: originalScenario.description,
      customerType: originalScenario.customerType,
      orderTypes: [...originalScenario.orderTypes],
      priority: originalScenario.priority,
      isActive: false,
      subjectTemplateId: originalScenario.subjectTemplateId,
      componentIds: originalScenario.components.map(c => c.componentId),
    };

    try {
      const response = await fetch('/api/admin/communication/templates/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(duplicatedScenario),
      });

      const data = await response.json();
      if (data.success) {
        setScenarios(prev => [...prev, data.data]);
        setSelectedScenario(data.data);
      }
    } catch (error) {
      console.error('Failed to duplicate scenario:', error);
    }
  };

  const addComponentToScenario = async (scenarioId: number, componentId: number) => {
    if (!selectedScenario) return;

    const componentIds = [...selectedScenario.components.map(c => c.componentId), componentId];

    await updateScenario(scenarioId, {
      componentIds,
    } as any);
  };

  const removeComponentFromScenario = async (scenarioId: number, componentId: number) => {
    if (!selectedScenario) return;

    const componentIds = selectedScenario.components
      .filter(c => c.componentId !== componentId)
      .map(c => c.componentId);

    await updateScenario(scenarioId, {
      componentIds,
    } as any);
  };

  const reorderComponents = async (scenarioId: number, componentIds: number[]) => {
    await updateScenario(scenarioId, {
      componentIds,
    } as any);
  };

  const renderPreview = async (scenarioId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/communication/templates/render-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          scenarioId,
          customData: previewData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        const previewFrame = document.getElementById('preview-frame') as HTMLIFrameElement;
        if (previewFrame) {
          previewFrame.srcdoc = data.data.html;
        }
      }
    } catch (error) {
      console.error('Failed to render preview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination || !selectedScenario) return;

    const { source, destination, draggableId } = result;

    if (destination.droppableId !== 'scenario-components') return;

    if (source.droppableId === 'available-components' && destination.droppableId === 'scenario-components') {
      const componentId = parseInt(draggableId.replace('available-', ''));
      addComponentToScenario(selectedScenario.id, componentId);
    } else if (source.droppableId === 'scenario-components' && destination.droppableId === 'scenario-components') {
      if (source.index === destination.index) return;

      const components = Array.from(selectedScenario.components);
      const [reorderedItem] = components.splice(source.index, 1);
      components.splice(destination.index, 0, reorderedItem);

      const componentIds = components.map(c => c.componentId);
      reorderComponents(selectedScenario.id, componentIds);
    }
  };

  const filteredScenarios = scenarios.filter(scenario => {
    const matchesSearch = scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scenario.scenarioKey.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCustomerType = filterCustomerType === 'all' || scenario.customerType === filterCustomerType;
    return matchesSearch && matchesCustomerType;
  });

  // Show loading state while authentication is being checked
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Template Studio...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated or not admin
  if (!user || !isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">
            You need to be logged in as an administrator to access the Template Studio.
          </p>
        </div>
      </div>
    );
  }

  // Show data loading state
  if (isDataLoading || dataLoadError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          {isDataLoading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Template Studio data...</p>
              <p className="text-sm text-gray-500 mt-2">Fetching scenarios, components, and templates</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Data</h2>
              <p className="text-gray-600 mb-4">{dataLoadError}</p>
              <BaseButton onClick={loadAllData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Loading
              </BaseButton>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-screen flex bg-gray-50">
        {/* Left Panel: Scenario Selector & Component Assembly */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Scenario Selector */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Escenarios</h3>
              <BaseButton onClick={createNewScenario} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo
              </BaseButton>
            </div>

            {/* Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Buscar escenarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterCustomerType} onValueChange={setFilterCustomerType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="new">Nuevo</SelectItem>
                  <SelectItem value="existing">Existente</SelectItem>
                  <SelectItem value="both">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Scenario List */}
          <div className="flex-1 overflow-y-auto">
            {filteredScenarios
              .filter(scenario => scenario && scenario.id && scenario.name)
              .map((scenario) => (
              <div
                key={scenario.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedScenario?.id === scenario.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => setSelectedScenario(scenario)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                    <p className="text-sm text-gray-500">{scenario.scenarioKey}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {scenario.customerType}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {scenario.components.length} componentes
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <BaseButton
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateScenario(scenario.id);
                      }}
                      title="Duplicar escenario"
                    >
                      <Copy className="w-3 h-3" />
                    </BaseButton>
                    <BaseButton
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteScenario(scenario.id);
                      }}
                      title="Eliminar escenario"
                    >
                      <Trash2 className="w-3 h-3" />
                    </BaseButton>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Component Palette */}
          <div className="p-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Componentes Disponibles</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <Droppable droppableId="available-components" type="component">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {availableComponents
                      .filter(component => component && component.id && component.name)
                      .map((component, index) => (
                      <Draggable
                        key={component.id}
                        draggableId={`available-${component.id}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-2 bg-gray-50 rounded border border-gray-200 cursor-move hover:bg-gray-100 ${
                              snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-3 h-3 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium">{component.name}</p>
                                <p className="text-xs text-gray-500">{component.type}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>

        {/* Center Panel: Component Assembly & Editing */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedScenario ? (
            <>
              {/* Scenario Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedScenario?.name || 'Sin nombre'}</h2>
                    <p className="text-gray-600 mt-1">{selectedScenario?.description || 'Sin descripción'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <BaseButton
                      variant="outline"
                      onClick={() => selectedScenario && renderPreview(selectedScenario.id)}
                      disabled={isLoading || !selectedScenario}
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Eye className="w-4 h-4 mr-2" />
                      )}
                      Vista Previa
                    </BaseButton>
                    <BaseButton onClick={() => setIsPreviewMode(!isPreviewMode)}>
                      {isPreviewMode ? (
                        <Settings className="w-4 h-4 mr-2" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      {isPreviewMode ? 'Editar' : 'Vista Previa'}
                    </BaseButton>
                    <BaseButton
                      onClick={() => selectedScenario && updateScenario(selectedScenario.id, selectedScenario)}
                      disabled={isSaving || !selectedScenario}
                    >
                      {isSaving ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {isSaving ? 'Guardando...' : 'Guardar'}
                    </BaseButton>
                  </div>
                </div>

                {/* Scenario Settings */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Cliente
                    </label>
                    <Select
                      value={selectedScenario?.customerType || 'new'}
                      onValueChange={(value) =>
                        selectedScenario && updateScenario(selectedScenario.id, { customerType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Nuevo</SelectItem>
                        <SelectItem value="existing">Existente</SelectItem>
                        <SelectItem value="both">Ambos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prioridad
                    </label>
                    <Input
                      type="number"
                      value={selectedScenario?.priority || 0}
                      onChange={(e) =>
                        selectedScenario && updateScenario(selectedScenario.id, { priority: parseInt(e.target.value) })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plantilla de Asunto
                    </label>
                    <Select
                      value={selectedScenario?.subjectTemplateId?.toString() || 'none'}
                      onValueChange={(value) =>
                        selectedScenario && updateScenario(selectedScenario.id, {
                          subjectTemplateId: value === 'none' ? null : parseInt(value)
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Ninguna</SelectItem>
                        {availableSubjectTemplates
                          .filter(template => template && template.id && template.templateKey)
                          .map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.templateKey}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <Select
                      value={selectedScenario?.isActive ? 'active' : 'inactive'}
                      onValueChange={(value) =>
                        selectedScenario && updateScenario(selectedScenario.id, { isActive: value === 'active' })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Component Assembly Canvas */}
              <div className="flex-1 p-6 overflow-y-auto">
                <Droppable droppableId="scenario-components">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-4 min-h-96 p-4 border-2 border-dashed rounded-lg ${
                        snapshot.isDraggingOver
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      {selectedScenario.components.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <Zap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium">Arrastra componentes aquí</p>
                          <p className="text-sm">Comienza a construir tu plantilla de email</p>
                        </div>
                      ) : (
                        selectedScenario.components
                          .filter(scenarioComponent => scenarioComponent && scenarioComponent.component)
                          .map((scenarioComponent, index) => (
                          <Draggable
                            key={scenarioComponent.id}
                            draggableId={`component-${scenarioComponent.componentId}`}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`p-4 bg-white border rounded-lg shadow-sm ${
                                  snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div {...provided.dragHandleProps}>
                                      <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-gray-900">
                                        {scenarioComponent?.component?.name || 'Componente desconocido'}
                                      </h4>
                                      <p className="text-sm text-gray-500">
                                        {scenarioComponent?.component?.type || 'Tipo desconocido'}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      Orden: {scenarioComponent.order}
                                    </Badge>
                                    <BaseButton
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        removeComponentFromScenario(
                                          selectedScenario.id,
                                          scenarioComponent.componentId
                                        )
                                      }
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </BaseButton>
                                  </div>
                                </div>

                                {/* Component Content Preview */}
                                <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                                  <pre className="whitespace-pre-wrap font-mono text-xs">
                                    {scenarioComponent.component.template.substring(0, 200)}
                                    {scenarioComponent.component.template.length > 200 && '...'}
                                  </pre>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Settings className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Selecciona un Escenario
                </h3>
                <p className="text-gray-600">
                  Elige un escenario de la lista para comenzar a editar
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Live Preview */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Vista Previa</h3>
            <p className="text-sm text-gray-600 mt-1">
              Vista en tiempo real de tu plantilla
            </p>
          </div>

          <div className="flex-1 p-4">
            {selectedScenario ? (
              <div className="space-y-4">
                {/* Subject Preview */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Asunto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedScenario?.subjectTemplate ? (
                      <p className="text-sm font-medium">
                        {selectedScenario.subjectTemplate.template}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No se ha seleccionado una plantilla de asunto
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Email Preview */}
                <Card className="flex-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Contenido del Email</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 rounded-lg overflow-hidden">
                      <iframe
                        id="preview-frame"
                        className="w-full h-96 border-0"
                        title="Email Preview"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Preview Data */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Datos de Prueba</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-medium">Nombre:</span> {previewData?.customerName || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {previewData?.customerEmail || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Orden:</span> {previewData?.orderNumber || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> ${previewData?.totalAmount || '0.00'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Selecciona un escenario para ver la vista previa</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}