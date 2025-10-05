'use client';

import { useState, useEffect } from 'react';
import { Card } from '../../ui/card';
import { BaseButton } from '../../ui/BaseButton';
import { BaseInput } from '../../ui/BaseInput';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
  Copy
} from 'lucide-react';

interface SubjectTemplate {
  id: string;
  template: string;
  placeholders: string[];
  conditions?: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  maxLength?: number;
  isActive: boolean;
}

interface SubjectManagerProps {
  language: 'en' | 'es';
}

export function SubjectManager({ language }: SubjectManagerProps) {
  const [subjects, setSubjects] = useState<SubjectTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectTemplate | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);

  const translations = {
    en: {
      title: 'Subject Templates',
      description: 'Manage dynamic email subject templates with placeholders and conditions',
      addSubject: 'Add Subject Template',
      editSubject: 'Edit Subject Template',
      subjectId: 'Subject ID',
      template: 'Template',
      placeholders: 'Placeholders',
      conditions: 'Conditions',
      maxLength: 'Max Length',
      isActive: 'Active',
      actions: 'Actions',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      preview: 'Preview',
      closePreview: 'Close Preview',
      copy: 'Copy',
      noSubjects: 'No subject templates found',
      loading: 'Loading subject templates...',
      templatePlaceholder: 'Enter your subject template here... Use {{placeholder}} for dynamic content',
      addPlaceholder: 'Add Placeholder',
      removePlaceholder: 'Remove Placeholder',
      placeholderName: 'Placeholder Name',
      conditionField: 'Field',
      conditionOperator: 'Operator',
      conditionValue: 'Value',
      addCondition: 'Add Condition',
      removeCondition: 'Remove Condition',
      testSubject: 'Test Subject',
      testData: 'Test Data',
      generatedSubject: 'Generated Subject'
    },
    es: {
      title: 'Plantillas de Asunto',
      description: 'Gestiona plantillas de asunto de email dinámicas con marcadores de posición y condiciones',
      addSubject: 'Agregar Plantilla de Asunto',
      editSubject: 'Editar Plantilla de Asunto',
      subjectId: 'ID del Asunto',
      template: 'Plantilla',
      placeholders: 'Marcadores de Posición',
      conditions: 'Condiciones',
      maxLength: 'Longitud Máxima',
      isActive: 'Activo',
      actions: 'Acciones',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      preview: 'Vista Previa',
      closePreview: 'Cerrar Vista Previa',
      copy: 'Copiar',
      noSubjects: 'No se encontraron plantillas de asunto',
      loading: 'Cargando plantillas de asunto...',
      templatePlaceholder: 'Ingresa tu plantilla de asunto aquí... Usa {{placeholder}} para contenido dinámico',
      addPlaceholder: 'Agregar Marcador',
      removePlaceholder: 'Eliminar Marcador',
      placeholderName: 'Nombre del Marcador',
      conditionField: 'Campo',
      conditionOperator: 'Operador',
      conditionValue: 'Valor',
      addCondition: 'Agregar Condición',
      removeCondition: 'Eliminar Condición',
      testSubject: 'Probar Asunto',
      testData: 'Datos de Prueba',
      generatedSubject: 'Asunto Generado'
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockSubjects: SubjectTemplate[] = [
        {
          id: 'new_customer_matpass',
          template: language === 'es' 
            ? '¡Bienvenido a MATMAX, {{userName}}! Tu MatPass está listo'
            : 'Welcome to MATMAX, {{userName}}! Your MatPass is ready',
          placeholders: ['userName'],
          maxLength: 60,
          isActive: true
        },
        {
          id: 'existing_customer_matpass',
          template: language === 'es'
            ? 'MatPass Renovado - {{userName}} ({{matpassSessions}} sesiones)'
            : 'MatPass Renewed - {{userName}} ({{matpassSessions}} sessions)',
          placeholders: ['userName', 'matpassSessions'],
          maxLength: 60,
          isActive: true
        },
        {
          id: 'existing_customer_matpass_booking',
          template: language === 'es'
            ? 'MatPass Renovado + Reserva - {{userName}}'
            : 'MatPass Renewed + Booking - {{userName}}',
          placeholders: ['userName'],
          maxLength: 60,
          isActive: true
        }
      ];
      setSubjects(mockSubjects);
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (subject: SubjectTemplate) => {
    setEditingSubject(subject);
    setShowForm(true);
  };

  const handleDelete = async (subjectId: string) => {
    if (confirm(t.delete + '?')) {
      try {
        setSubjects(subjects.filter(s => s.id !== subjectId));
      } catch (error) {
        console.error('Error deleting subject:', error);
      }
    }
  };

  const handleSave = async (subject: SubjectTemplate) => {
    try {
      if (editingSubject) {
        setSubjects(subjects.map(s => s.id === subject.id ? subject : s));
      } else {
        setSubjects([...subjects, subject]);
      }
      setShowForm(false);
      setEditingSubject(null);
    } catch (error) {
      console.error('Error saving subject:', error);
    }
  };

  const handleCopy = (subject: SubjectTemplate) => {
    navigator.clipboard.writeText(subject.template);
  };

  const testSubject = (subject: SubjectTemplate) => {
    // Mock test data
    const testData = {
      userName: 'Alberto Saco',
      matpassSessions: '8',
      orderNumber: 'ORD-123456',
      orderDate: '5 de octubre de 2025'
    };

    let generatedSubject = subject.template;
    subject.placeholders.forEach(placeholder => {
      const value = testData[placeholder as keyof typeof testData] || `{{${placeholder}}}`;
      generatedSubject = generatedSubject.replace(new RegExp(`{{${placeholder}}}`, 'g'), value);
    });

    return generatedSubject;
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
          {t.addSubject}
        </BaseButton>
      </div>

      {/* Subjects List */}
      <div className="grid gap-4">
        {subjects.length === 0 ? (
          <Card className="p-6 text-center">
            <AlertCircle className="mx-auto text-gray-400 mb-2" size={24} />
            <p className="text-gray-600">{t.noSubjects}</p>
          </Card>
        ) : (
          subjects.map((subject) => (
            <Card key={subject.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="text-blue-500" size={16} />
                    <h3 className="font-semibold text-gray-900">{subject.id}</h3>
                    {subject.isActive ? (
                      <CheckCircle className="text-green-500" size={16} />
                    ) : (
                      <AlertCircle className="text-gray-400" size={16} />
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded text-sm mb-3">
                    <div className="font-mono text-gray-700 mb-2">{subject.template}</div>
                    <div className="text-xs text-gray-500">
                      Placeholders: {subject.placeholders.join(', ')} | 
                      Max Length: {subject.maxLength || 'No limit'}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded text-sm">
                    <div className="text-xs text-blue-600 mb-1">{t.generatedSubject}:</div>
                    <div className="font-mono text-blue-800">{testSubject(subject)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <BaseButton
                    onClick={() => setShowPreview(subject.id)}
                    className="dashboard-button-secondary"
                    size="sm"
                  >
                    <Eye size={14} />
                  </BaseButton>
                  <BaseButton
                    onClick={() => handleCopy(subject)}
                    className="dashboard-button-secondary"
                    size="sm"
                  >
                    <Copy size={14} />
                  </BaseButton>
                  <BaseButton
                    onClick={() => handleEdit(subject)}
                    className="dashboard-button-secondary"
                    size="sm"
                  >
                    <Edit size={14} />
                  </BaseButton>
                  <BaseButton
                    onClick={() => handleDelete(subject.id)}
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

      {/* Subject Form Modal */}
      {showForm && (
        <SubjectForm
          subject={editingSubject}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingSubject(null);
          }}
          language={language}
          translations={t}
        />
      )}

      {/* Preview Modal */}
      {showPreview && (
        <SubjectPreview
          subject={subjects.find(s => s.id === showPreview)}
          onClose={() => setShowPreview(null)}
          language={language}
          translations={t}
        />
      )}
    </div>
  );
}

interface SubjectFormProps {
  subject?: SubjectTemplate | null;
  onSave: (subject: SubjectTemplate) => void;
  onCancel: () => void;
  language: 'en' | 'es';
  translations: any;
}

function SubjectForm({ subject, onSave, onCancel, language, translations: t }: SubjectFormProps) {
  const [formData, setFormData] = useState<SubjectTemplate>({
    id: subject?.id || '',
    template: subject?.template || '',
    placeholders: subject?.placeholders || [],
    conditions: subject?.conditions || [],
    maxLength: subject?.maxLength || 60,
    isActive: subject?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addPlaceholder = () => {
    setFormData({
      ...formData,
      placeholders: [...formData.placeholders, '']
    });
  };

  const removePlaceholder = (index: number) => {
    setFormData({
      ...formData,
      placeholders: formData.placeholders.filter((_, i) => i !== index)
    });
  };

  const updatePlaceholder = (index: number, value: string) => {
    const newPlaceholders = [...formData.placeholders];
    newPlaceholders[index] = value;
    setFormData({ ...formData, placeholders: newPlaceholders });
  };

  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [...(formData.conditions || []), { field: '', operator: 'equals', value: '' }]
    });
  };

  const removeCondition = (index: number) => {
    setFormData({
      ...formData,
      conditions: (formData.conditions || []).filter((_, i) => i !== index)
    });
  };

  const updateCondition = (index: number, field: string, value: any) => {
    const newConditions = [...(formData.conditions || [])];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setFormData({ ...formData, conditions: newConditions });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              {subject ? t.editSubject : t.addSubject}
            </h3>
            <BaseButton onClick={onCancel} className="dashboard-button-secondary">
              <X size={16} />
            </BaseButton>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="dashboard-label">{t.subjectId}</Label>
              <BaseInput
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="dashboard-input"
                required
              />
            </div>

            <div>
              <Label className="dashboard-label">{t.template}</Label>
              <BaseInput
                value={formData.template}
                onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                className="dashboard-input"
                placeholder={t.templatePlaceholder}
                required
              />
            </div>

            <div>
              <Label className="dashboard-label">{t.placeholders}</Label>
              <div className="space-y-2">
                {formData.placeholders.map((placeholder, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <BaseInput
                      value={placeholder}
                      onChange={(e) => updatePlaceholder(index, e.target.value)}
                      placeholder={t.placeholderName}
                      className="dashboard-input flex-1"
                    />
                    <BaseButton
                      type="button"
                      onClick={() => removePlaceholder(index)}
                      className="dashboard-button-danger"
                      size="sm"
                    >
                      <X size={14} />
                    </BaseButton>
                  </div>
                ))}
                <BaseButton
                  type="button"
                  onClick={addPlaceholder}
                  className="dashboard-button-secondary"
                  size="sm"
                >
                  <Plus size={14} className="mr-2" />
                  {t.addPlaceholder}
                </BaseButton>
              </div>
            </div>

            <div>
              <Label className="dashboard-label">{t.conditions}</Label>
              <div className="space-y-2">
                {(formData.conditions || []).map((condition, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <BaseInput
                      value={condition.field}
                      onChange={(e) => updateCondition(index, 'field', e.target.value)}
                      placeholder={t.conditionField}
                      className="dashboard-input flex-1"
                    />
                    <select
                      value={condition.operator}
                      onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                      className="dashboard-input w-32"
                    >
                      <option value="equals">equals</option>
                      <option value="not_equals">not equals</option>
                      <option value="exists">exists</option>
                      <option value="contains">contains</option>
                    </select>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="dashboard-label">{t.maxLength}</Label>
                <BaseInput
                  type="number"
                  value={formData.maxLength}
                  onChange={(e) => setFormData({ ...formData, maxLength: parseInt(e.target.value) })}
                  className="dashboard-input"
                />
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

interface SubjectPreviewProps {
  subject?: SubjectTemplate;
  onClose: () => void;
  language: 'en' | 'es';
  translations: any;
}

function SubjectPreview({ subject, onClose, language, translations: t }: SubjectPreviewProps) {
  if (!subject) return null;

  const testData = {
    userName: 'Alberto Saco',
    matpassSessions: '8',
    orderNumber: 'ORD-123456',
    orderDate: '5 de octubre de 2025'
  };

  let generatedSubject = subject.template;
  subject.placeholders.forEach(placeholder => {
    const value = testData[placeholder as keyof typeof testData] || `{{${placeholder}}}`;
    generatedSubject = generatedSubject.replace(new RegExp(`{{${placeholder}}}`, 'g'), value);
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">{t.preview}: {subject.id}</h3>
            <BaseButton onClick={onClose} className="dashboard-button-secondary">
              <X size={16} />
            </BaseButton>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="dashboard-label">Template</Label>
              <div className="bg-gray-50 p-4 rounded border">
                <div className="font-mono text-sm text-gray-700">{subject.template}</div>
              </div>
            </div>

            <div>
              <Label className="dashboard-label">{t.generatedSubject}</Label>
              <div className="bg-blue-50 p-4 rounded border">
                <div className="font-mono text-sm text-blue-800">{generatedSubject}</div>
              </div>
            </div>

            <div>
              <Label className="dashboard-label">Test Data</Label>
              <div className="bg-green-50 p-4 rounded border">
                <pre className="text-sm text-green-800">
                  {JSON.stringify(testData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
