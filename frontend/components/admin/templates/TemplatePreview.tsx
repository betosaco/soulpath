'use client';

import { useState, useEffect } from 'react';
import { Card } from '../../ui/card';
import { BaseButton } from '../../ui/BaseButton';
import { BaseInput } from '../../ui/BaseInput';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { 
  Play, 
  RefreshCw, 
  Download, 
  Eye, 
  Code,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

interface TemplatePreviewProps {
  language: 'en' | 'es';
}

export function TemplatePreview({ language }: TemplatePreviewProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [testData, setTestData] = useState<any>({});
  const [generatedEmail, setGeneratedEmail] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showCode, setShowCode] = useState(false);

  const translations = {
    en: {
      title: 'Email Preview',
      description: 'Test and preview email templates with different scenarios and data',
      selectScenario: 'Select Scenario',
      testData: 'Test Data',
      generateEmail: 'Generate Email',
      preview: 'Preview',
      code: 'Code',
      download: 'Download',
      refresh: 'Refresh',
      desktop: 'Desktop',
      tablet: 'Tablet',
      mobile: 'Mobile',
      noScenario: 'Please select a scenario to preview',
      generating: 'Generating email...',
      customerName: 'Customer Name',
      customerEmail: 'Customer Email',
      orderNumber: 'Order Number',
      orderDate: 'Order Date',
      totalAmount: 'Total Amount',
      currency: 'Currency',
      isNewCustomer: 'Is New Customer',
      matpassType: 'MatPass Type',
      matpassSessions: 'MatPass Sessions',
      bookingDate: 'Booking Date',
      bookingTime: 'Booking Time',
      teacherName: 'Teacher Name',
      venue: 'Venue',
      productName: 'Product Name',
      productQuantity: 'Product Quantity',
      productPrice: 'Product Price'
    },
    es: {
      title: 'Vista Previa de Email',
      description: 'Prueba y previsualiza plantillas de email con diferentes escenarios y datos',
      selectScenario: 'Seleccionar Escenario',
      testData: 'Datos de Prueba',
      generateEmail: 'Generar Email',
      preview: 'Vista Previa',
      code: 'Código',
      download: 'Descargar',
      refresh: 'Actualizar',
      desktop: 'Escritorio',
      tablet: 'Tablet',
      mobile: 'Móvil',
      noScenario: 'Por favor selecciona un escenario para previsualizar',
      generating: 'Generando email...',
      customerName: 'Nombre del Cliente',
      customerEmail: 'Email del Cliente',
      orderNumber: 'Número de Orden',
      orderDate: 'Fecha de Orden',
      totalAmount: 'Monto Total',
      currency: 'Moneda',
      isNewCustomer: 'Es Cliente Nuevo',
      matpassType: 'Tipo de MatPass',
      matpassSessions: 'Sesiones de MatPass',
      bookingDate: 'Fecha de Reserva',
      bookingTime: 'Hora de Reserva',
      teacherName: 'Nombre del Instructor',
      venue: 'Ubicación',
      productName: 'Nombre del Producto',
      productQuantity: 'Cantidad del Producto',
      productPrice: 'Precio del Producto'
    }
  };

  const t = translations[language];

  const scenarios = [
    {
      id: 'new_customer_matpass_only',
      name: language === 'es' ? 'Cliente Nuevo - Solo MatPass' : 'New Customer - MatPass Only',
      description: language === 'es' ? 'Email de bienvenida para clientes nuevos' : 'Welcome email for new customers'
    },
    {
      id: 'existing_customer_matpass_only',
      name: language === 'es' ? 'Cliente Existente - Solo MatPass' : 'Existing Customer - MatPass Only',
      description: language === 'es' ? 'Email de renovación para clientes existentes' : 'Renewal email for existing customers'
    },
    {
      id: 'new_customer_matpass_booking',
      name: language === 'es' ? 'Cliente Nuevo - MatPass + Reserva' : 'New Customer - MatPass + Booking',
      description: language === 'es' ? 'Email de bienvenida con reserva' : 'Welcome email with booking'
    },
    {
      id: 'existing_customer_matpass_products',
      name: language === 'es' ? 'Cliente Existente - MatPass + Productos' : 'Existing Customer - MatPass + Products',
      description: language === 'es' ? 'Email de renovación con productos' : 'Renewal email with products'
    }
  ];

  useEffect(() => {
    // Initialize with default test data
    setTestData({
      customerName: 'Alberto Saco',
      customerEmail: 'betosaco@gmail.com',
      orderNumber: 'ORD-1759642289662-96173-055583-HYNS7PKF0',
      orderDate: '2025-10-05',
      totalAmount: 350,
      currency: 'PEN',
      isNewCustomer: false,
      matpassType: '08 MATPASS',
      matpassSessions: 8,
      bookingDate: '2025-10-10',
      bookingTime: '10:00 AM',
      teacherName: 'Maria Rodriguez',
      venue: 'MATMAX Yoga Studio',
      productName: 'Yoga Mat',
      productQuantity: 1,
      productPrice: 50
    });
  }, []);

  const handleGenerateEmail = async () => {
    if (!selectedScenario) return;

    setIsGenerating(true);
    try {
      // Mock email generation - replace with actual API call
      const mockEmail = generateMockEmail(selectedScenario, testData);
      setGeneratedEmail(mockEmail);
    } catch (error) {
      console.error('Error generating email:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockEmail = (scenario: string, data: any) => {
    const baseTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>MATMAX Wellness Studio</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { padding: 30px 20px; background: #f9f9f9; }
        .section { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4a7c2e; }
        .matpass-info { background: #e8f5e9; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .booking-info { background: #e8f4fd; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .product-info { background: #f0f8e8; padding: 20px; margin: 15px 0; border-radius: 5px; }
        .order-summary { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 5px; border: 1px solid #dee2e6; }
        .footer { text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 0 0 12px 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ MATMAX WELLNESS STUDIO</h1>
            <h2>${scenario.includes('new') ? '¡Bienvenido a tu Viaje de Bienestar!' : 'MatPass Renovado Exitosamente'}</h2>
        </div>
        
        <div class="content">
            <div class="section">
                <h3>${scenario.includes('new') ? '🎉 ¡Bienvenido ' + data.customerName + '!' : '🔄 ¡MatPass Renovado ' + data.customerName + '!'}</h3>
                <p>${scenario.includes('new') ? '¡Estamos emocionados de tenerte en la comunidad MATMAX! Tu MatPass está activo y listo para usar.' : '¡Gracias por continuar tu viaje con MATMAX! Tu MatPass ha sido renovado exitosamente.'}</p>
                
                <div class="matpass-info">
                    <h4>📱 Tu MatPass:</h4>
                    <p><strong>Tipo:</strong> ${data.matpassType}</p>
                    <p><strong>Total de sesiones:</strong> ${data.matpassSessions} sesiones</p>
                    <p><strong>Válido desde:</strong> ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><strong>Válido hasta:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                
                ${scenario.includes('booking') ? `
                <div class="booking-info">
                    <h4>📅 Tu Reserva:</h4>
                    <p><strong>Fecha:</strong> ${data.bookingDate}</p>
                    <p><strong>Hora:</strong> ${data.bookingTime}</p>
                    <p><strong>Instructor:</strong> ${data.teacherName}</p>
                    <p><strong>Ubicación:</strong> ${data.venue}</p>
                </div>
                ` : ''}
                
                ${scenario.includes('product') ? `
                <div class="product-info">
                    <h4>📦 Tus Productos:</h4>
                    <p><strong>Producto:</strong> ${data.productName}</p>
                    <p><strong>Cantidad:</strong> ${data.productQuantity}</p>
                    <p><strong>Precio:</strong> S/. ${data.productPrice}</p>
                </div>
                ` : ''}
                
                <div class="order-summary">
                    <h4>💰 Resumen de la Orden:</h4>
                    <p><strong>Número de Orden:</strong> ${data.orderNumber}</p>
                    <p><strong>Fecha:</strong> ${new Date(data.orderDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><strong>Total Pagado:</strong> <span style="color: #4a7c2e; font-weight: bold;">S/. ${data.totalAmount}</span></p>
                </div>
                
                <div style="background: #fff3cd; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #ffc107;">
                    <h4>⚠️ Recordatorios Importantes:</h4>
                    <ul>
                        <li>📅 Llega 10 minutos antes de tu clase</li>
                        <li>🧘‍♀️ Trae ropa cómoda para yoga</li>
                        <li>📱 Mantén el teléfono en silencio durante la clase</li>
                        <li>💧 Mantente hidratado antes y después</li>
                    </ul>
                </div>
                
                <p><strong>¡Sigue disfrutando tu viaje de bienestar!</strong></p>
                <ul>
                    <li>📅 Reserva tu próxima clase</li>
                    <li>🏃‍♀️ Prueba nuevos tipos de clases</li>
                    <li>👥 Conecta con nuestra comunidad</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>MATMAX Wellness Studio</strong></p>
            <p>📧 info@matmax.world | 📱 +51 916 172 368</p>
            <p>© 2025 MATMAX. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>`;

    return baseTemplate;
  };

  const handleDownload = () => {
    const blob = new Blob([generatedEmail], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-preview-${selectedScenario}-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
      default: return '100%';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{t.title}</h2>
          <p className="text-gray-600 mt-1">{t.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">{t.selectScenario}</h3>
            <Select value={selectedScenario} onValueChange={setSelectedScenario}>
              <SelectTrigger className="dashboard-input">
                <SelectValue placeholder={t.selectScenario} />
              </SelectTrigger>
              <SelectContent>
                {scenarios.map((scenario) => (
                  <SelectItem key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">{t.testData}</h3>
            <div className="space-y-3">
              <div>
                <Label className="dashboard-label">{t.customerName}</Label>
                <BaseInput
                  value={testData.customerName || ''}
                  onChange={(e) => setTestData({ ...testData, customerName: e.target.value })}
                  className="dashboard-input"
                />
              </div>
              <div>
                <Label className="dashboard-label">{t.customerEmail}</Label>
                <BaseInput
                  value={testData.customerEmail || ''}
                  onChange={(e) => setTestData({ ...testData, customerEmail: e.target.value })}
                  className="dashboard-input"
                />
              </div>
              <div>
                <Label className="dashboard-label">{t.orderNumber}</Label>
                <BaseInput
                  value={testData.orderNumber || ''}
                  onChange={(e) => setTestData({ ...testData, orderNumber: e.target.value })}
                  className="dashboard-input"
                />
              </div>
              <div>
                <Label className="dashboard-label">{t.totalAmount}</Label>
                <BaseInput
                  type="number"
                  value={testData.totalAmount || ''}
                  onChange={(e) => setTestData({ ...testData, totalAmount: parseFloat(e.target.value) })}
                  className="dashboard-input"
                />
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={testData.isNewCustomer}
                  onChange={(e) => setTestData({ ...testData, isNewCustomer: e.target.checked })}
                  className="rounded"
                />
                <Label>{t.isNewCustomer}</Label>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <BaseButton
                onClick={handleGenerateEmail}
                disabled={!selectedScenario || isGenerating}
                className="dashboard-button-primary"
              >
                {isGenerating ? (
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                ) : (
                  <Play size={16} className="mr-2" />
                )}
                {isGenerating ? t.generating : t.generateEmail}
              </BaseButton>
              
              {generatedEmail && (
                <>
                  <BaseButton
                    onClick={() => setShowCode(!showCode)}
                    className="dashboard-button-secondary"
                  >
                    <Code size={16} className="mr-2" />
                    {showCode ? t.preview : t.code}
                  </BaseButton>
                  <BaseButton
                    onClick={handleDownload}
                    className="dashboard-button-secondary"
                  >
                    <Download size={16} className="mr-2" />
                    {t.download}
                  </BaseButton>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          {!selectedScenario ? (
            <Card className="p-6 text-center">
              <Eye className="mx-auto text-gray-400 mb-2" size={24} />
              <p className="text-gray-600">{t.noScenario}</p>
            </Card>
          ) : generatedEmail ? (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{t.preview}</h3>
                <div className="flex items-center gap-2">
                  <BaseButton
                    onClick={() => setPreviewMode('desktop')}
                    className={`dashboard-button-secondary ${previewMode === 'desktop' ? 'bg-blue-100' : ''}`}
                    size="sm"
                  >
                    <Monitor size={14} />
                  </BaseButton>
                  <BaseButton
                    onClick={() => setPreviewMode('tablet')}
                    className={`dashboard-button-secondary ${previewMode === 'tablet' ? 'bg-blue-100' : ''}`}
                    size="sm"
                  >
                    <Tablet size={14} />
                  </BaseButton>
                  <BaseButton
                    onClick={() => setPreviewMode('mobile')}
                    className={`dashboard-button-secondary ${previewMode === 'mobile' ? 'bg-blue-100' : ''}`}
                    size="sm"
                  >
                    <Smartphone size={14} />
                  </BaseButton>
                </div>
              </div>
              
              <div className="border rounded overflow-hidden">
                <div 
                  style={{ 
                    width: getPreviewWidth(),
                    maxWidth: '100%',
                    margin: '0 auto',
                    transform: previewMode === 'mobile' ? 'scale(0.8)' : 'scale(1)',
                    transformOrigin: 'top center'
                  }}
                >
                  {showCode ? (
                    <pre className="p-4 bg-gray-50 text-sm overflow-auto max-h-96">
                      {generatedEmail}
                    </pre>
                  ) : (
                    <div 
                      dangerouslySetInnerHTML={{ __html: generatedEmail }}
                      className="email-preview"
                    />
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <Play className="mx-auto text-gray-400 mb-2" size={24} />
              <p className="text-gray-600">Click "Generate Email" to see the preview</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
