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
  Users, 
  ShoppingCart,
  Calendar,
  Package,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  description: string;
  customerType: 'new' | 'existing' | 'both';
  orderTypes: string[];
  components: string[];
  subjectTemplate: string;
  priority: number;
  isActive: boolean;
}

interface ScenarioManagerProps {
  language: 'en' | 'es';
}

export function ScenarioManager({ language }: ScenarioManagerProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [showForm, setShowForm] = useState(false);

  const translations = {
    en: {
      title: 'Email Scenarios',
      description: 'Manage email scenarios that determine which components to use based on order type and customer status',
      addScenario: 'Add Scenario',
      editScenario: 'Edit Scenario',
      scenarioName: 'Scenario Name',
      scenarioDescription: 'Description',
      customerType: 'Customer Type',
      orderTypes: 'Order Types',
      components: 'Components',
      subjectTemplate: 'Subject Template',
      priority: 'Priority',
      isActive: 'Active',
      actions: 'Actions',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      newCustomer: 'New Customer',
      existingCustomer: 'Existing Customer',
      both: 'Both',
      matpass: 'MatPass',
      booking: 'Booking',
      product: 'Product',
      noScenarios: 'No scenarios found',
      loading: 'Loading scenarios...'
    },
    es: {
      title: 'Escenarios de Email',
      description: 'Gestiona escenarios de email que determinan qué componentes usar según el tipo de pedido y estado del cliente',
      addScenario: 'Agregar Escenario',
      editScenario: 'Editar Escenario',
      scenarioName: 'Nombre del Escenario',
      scenarioDescription: 'Descripción',
      customerType: 'Tipo de Cliente',
      orderTypes: 'Tipos de Pedido',
      components: 'Componentes',
      subjectTemplate: 'Plantilla de Asunto',
      priority: 'Prioridad',
      isActive: 'Activo',
      actions: 'Acciones',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      newCustomer: 'Cliente Nuevo',
      existingCustomer: 'Cliente Existente',
      both: 'Ambos',
      matpass: 'MatPass',
      booking: 'Reserva',
      product: 'Producto',
      noScenarios: 'No se encontraron escenarios',
      loading: 'Cargando escenarios...'
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockScenarios: Scenario[] = [
        {
          id: 'new_customer_matpass_only',
          name: language === 'es' ? 'Cliente Nuevo - Solo MatPass' : 'New Customer - MatPass Only',
          description: language === 'es' ? 'Email de bienvenida para clientes nuevos que compran solo MatPass' : 'Welcome email for new customers purchasing only MatPass',
          customerType: 'new',
          orderTypes: ['matpass'],
          components: ['welcome_header', 'matpass_info', 'order_summary', 'next_steps', 'standard_footer'],
          subjectTemplate: 'new_customer_matpass',
          priority: 100,
          isActive: true
        },
        {
          id: 'existing_customer_matpass_only',
          name: language === 'es' ? 'Cliente Existente - Solo MatPass' : 'Existing Customer - MatPass Only',
          description: language === 'es' ? 'Email de renovación para clientes existentes que compran solo MatPass' : 'Renewal email for existing customers purchasing only MatPass',
          customerType: 'existing',
          orderTypes: ['matpass'],
          components: ['renewal_header', 'matpass_info', 'order_summary', 'reminders', 'next_steps', 'standard_footer'],
          subjectTemplate: 'existing_customer_matpass',
          priority: 95,
          isActive: true
        }
      ];
      setScenarios(mockScenarios);
    } catch (error) {
      console.error('Error loading scenarios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (scenario: Scenario) => {
    setEditingScenario(scenario);
    setShowForm(true);
  };

  const handleDelete = async (scenarioId: string) => {
    if (confirm(t.delete + '?')) {
      try {
        // API call to delete scenario
        setScenarios(scenarios.filter(s => s.id !== scenarioId));
      } catch (error) {
        console.error('Error deleting scenario:', error);
      }
    }
  };

  const handleSave = async (scenario: Scenario) => {
    try {
      // API call to save scenario
      if (editingScenario) {
        setScenarios(scenarios.map(s => s.id === scenario.id ? scenario : s));
      } else {
        setScenarios([...scenarios, scenario]);
      }
      setShowForm(false);
      setEditingScenario(null);
    } catch (error) {
      console.error('Error saving scenario:', error);
    }
  };

  const getCustomerTypeIcon = (type: string) => {
    switch (type) {
      case 'new': return <Users className="text-green-500" size={16} />;
      case 'existing': return <Users className="text-blue-500" size={16} />;
      case 'both': return <Users className="text-purple-500" size={16} />;
      default: return <Users size={16} />;
    }
  };

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case 'matpass': return <Package className="text-green-500" size={16} />;
      case 'booking': return <Calendar className="text-blue-500" size={16} />;
      case 'product': return <ShoppingCart className="text-orange-500" size={16} />;
      default: return <Package size={16} />;
    }
  };

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
          {t.addScenario}
        </BaseButton>
      </div>

      {/* Scenarios List */}
      <div className="grid gap-4">
        {scenarios.length === 0 ? (
          <Card className="p-6 text-center">
            <AlertCircle className="mx-auto text-gray-400 mb-2" size={24} />
            <p className="text-gray-600">{t.noScenarios}</p>
          </Card>
        ) : (
          scenarios.map((scenario) => (
            <Card key={scenario.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{scenario.name}</h3>
                    {scenario.isActive ? (
                      <CheckCircle className="text-green-500" size={16} />
                    ) : (
                      <AlertCircle className="text-gray-400" size={16} />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{scenario.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      {getCustomerTypeIcon(scenario.customerType)}
                      <span>{t[scenario.customerType as keyof typeof t]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {scenario.orderTypes.map(type => (
                        <div key={type} className="flex items-center gap-1">
                          {getOrderTypeIcon(type)}
                          <span>{t[type as keyof typeof t]}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Priority: {scenario.priority}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <BaseButton
                    onClick={() => handleEdit(scenario)}
                    className="dashboard-button-secondary"
                    size="sm"
                  >
                    <Edit size={14} />
                  </BaseButton>
                  <BaseButton
                    onClick={() => handleDelete(scenario.id)}
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

      {/* Scenario Form Modal */}
      {showForm && (
        <ScenarioForm
          scenario={editingScenario}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingScenario(null);
          }}
          language={language}
          translations={t}
        />
      )}
    </div>
  );
}

interface ScenarioFormProps {
  scenario?: Scenario | null;
  onSave: (scenario: Scenario) => void;
  onCancel: () => void;
  language: 'en' | 'es';
  translations: any;
}

function ScenarioForm({ scenario, onSave, onCancel, language, translations: t }: ScenarioFormProps) {
  const [formData, setFormData] = useState<Scenario>({
    id: scenario?.id || '',
    name: scenario?.name || '',
    description: scenario?.description || '',
    customerType: scenario?.customerType || 'new',
    orderTypes: scenario?.orderTypes || [],
    components: scenario?.components || [],
    subjectTemplate: scenario?.subjectTemplate || '',
    priority: scenario?.priority || 0,
    isActive: scenario?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              {scenario ? t.editScenario : t.addScenario}
            </h3>
            <BaseButton onClick={onCancel} className="dashboard-button-secondary">
              <X size={16} />
            </BaseButton>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="dashboard-label">{t.scenarioName}</Label>
              <BaseInput
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="dashboard-input"
                required
              />
            </div>

            <div>
              <Label className="dashboard-label">{t.description}</Label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="dashboard-input h-20 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="dashboard-label">{t.customerType}</Label>
                <Select
                  value={formData.customerType}
                  onValueChange={(value) => setFormData({ ...formData, customerType: value as any })}
                >
                  <SelectTrigger className="dashboard-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">{t.newCustomer}</SelectItem>
                    <SelectItem value="existing">{t.existingCustomer}</SelectItem>
                    <SelectItem value="both">{t.both}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="dashboard-label">{t.priority}</Label>
                <BaseInput
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="dashboard-input"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label>{t.isActive}</Label>
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
