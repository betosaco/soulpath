'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Save, Send, Eye, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface EmailTemplate {
  id: number;
  templateKey: string;
  name: string;
  description: string;
  type: string;
  category: string;
  isActive: boolean;
  translations: {
    id: number;
    language: string;
    subject: string;
    content: string;
  }[];
}

interface CommunicationConfig {
  id: number;
  email_enabled: boolean;
  brevo_api_key: string;
  sender_email: string;
  sender_name: string;
  admin_email: string;
}

export default function EmailTemplateManager() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [config, setConfig] = useState<CommunicationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [editingConfig, setEditingConfig] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  // Load templates and config
  useEffect(() => {
    loadTemplates();
    loadConfig();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/admin/email-templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Error al cargar las plantillas');
    }
  };

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/admin/communication-config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data.config);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async (template: EmailTemplate) => {
    try {
      const response = await fetch('/api/admin/email-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
      });

      if (response.ok) {
        toast.success('Plantilla guardada exitosamente');
        loadTemplates();
      } else {
        toast.error('Error al guardar la plantilla');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Error al guardar la plantilla');
    }
  };

  const saveConfig = async () => {
    if (!config) return;

    try {
      const response = await fetch('/api/admin/communication-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        toast.success('Configuración guardada exitosamente');
        setEditingConfig(false);
      } else {
        toast.error('Error al guardar la configuración');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Error al guardar la configuración');
    }
  };

  const sendTestEmail = async (templateKey: string) => {
    if (!testEmail) {
      toast.error('Por favor ingresa un email de prueba');
      return;
    }

    try {
      const response = await fetch('/api/admin/send-test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateKey,
          email: testEmail
        })
      });

      if (response.ok) {
        toast.success('Email de prueba enviado exitosamente');
      } else {
        toast.error('Error al enviar el email de prueba');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Error al enviar el email de prueba');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'purchase': return 'bg-green-100 text-green-800';
      case 'booking': return 'bg-blue-100 text-blue-800';
      case 'reminder': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Plantillas de Email</h1>
        <Button onClick={() => setEditingConfig(!editingConfig)}>
          <Edit className="w-4 h-4 mr-2" />
          {editingConfig ? 'Cancelar' : 'Configurar Brevo'}
        </Button>
      </div>

      {/* Brevo Configuration */}
      {editingConfig && config && (
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Brevo</CardTitle>
            <CardDescription>
              Configura las credenciales de Brevo para el envío de emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brevo_api_key">API Key de Brevo</Label>
                <Input
                  id="brevo_api_key"
                  type="password"
                  value={config.brevo_api_key}
                  onChange={(e) => setConfig({...config, brevo_api_key: e.target.value})}
                  placeholder="xkeys-xxxxxxxxxxxxxxxx"
                />
              </div>
              <div>
                <Label htmlFor="sender_email">Email Remitente</Label>
                <Input
                  id="sender_email"
                  value={config.sender_email}
                  onChange={(e) => setConfig({...config, sender_email: e.target.value})}
                  placeholder="noreply@matmax.store"
                />
              </div>
              <div>
                <Label htmlFor="sender_name">Nombre Remitente</Label>
                <Input
                  id="sender_name"
                  value={config.sender_name}
                  onChange={(e) => setConfig({...config, sender_name: e.target.value})}
                  placeholder="MatMax Yoga Studio"
                />
              </div>
              <div>
                <Label htmlFor="admin_email">Email Administrador</Label>
                <Input
                  id="admin_email"
                  value={config.admin_email}
                  onChange={(e) => setConfig({...config, admin_email: e.target.value})}
                  placeholder="admin@matmax.store"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="email_enabled"
                checked={config.email_enabled}
                onCheckedChange={(checked) => setConfig({...config, email_enabled: checked})}
              />
              <Label htmlFor="email_enabled">Emails habilitados</Label>
            </div>
            <div className="flex space-x-2">
              <Button onClick={saveConfig}>
                <Save className="w-4 h-4 mr-2" />
                Guardar Configuración
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email Test */}
      <Card>
        <CardHeader>
          <CardTitle>Prueba de Emails</CardTitle>
          <CardDescription>
            Envía emails de prueba para verificar la configuración
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Input
              placeholder="Email de prueba"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={() => sendTestEmail('package_purchase_confirmation')}
              disabled={!testEmail}
            >
              <Send className="w-4 h-4 mr-2" />
              Probar Compra
            </Button>
            <Button 
              onClick={() => sendTestEmail('booking_confirmation')}
              disabled={!testEmail}
            >
              <Send className="w-4 h-4 mr-2" />
              Probar Reserva
            </Button>
            <Button 
              onClick={() => sendTestEmail('booking_reminder')}
              disabled={!testEmail}
            >
              <Send className="w-4 h-4 mr-2" />
              Probar Recordatorio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Templates List */}
      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    {template.name}
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                    {template.isActive ? (
                      <Badge variant="default">Activo</Badge>
                    ) : (
                      <Badge variant="secondary">Inactivo</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendTestEmail(template.templateKey)}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Clave:</strong> {template.templateKey}</p>
                <p><strong>Tipo:</strong> {template.type}</p>
                <div>
                  <strong>Traducciones:</strong>
                  <div className="flex space-x-2 mt-1">
                    {template.translations.map((translation) => (
                      <Badge key={translation.id} variant="outline">
                        {translation.language.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Editor Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Editar Plantilla: {selectedTemplate.name}</h2>
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  Cerrar
                </Button>
              </div>
              
              <Tabs defaultValue="es" className="w-full">
                <TabsList>
                  {selectedTemplate.translations.map((translation) => (
                    <TabsTrigger key={translation.id} value={translation.language}>
                      {translation.language.toUpperCase()}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {selectedTemplate.translations.map((translation) => (
                  <TabsContent key={translation.id} value={translation.language} className="space-y-4">
                    <div>
                      <Label htmlFor={`subject-${translation.id}`}>Asunto</Label>
                      <Input
                        id={`subject-${translation.id}`}
                        value={translation.subject}
                        onChange={(e) => {
                          const updatedTemplate = {...selectedTemplate};
                          const updatedTranslation = updatedTemplate.translations.find(t => t.id === translation.id);
                          if (updatedTranslation) {
                            updatedTranslation.subject = e.target.value;
                            setSelectedTemplate(updatedTemplate);
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`content-${translation.id}`}>Contenido HTML</Label>
                      <Textarea
                        id={`content-${translation.id}`}
                        value={translation.content}
                        onChange={(e) => {
                          const updatedTemplate = {...selectedTemplate};
                          const updatedTranslation = updatedTemplate.translations.find(t => t.id === translation.id);
                          if (updatedTranslation) {
                            updatedTranslation.content = e.target.value;
                            setSelectedTemplate(updatedTemplate);
                          }
                        }}
                        rows={20}
                        className="font-mono text-sm"
                      />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  Cancelar
                </Button>
                <Button onClick={() => {
                  saveTemplate(selectedTemplate);
                  setSelectedTemplate(null);
                }}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
