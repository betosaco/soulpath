'use client';

import { useState, useEffect } from 'react';
import { Card } from '../../ui/card';
import { BaseButton } from '../../ui/BaseButton';
import { BaseInput } from '../../ui/BaseInput';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Code, 
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Layers,
  FileText,
  Settings,
  Home
} from 'lucide-react';

interface Component {
  id: string;
  name: string;
  type: 'header' | 'content' | 'section' | 'footer';
  template: string;
  conditions: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  order: number;
  dataMapping: { [key: string]: string };
  required: boolean;
  isActive: boolean;
}

interface ComponentManagerProps {
  language: 'en' | 'es';
}

export function ComponentManager({ language }: ComponentManagerProps) {
  const [components, setComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const translations = {
    en: {
      title: 'Email Components',
      description: 'Manage reusable email components that can be combined to create different email scenarios',
      addComponent: 'Add Component',
      editComponent: 'Edit Component',
      componentName: 'Component Name',
      type: 'Type',
      template: 'Template',
      conditions: 'Conditions',
      dataMapping: 'Data Mapping',
      order: 'Order',
      required: 'Required',
      isActive: 'Active',
      actions: 'Actions',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      preview: 'Preview',
      closePreview: 'Close Preview',
      header: 'Header',
      content: 'Content',
      section: 'Section',
      footer: 'Footer',
      all: 'All Types',
      noComponents: 'No components found',
      loading: 'Loading components...',
      templatePlaceholder: 'Enter your HTML template here...',
      conditionField: 'Field',
      conditionOperator: 'Operator',
      conditionValue: 'Value',
      addCondition: 'Add Condition',
      removeCondition: 'Remove Condition',
      mappingKey: 'Placeholder',
      mappingValue: 'Data Path',
      addMapping: 'Add Mapping',
      removeMapping: 'Remove Mapping'
    },
    es: {
      title: 'Componentes de Email',
      description: 'Gestiona componentes de email reutilizables que se pueden combinar para crear diferentes escenarios de email',
      addComponent: 'Agregar Componente',
      editComponent: 'Editar Componente',
      componentName: 'Nombre del Componente',
      type: 'Tipo',
      template: 'Plantilla',
      conditions: 'Condiciones',
      dataMapping: 'Mapeo de Datos',
      order: 'Orden',
      required: 'Requerido',
      isActive: 'Activo',
      actions: 'Acciones',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      preview: 'Vista Previa',
      closePreview: 'Cerrar Vista Previa',
      header: 'Encabezado',
      content: 'Contenido',
      section: 'Sección',
      footer: 'Pie de Página',
      all: 'Todos los Tipos',
      noComponents: 'No se encontraron componentes',
      loading: 'Cargando componentes...',
      templatePlaceholder: 'Ingresa tu plantilla HTML aquí...',
      conditionField: 'Campo',
      conditionOperator: 'Operador',
      conditionValue: 'Valor',
      addCondition: 'Agregar Condición',
      removeCondition: 'Eliminar Condición',
      mappingKey: 'Marcador de Posición',
      mappingValue: 'Ruta de Datos',
      addMapping: 'Agregar Mapeo',
      removeMapping: 'Eliminar Mapeo'
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockComponents: Component[] = [
        {
          id: 'welcome_header',
          name: language === 'es' ? 'Encabezado de Bienvenida' : 'Welcome Header',
          type: 'header',
          template: `<div class="header" style="background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1>🧘‍♀️ MATMAX WELLNESS STUDIO</h1>
            <h2>¡Bienvenido a tu Viaje de Bienestar!</h2>
            <p>Tu MatPass está listo y activo</p>
          </div>`,
          conditions: [
            { field: 'isNewCustomer', operator: 'equals', value: true }
          ],
          order: 1,
          dataMapping: {
            userName: 'customerName'
          },
          required: true,
          isActive: true
        },
        {
          id: 'matpass_info',
          name: language === 'es' ? 'Información de MatPass' : 'MatPass Information',
          type: 'content',
          template: `<div class="matpass-info" style="background: #e8f5e9; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #4a7c2e;">
            <h4>📱 Tu MatPass:</h4>
            <p><strong>Tipo:</strong> {{matpassType}}</p>
            <p><strong>Descripción:</strong> {{matpassDescription}}</p>
            <p><strong>Válido desde:</strong> {{matpassStartDate}}</p>
            <p><strong>Válido hasta:</strong> {{matpassEndDate}}</p>
            <p><strong>Total de sesiones:</strong> {{matpassSessions}} sesiones</p>
          </div>`,
          conditions: [
            { field: 'matpassItems', operator: 'exists', value: true }
          ],
          order: 2,
          dataMapping: {
            matpassType: 'matpassItems.0.name',
            matpassDescription: 'matpassItems.0.description',
            matpassStartDate: 'matpassStartDate',
            matpassEndDate: 'matpassItems.0.expiryDate',
            matpassSessions: 'matpassItems.0.sessions'
          },
          required: false,
          isActive: true
        }
      ];
      setComponents(mockComponents);
    } catch (error) {
      console.error('Error loading components:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (component: Component) => {
    setEditingComponent(component);
    setShowForm(true);
  };

  const handleDelete = async (componentId: string) => {
    if (confirm(t.delete + '?')) {
      try {
        setComponents(components.filter(c => c.id !== componentId));
      } catch (error) {
        console.error('Error deleting component:', error);
      }
    }
  };

  const handleSave = async (component: Component) => {
    try {
      if (editingComponent) {
        setComponents(components.map(c => c.id === component.id ? component : c));
      } else {
        setComponents([...components, component]);
      }
      setShowForm(false);
      setEditingComponent(null);
    } catch (error) {
      console.error('Error saving component:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'header': return <Home className="text-blue-500" size={16} />;
      case 'content': return <FileText className="text-green-500" size={16} />;
      case 'section': return <Layers className="text-orange-500" size={16} />;
      case 'footer': return <Settings className="text-gray-500" size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const filteredComponents = filterType === 'all' 
    ? components 
    : components.filter(c => c.type === filterType);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">{t.loading}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{t.title}</h2>
          <p className="text-gray-600 mt-1">{t.description}</p>
        </div>
        <BaseButton
          onClick={() => setShowForm(true)}
          className="dashboard-button-primary"
        >
          <Plus size={16} className="mr-2" />
          {t.addComponent}
        </BaseButton>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Label className="text-sm font-medium">Filter by type:</Label>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            <SelectItem value="header">{t.header}</SelectItem>
            <SelectItem value="content">{t.content}</SelectItem>
            <SelectItem value="section">{t.section}</SelectItem>
            <SelectItem value="footer">{t.footer}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Components List */}
      <div className="grid gap-4">
        {filteredComponents.length === 0 ? (
          <Card className="p-6 text-center">
            <AlertCircle className="mx-auto text-gray-400 mb-2" size={24} />
            <p className="text-gray-600">{t.noComponents}</p>
          </Card>
        ) : (
          filteredComponents.map((component) => (
            <Card key={component.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getTypeIcon(component.type)}
                    <h3 className="font-semibold text-gray-900">{component.name}</h3>
                    {component.isActive ? (
                      <CheckCircle className="text-green-500" size={16} />
                    ) : (
                      <AlertCircle className="text-gray-400" size={16} />
                    )}
                    {component.required && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span>Type: {t[component.type]}</span>
                    <span>Order: {component.order}</span>
                    <span>Conditions: {component.conditions.length}</span>
                    <span>Mappings: {Object.keys(component.dataMapping).length}</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded text-sm font-mono text-gray-600 max-h-20 overflow-hidden">
                    {component.template.substring(0, 200)}...
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <BaseButton
                    onClick={() => setShowPreview(component.id)}
                    className="dashboard-button-secondary"
                    size="sm"
                  >
                    <Eye size={14} />
                  </BaseButton>
                  <BaseButton
                    onClick={() => handleEdit(component)}
                    className="dashboard-button-secondary"
                    size="sm"
                  >
                    <Edit size={14} />
                  </BaseButton>
                  <BaseButton
                    onClick={() => handleDelete(component.id)}
                    className="dashboard-button-danger"
                    size="sm"
                  >
                    <Trash2 size={14} />
                  </BaseButton>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Component Form Modal */}
      {showForm && (
        <ComponentForm
          component={editingComponent}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingComponent(null);
          }}
          language={language}
          translations={t}
        />
      )}

      {/* Preview Modal */}
      {showPreview && (
        <ComponentPreview
          component={components.find(c => c.id === showPreview)}
          onClose={() => setShowPreview(null)}
          language={language}
          translations={t}
        />
      )}
    </div>
  );
}

interface ComponentFormProps {
  component?: Component | null;
  onSave: (component: Component) => void;
  onCancel: () => void;
  language: 'en' | 'es';
  translations: any;
}

function ComponentForm({ component, onSave, onCancel, language, translations: t }: ComponentFormProps) {
  const [formData, setFormData] = useState<Component>({
    id: component?.id || '',
    name: component?.name || '',
    type: component?.type || 'content',
    template: component?.template || '',
    conditions: component?.conditions || [],
    order: component?.order || 0,
    dataMapping: component?.dataMapping || {},
    required: component?.required || false,
    isActive: component?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [...formData.conditions, { field: '', operator: 'equals', value: '' }]
    });
  };

  const removeCondition = (index: number) => {
    setFormData({
      ...formData,
      conditions: formData.conditions.filter((_, i) => i !== index)
    });
  };

  const updateCondition = (index: number, field: string, value: any) => {
    const newConditions = [...formData.conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setFormData({ ...formData, conditions: newConditions });
  };

  const addMapping = () => {
    setFormData({
      ...formData,
      dataMapping: { ...formData.dataMapping, '': '' }
    });
  };

  const removeMapping = (key: string) => {
    const newMapping = { ...formData.dataMapping };
    delete newMapping[key];
    setFormData({ ...formData, dataMapping: newMapping });
  };

  const updateMapping = (oldKey: string, newKey: string, newValue: string) => {
    const newMapping = { ...formData.dataMapping };
    delete newMapping[oldKey];
    newMapping[newKey] = newValue;
    setFormData({ ...formData, dataMapping: newMapping });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              {component ? t.editComponent : t.addComponent}
            </h3>
            <BaseButton onClick={onCancel} className="dashboard-button-secondary">
              <X size={16} />
            </BaseButton>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="dashboard-label">{t.componentName}</Label>
                <BaseInput
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="dashboard-input"
                  required
                />
              </div>
              <div>
                <Label className="dashboard-label">{t.type}</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                >
                  <SelectTrigger className="dashboard-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header">{t.header}</SelectItem>
                    <SelectItem value="content">{t.content}</SelectItem>
                    <SelectItem value="section">{t.section}</SelectItem>
                    <SelectItem value="footer">{t.footer}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="dashboard-label">{t.template}</Label>
              <textarea
                value={formData.template}
                onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                className="dashboard-input h-40 resize-none font-mono text-sm"
                placeholder={t.templatePlaceholder}
                required
              />
            </div>

            <div>
              <Label className="dashboard-label">{t.conditions}</Label>
              <div className="space-y-2">
                {formData.conditions.map((condition, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <BaseInput
                      value={condition.field}
                      onChange={(e) => updateCondition(index, 'field', e.target.value)}
                      placeholder={t.conditionField}
                      className="dashboard-input flex-1"
                    />
                    <Select
                      value={condition.operator}
                      onValueChange={(value) => updateCondition(index, 'operator', value)}
                    >
                      <SelectTrigger className="dashboard-input w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">equals</SelectItem>
                        <SelectItem value="not_equals">not equals</SelectItem>
                        <SelectItem value="exists">exists</SelectItem>
                        <SelectItem value="contains">contains</SelectItem>
                      </SelectContent>
                    </Select>
                    <BaseInput
                      value={condition.value}
                      onChange={(e) => updateCondition(index, 'value', e.target.value)}
                      placeholder={t.conditionValue}
                      className="dashboard-input flex-1"
                    />
                    <BaseButton
                      type="button"
                      onClick={() => removeCondition(index)}
                      className="dashboard-button-danger"
                      size="sm"
                    >
                      <X size={14} />
                    </BaseButton>
                  </div>
                ))}
                <BaseButton
                  type="button"
                  onClick={addCondition}
                  className="dashboard-button-secondary"
                  size="sm"
                >
                  <Plus size={14} className="mr-2" />
                  {t.addCondition}
                </BaseButton>
              </div>
            </div>

            <div>
              <Label className="dashboard-label">{t.dataMapping}</Label>
              <div className="space-y-2">
                {Object.entries(formData.dataMapping).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <BaseInput
                      value={key}
                      onChange={(e) => updateMapping(key, e.target.value, value)}
                      placeholder={t.mappingKey}
                      className="dashboard-input flex-1"
                    />
                    <BaseInput
                      value={value}
                      onChange={(e) => updateMapping(key, key, e.target.value)}
                      placeholder={t.mappingValue}
                      className="dashboard-input flex-1"
                    />
                    <BaseButton
                      type="button"
                      onClick={() => removeMapping(key)}
                      className="dashboard-button-danger"
                      size="sm"
                    >
                      <X size={14} />
                    </BaseButton>
                  </div>
                ))}
                <BaseButton
                  type="button"
                  onClick={addMapping}
                  className="dashboard-button-secondary"
                  size="sm"
                >
                  <Plus size={14} className="mr-2" />
                  {t.addMapping}
                </BaseButton>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="dashboard-label">{t.order}</Label>
                <BaseInput
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="dashboard-input"
                />
              </div>
              <div className="flex items-center gap-4">
                <Switch
                  checked={formData.required}
                  onCheckedChange={(checked) => setFormData({ ...formData, required: checked })}
                />
                <Label>{t.required}</Label>
              </div>
              <div className="flex items-center gap-4">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label>{t.isActive}</Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <BaseButton type="button" onClick={onCancel} className="dashboard-button-secondary">
                {t.cancel}
              </BaseButton>
              <BaseButton type="submit" className="dashboard-button-primary">
                <Save size={16} className="mr-2" />
                {t.save}
              </BaseButton>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

interface ComponentPreviewProps {
  component?: Component;
  onClose: () => void;
  language: 'en' | 'es';
  translations: any;
}

function ComponentPreview({ component, onClose, language, translations: t }: ComponentPreviewProps) {
  if (!component) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">{t.preview}: {component.name}</h3>
            <BaseButton onClick={onClose} className="dashboard-button-secondary">
              <X size={16} />
            </BaseButton>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="dashboard-label">HTML Template</Label>
              <div className="bg-gray-50 p-4 rounded border max-h-60 overflow-auto">
                <pre className="text-sm font-mono text-gray-700 whitespace-pre-wrap">
                  {component.template}
                </pre>
              </div>
            </div>

            <div>
              <Label className="dashboard-label">Rendered Preview</Label>
              <div className="border rounded p-4 bg-white">
                <div dangerouslySetInnerHTML={{ __html: component.template }} />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
