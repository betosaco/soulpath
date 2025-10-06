/**
 * 🎭 Scenario Builder
 *
 * Interactive scenario configuration interface with rules, conditions,
 * and priority settings for email template scenarios.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import {
  Plus,
  Trash2,
  Settings,
  Target,
  Users,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  X,
} from 'lucide-react';

interface ScenarioRule {
  id: string;
  type: 'customer_type' | 'order_type' | 'amount_range' | 'product_category' | 'custom_condition';
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: any;
  enabled: boolean;
}

interface ScenarioBuilderProps {
  scenario?: any;
  onSave: (scenario: any) => void;
  onCancel: () => void;
}

export function ScenarioBuilder({ scenario, onSave, onCancel }: ScenarioBuilderProps) {
  const [formData, setFormData] = useState({
    scenarioKey: scenario?.scenarioKey || '',
    name: scenario?.name || '',
    description: scenario?.description || '',
    customerType: scenario?.customerType || 'new',
    orderTypes: scenario?.orderTypes || ['matpass'],
    priority: scenario?.priority || 0,
    isActive: scenario?.isActive ?? true,
    rules: scenario?.rules || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Predefined options
  const customerTypes = [
    { value: 'new', label: 'Cliente Nuevo', description: 'Primer pedido del cliente' },
    { value: 'existing', label: 'Cliente Existente', description: 'Cliente con pedidos previos' },
    { value: 'both', label: 'Ambos', description: 'Nuevo y existente' },
  ];

  const orderTypes = [
    { value: 'matpass', label: 'MatPass', icon: '🧘' },
    { value: 'booking', label: 'Reservas', icon: '📅' },
    { value: 'product', label: 'Productos', icon: '🛍️' },
  ];

  const ruleTypes = [
    {
      value: 'customer_type',
      label: 'Tipo de Cliente',
      description: 'Nuevo vs Existente',
      icon: <Users className="w-4 h-4" />
    },
    {
      value: 'order_type',
      label: 'Tipo de Orden',
      description: 'MatPass, Reserva, Producto',
      icon: <ShoppingCart className="w-4 h-4" />
    },
    {
      value: 'amount_range',
      label: 'Rango de Monto',
      description: 'Monto mínimo/máximo',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      value: 'product_category',
      label: 'Categoría de Producto',
      description: 'Tipo específico de producto',
      icon: <Target className="w-4 h-4" />
    },
  ];

  const addRule = () => {
    const newRule: ScenarioRule = {
      id: `rule_${Date.now()}`,
      type: 'customer_type',
      operator: 'equals',
      value: 'new',
      enabled: true,
    };

    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, newRule],
    }));
  };

  const updateRule = (ruleId: string, updates: Partial<ScenarioRule>) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.map(rule =>
        rule.id === ruleId ? { ...rule, ...updates } : rule
      ),
    }));
  };

  const removeRule = (ruleId: string) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter(rule => rule.id !== ruleId),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.scenarioKey.trim()) {
      newErrors.scenarioKey = 'La clave del escenario es requerida';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del escenario es requerido';
    }

    if (formData.orderTypes.length === 0) {
      newErrors.orderTypes = 'Debes seleccionar al menos un tipo de orden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    // Convert form data to scenario format
    const scenarioData = {
      ...formData,
      // Add any additional processing here
    };

    onSave(scenarioData);
  };

  const handleOrderTypeChange = (orderType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      orderTypes: checked
        ? [...prev.orderTypes, orderType]
        : prev.orderTypes.filter(type => type !== orderType),
    }));
  };

  const renderRuleValueInput = (rule: ScenarioRule) => {
    switch (rule.type) {
      case 'customer_type':
        return (
          <Select
            value={rule.value}
            onValueChange={(value) => updateRule(rule.id, { value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Nuevo</SelectItem>
              <SelectItem value="existing">Existente</SelectItem>
            </SelectContent>
          </Select>
        );

      case 'order_type':
        return (
          <Select
            value={rule.value}
            onValueChange={(value) => updateRule(rule.id, { value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {orderTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'amount_range':
        return (
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={rule.value?.min || ''}
              onChange={(e) => updateRule(rule.id, {
                value: { ...rule.value, min: parseFloat(e.target.value) }
              })}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Max"
              value={rule.value?.max || ''}
              onChange={(e) => updateRule(rule.id, {
                value: { ...rule.value, max: parseFloat(e.target.value) }
              })}
              className="flex-1"
            />
          </div>
        );

      case 'product_category':
        return (
          <Input
            placeholder="Categoría de producto"
            value={rule.value || ''}
            onChange={(e) => updateRule(rule.id, { value: e.target.value })}
          />
        );

      default:
        return (
          <Input
            placeholder="Valor"
            value={rule.value || ''}
            onChange={(e) => updateRule(rule.id, { value: e.target.value })}
          />
        );
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'text-red-600 bg-red-50 border-red-200';
    if (priority >= 5) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (priority >= 3) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 8) return 'Muy Alta';
    if (priority >= 5) return 'Alta';
    if (priority >= 3) return 'Media';
    return 'Baja';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {scenario ? 'Editar Escenario' : 'Crear Nuevo Escenario'}
          </h2>
          <p className="text-gray-600 mt-1">
            Configura las reglas y propiedades del escenario de email
          </p>
        </div>
        <div className="flex gap-3">
          <BaseButton variant="outline" onClick={onCancel}>
            Cancelar
          </BaseButton>
          <BaseButton onClick={handleSave}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Guardar Escenario
          </BaseButton>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Información Básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clave del Escenario *
              </label>
              <Input
                value={formData.scenarioKey}
                onChange={(e) => setFormData(prev => ({ ...prev, scenarioKey: e.target.value }))}
                placeholder="ej: new_customer_matpass_only"
                className={errors.scenarioKey ? 'border-red-500' : ''}
              />
              {errors.scenarioKey && (
                <p className="text-sm text-red-600 mt-1">{errors.scenarioKey}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Escenario *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="ej: Nuevo Cliente - Solo MatPass"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe cuándo se debe usar este escenario..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Scenario Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Reglas del Escenario
            </CardTitle>
            <BaseButton onClick={addRule} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Regla
            </BaseButton>
          </div>
        </CardHeader>
        <CardContent>
          {formData.rules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Sin reglas configuradas</p>
              <p className="text-sm mb-4">
                Agrega reglas para definir cuándo se debe usar este escenario
              </p>
              <BaseButton onClick={addRule} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primera Regla
              </BaseButton>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.rules.map((rule, index) => (
                <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {ruleTypes.find(t => t.value === rule.type)?.label || rule.type}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {ruleTypes.find(t => t.value === rule.type)?.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={rule.enabled}
                        onCheckedChange={(checked) =>
                          updateRule(rule.id, { enabled: checked as boolean })
                        }
                      />
                      <label className="text-sm text-gray-600">Activo</label>
                      <BaseButton
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRule(rule.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </BaseButton>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo
                      </label>
                      <Select
                        value={rule.type}
                        onValueChange={(value) => updateRule(rule.id, { type: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ruleTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                {type.icon}
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Operador
                      </label>
                      <Select
                        value={rule.operator}
                        onValueChange={(value) => updateRule(rule.id, { operator: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">Igual a</SelectItem>
                          <SelectItem value="not_equals">Diferente de</SelectItem>
                          <SelectItem value="contains">Contiene</SelectItem>
                          <SelectItem value="greater_than">Mayor que</SelectItem>
                          <SelectItem value="less_than">Menor que</SelectItem>
                          <SelectItem value="between">Entre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor
                      </label>
                      {renderRuleValueInput(rule)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Configuración
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {/* Customer Type & Order Types */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Cliente
                </label>
                <Select
                  value={formData.customerType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, customerType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {customerTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-gray-500">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipos de Orden
                </label>
                <div className="space-y-2">
                  {orderTypes.map(type => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.value}
                        checked={formData.orderTypes.includes(type.value)}
                        onCheckedChange={(checked) =>
                          handleOrderTypeChange(type.value, checked as boolean)
                        }
                      />
                      <label htmlFor={type.value} className="text-sm flex items-center gap-2">
                        <span>{type.icon}</span>
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.orderTypes && (
                  <p className="text-sm text-red-600 mt-1">{errors.orderTypes}</p>
                )}
              </div>
            </div>

            {/* Priority & Status */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <div className="space-y-2">
                  <Input
                    type="range"
                    min="0"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">0</span>
                    <Badge className={`text-xs px-2 py-1 ${getPriorityColor(formData.priority)}`}>
                      {getPriorityLabel(formData.priority)} ({formData.priority})
                    </Badge>
                    <span className="text-sm text-gray-600">10</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Escenarios con mayor prioridad tienen preferencia sobre otros
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, isActive: checked as boolean }))
                  }
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Escenario Activo
                </label>
              </div>

              {!formData.isActive && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Este escenario está desactivado y no se usará en producción
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <BaseButton variant="outline" onClick={onCancel}>
          Cancelar
        </BaseButton>
        <BaseButton onClick={handleSave}>
          <CheckCircle className="w-4 h-4 mr-2" />
          Guardar Escenario
        </BaseButton>
      </div>
    </div>
  );
}
