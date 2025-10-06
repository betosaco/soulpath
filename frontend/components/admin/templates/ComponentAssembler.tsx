/**
 * 🧩 Component Assembler
 *
 * Drag-and-drop interface for assembling email template components.
 * Provides visual component management with reordering and editing capabilities.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  GripVertical,
  Trash2,
  Edit3,
  Eye,
  Code,
  Zap,
  Plus,
  Save,
  X,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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

interface ComponentAssemblerProps {
  scenarioId: number;
  components: EmailScenarioComponent[];
  availableComponents: EmailComponent[];
  onComponentAdd: (componentId: number) => void;
  onComponentRemove: (scenarioComponentId: number) => void;
  onComponentReorder: (componentIds: number[]) => void;
  onComponentEdit?: (component: EmailComponent) => void;
}

export function ComponentAssembler({
  scenarioId,
  components,
  availableComponents,
  onComponentAdd,
  onComponentRemove,
  onComponentReorder,
  onComponentEdit,
}: ComponentAssemblerProps) {
  const [editingComponent, setEditingComponent] = useState<EmailComponent | null>(null);
  const [showComponentPalette, setShowComponentPalette] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState<EmailComponent | null>(null);

  // Handle drag end
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === 'available-components' && destination.droppableId === 'scenario-components') {
      // Adding component to scenario
      const componentId = parseInt(draggableId.replace('available-', ''));
      onComponentAdd(componentId);
    } else if (source.droppableId === 'scenario-components' && destination.droppableId === 'scenario-components') {
      // Reordering components
      const reorderedComponents = Array.from(components);
      const [removed] = reorderedComponents.splice(source.index, 1);
      reorderedComponents.splice(destination.index, 0, removed);

      const componentIds = reorderedComponents.map(c => c.componentId);
      onComponentReorder(componentIds);
    }
  };

  // Move component up/down
  const moveComponent = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= components.length) return;

    const reorderedComponents = Array.from(components);
    [reorderedComponents[index], reorderedComponents[newIndex]] = [
      reorderedComponents[newIndex],
      reorderedComponents[index],
    ];

    const componentIds = reorderedComponents.map(c => c.componentId);
    onComponentReorder(componentIds);
  };

  // Component editing modal
  const ComponentEditor = ({ component, onSave, onCancel }: {
    component: EmailComponent;
    onSave: (updatedComponent: EmailComponent) => void;
    onCancel: () => void;
  }) => {
    const [editedComponent, setEditedComponent] = useState(component);

    const handleSave = () => {
      onSave(editedComponent);
      onCancel();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Editar Componente: {component.name}
              </h3>
              <BaseButton variant="ghost" onClick={onCancel}>
                <X className="w-5 h-5" />
              </BaseButton>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Componente
                </label>
                <Input
                  value={editedComponent.name}
                  onChange={(e) => setEditedComponent(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  value={editedComponent.type}
                  onChange={(e) => setEditedComponent(prev => ({
                    ...prev,
                    type: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="header">Encabezado</option>
                  <option value="content">Contenido</option>
                  <option value="section">Sección</option>
                  <option value="footer">Pie de página</option>
                  <option value="sidebar">Barra lateral</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plantilla HTML
                </label>
                <Textarea
                  value={editedComponent.template}
                  onChange={(e) => setEditedComponent(prev => ({
                    ...prev,
                    template: e.target.value
                  }))}
                  rows={10}
                  className="font-mono text-sm"
                  placeholder="<div>Hola {{userName}},...</div>"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Usa {{placeholders}} para datos dinámicos
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={editedComponent.required}
                  onChange={(e) => setEditedComponent(prev => ({
                    ...prev,
                    required: e.target.checked
                  }))}
                />
                <label htmlFor="required" className="text-sm text-gray-700">
                  Componente requerido
                </label>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
            <BaseButton variant="outline" onClick={onCancel}>
              Cancelar
            </BaseButton>
            <BaseButton onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </BaseButton>
          </div>
        </div>
      </div>
    );
  };

  const getComponentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      header: 'bg-blue-100 text-blue-800',
      content: 'bg-green-100 text-green-800',
      section: 'bg-purple-100 text-purple-800',
      footer: 'bg-gray-100 text-gray-800',
      sidebar: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getComponentTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      header: '📋',
      content: '📝',
      section: '📦',
      footer: '📄',
      sidebar: '📊',
    };
    return icons[type] || '📄';
  };

  return (
    <div className="h-full flex flex-col">
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Component Assembly Canvas */}
        <div className="flex-1">
          <Droppable droppableId="scenario-components">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`h-full p-6 space-y-4 border-2 border-dashed rounded-lg transition-colors ${
                  snapshot.isDraggingOver
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                {components.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Zap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">
                        Canvas Vacío
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Arrastra componentes desde la paleta para comenzar a construir tu plantilla
                      </p>
                      <BaseButton
                        onClick={() => setShowComponentPalette(true)}
                        variant="outline"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Componente
                      </BaseButton>
                    </div>
                  </div>
                ) : (
                  <>
                    {components.map((scenarioComponent, index) => (
                      <Draggable
                        key={scenarioComponent.id}
                        draggableId={`scenario-${scenarioComponent.componentId}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white border rounded-lg shadow-sm overflow-hidden transition-all ${
                              snapshot.isDragging
                                ? 'shadow-lg rotate-2 scale-105'
                                : 'hover:shadow-md'
                            }`}
                          >
                            {/* Component Header */}
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">
                                      {getComponentTypeIcon(scenarioComponent.component.type)}
                                    </span>
                                    <div>
                                      <h4 className="font-medium text-gray-900">
                                        {scenarioComponent.component.name}
                                      </h4>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge className={`text-xs ${getComponentTypeColor(scenarioComponent.component.type)}`}>
                                          {scenarioComponent.component.type}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                          Orden: {scenarioComponent.order}
                                        </Badge>
                                        {scenarioComponent.component.required && (
                                          <Badge variant="destructive" className="text-xs">
                                            Requerido
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1">
                                  <BaseButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => moveComponent(index, 'up')}
                                    disabled={index === 0}
                                  >
                                    <ChevronUp className="w-3 h-3" />
                                  </BaseButton>
                                  <BaseButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => moveComponent(index, 'down')}
                                    disabled={index === components.length - 1}
                                  >
                                    <ChevronDown className="w-3 h-3" />
                                  </BaseButton>
                                  <BaseButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onComponentEdit?.(scenarioComponent.component)}
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </BaseButton>
                                  <BaseButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onComponentRemove(scenarioComponent.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </BaseButton>
                                </div>
                              </div>
                            </div>

                            {/* Component Content Preview */}
                            <div className="p-4">
                              <div className="bg-gray-100 rounded p-3">
                                <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">
                                  {scenarioComponent.component.template.length > 300
                                    ? `${scenarioComponent.component.template.substring(0, 300)}...`
                                    : scenarioComponent.component.template
                                  }
                                </pre>
                              </div>

                              {/* Placeholder indicators */}
                              <div className="mt-3 flex flex-wrap gap-1">
                                {scenarioComponent.component.template.match(/\{\{(\w+)\}\}/g)?.map((match, idx) => {
                                  const placeholder = match.slice(2, -2);
                                  return (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {placeholder}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {/* Add Component Button */}
                    <div className="text-center pt-4">
                      <BaseButton
                        variant="outline"
                        onClick={() => setShowComponentPalette(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Componente
                      </BaseButton>
                    </div>
                  </>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

      {/* Component Palette Modal */}
      {showComponentPalette && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Agregar Componente
                </h3>
                <BaseButton variant="ghost" onClick={() => setShowComponentPalette(false)}>
                  <X className="w-5 h-5" />
                </BaseButton>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              <Droppable droppableId="available-components" isDropDisabled={true}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableComponents.map((component, index) => (
                        <Draggable
                          key={component.id}
                          draggableId={`available-${component.id}`}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-move transition-colors"
                              onClick={() => {
                                onComponentAdd(component.id);
                                setShowComponentPalette(false);
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">
                                  {getComponentTypeIcon(component.type)}
                                </span>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">
                                    {component.name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {component.componentKey}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge className={`text-xs ${getComponentTypeColor(component.type)}`}>
                                      {component.type}
                                    </Badge>
                                    {component.required && (
                                      <Badge variant="destructive" className="text-xs">
                                        Requerido
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3">
                                <pre className="text-xs font-mono text-gray-600 bg-gray-100 p-2 rounded whitespace-pre-wrap">
                                  {component.template.substring(0, 100)}
                                  {component.template.length > 100 && '...'}
                                </pre>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      )}

      {/* Component Editor Modal */}
      {editingComponent && (
        <ComponentEditor
          component={editingComponent}
          onSave={(updatedComponent) => {
            // Handle component update (would need API call)
            console.log('Updated component:', updatedComponent);
            setEditingComponent(null);
          }}
          onCancel={() => setEditingComponent(null)}
        />
      )}
    </div>
  );
}
