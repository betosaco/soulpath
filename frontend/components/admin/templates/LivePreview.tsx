/**
 * 👁️ Live Preview
 *
 * Real-time email template preview with test data and responsive design.
 * Shows rendered HTML in an iframe with controls for different viewports.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Settings,
  Download,
  Share,
  EyeOff,
  Maximize,
  Minimize,
} from 'lucide-react';
import { OrderData } from '@/lib/communication/templates/types';

interface LivePreviewProps {
  scenarioId?: number;
  scenario?: any;
  previewData: OrderData;
  onPreviewDataChange: (data: OrderData) => void;
  onRenderPreview: (scenarioId: number) => Promise<void>;
  className?: string;
}

export function LivePreview({
  scenarioId,
  scenario,
  previewData,
  onPreviewDataChange,
  onRenderPreview,
  className = '',
}: LivePreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Viewport configurations
  const viewports = {
    mobile: { width: 375, height: 667, icon: Smartphone, label: 'Móvil' },
    tablet: { width: 768, height: 1024, icon: Tablet, label: 'Tablet' },
    desktop: { width: 600, height: 800, icon: Monitor, label: 'Desktop' },
  };

  // Handle preview rendering
  const handleRenderPreview = async () => {
    if (!scenarioId) return;

    setIsLoading(true);
    try {
      await onRenderPreview(scenarioId);
    } catch (error) {
      console.error('Failed to render preview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-render when scenario changes
  useEffect(() => {
    if (scenarioId) {
      handleRenderPreview();
    }
  }, [scenarioId, scenario?.components]);

  // Update preview data
  const updatePreviewData = (field: keyof OrderData, value: any) => {
    const updatedData = { ...previewData, [field]: value };
    onPreviewDataChange(updatedData);
  };

  const updateNestedPreviewData = (path: string, value: any) => {
    const keys = path.split('.');
    const updatedData = { ...previewData };

    let current = updatedData;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    onPreviewDataChange(updatedData);
  };

  // Sample data templates
  const sampleDataTemplates = [
    {
      name: 'Cliente Nuevo - MatPass',
      data: {
        customerName: 'María González',
        customerEmail: 'maria.gonzalez@email.com',
        customerPhone: '+51 999 123 456',
        orderNumber: 'ORD-2024-00123',
        orderDate: '2024-10-05',
        totalAmount: 120.00,
        currency: 'PEN',
        subtotal: 120.00,
        taxAmount: 0.00,
        shippingAmount: 0.00,
        isNewCustomer: true,
        matpassItems: [{
          name: 'MatPass 10 Clases',
          type: '10_clases',
          sessions: 10,
          expiryDate: '2024-12-05',
          unitPrice: 120.00,
          totalPrice: 120.00,
        }],
        bookings: [],
        products: [],
        orderUrl: 'https://matmax.com/orders/ORD-2024-00123',
        websiteUrl: 'https://matmax.com',
      }
    },
    {
      name: 'Cliente Existente - Reserva',
      data: {
        customerName: 'Juan Pérez',
        customerEmail: 'juan.perez@email.com',
        customerPhone: '+51 999 456 789',
        orderNumber: 'ORD-2024-00124',
        orderDate: '2024-10-06',
        totalAmount: 50.00,
        currency: 'PEN',
        subtotal: 45.00,
        taxAmount: 5.00,
        shippingAmount: 0.00,
        isNewCustomer: false,
        matpassItems: [],
        bookings: [{
          bookingDate: '2024-10-15',
          bookingTime: '18:00',
          sessionType: 'Yoga Flow',
          teacherName: 'Ana María Santos',
          venue: 'Centro Lima',
          duration: 60,
        }],
        products: [],
        orderUrl: 'https://matmax.com/orders/ORD-2024-00124',
        websiteUrl: 'https://matmax.com',
      }
    },
    {
      name: 'Compra de Producto',
      data: {
        customerName: 'Carlos Rodríguez',
        customerEmail: 'carlos.rodriguez@email.com',
        customerPhone: '+51 999 789 012',
        orderNumber: 'ORD-2024-00125',
        orderDate: '2024-10-07',
        totalAmount: 85.00,
        currency: 'PEN',
        subtotal: 75.00,
        taxAmount: 10.00,
        shippingAmount: 0.00,
        isNewCustomer: false,
        matpassItems: [],
        bookings: [],
        products: [{
          name: 'Yoga Mat Premium',
          type: 'equipment',
          unitPrice: 75.00,
          totalPrice: 75.00,
          description: 'Tapete de yoga profesional con superficie antideslizante',
        }],
        orderUrl: 'https://matmax.com/orders/ORD-2024-00125',
        websiteUrl: 'https://matmax.com',
      }
    },
  ];

  const applySampleData = (template: any) => {
    onPreviewDataChange(template.data);
  };

  // Download HTML
  const downloadHtml = () => {
    if (!iframeRef.current?.contentDocument) return;

    const html = iframeRef.current.contentDocument.documentElement.outerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-preview-${scenarioId || 'template'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`h-full flex flex-col bg-white ${className}`}>
      {/* Preview Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Vista Previa</h3>
              <p className="text-sm text-gray-600">
                {scenario ? `Escenario: ${scenario.name}` : 'Selecciona un escenario'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport Controls */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {Object.entries(viewports).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <BaseButton
                    key={key}
                    variant={viewport === key ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewport(key as any)}
                    className="px-2 py-1"
                  >
                    <Icon className="w-4 h-4" />
                  </BaseButton>
                );
              })}
            </div>

            <BaseButton
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </BaseButton>

            <BaseButton
              variant="outline"
              size="sm"
              onClick={downloadHtml}
              disabled={!iframeRef.current?.contentDocument}
            >
              <Download className="w-4 h-4 mr-1" />
              HTML
            </BaseButton>

            <BaseButton
              onClick={handleRenderPreview}
              disabled={isLoading || !scenarioId}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Actualizar
            </BaseButton>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 flex">
        {/* Main Preview */}
        <div className="flex-1 p-4">
          {scenario ? (
            <div className="h-full flex flex-col">
              {/* Preview Controls */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {viewports[viewport].label}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {viewports[viewport].width} × {viewports[viewport].height}px
                  </span>
                </div>

                <BaseButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? (
                    <Minimize className="w-4 h-4" />
                  ) : (
                    <Maximize className="w-4 h-4" />
                  )}
                </BaseButton>
              </div>

              {/* Preview Iframe */}
              <div
                className={`flex-1 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 ${
                  isFullscreen ? 'fixed inset-4 z-50 bg-white' : ''
                }`}
                style={{
                  maxWidth: isFullscreen ? 'none' : `${viewports[viewport].width + 40}px`,
                  margin: isFullscreen ? '0' : '0 auto',
                }}
              >
                <iframe
                  ref={iframeRef}
                  className="w-full h-full border-0 bg-white"
                  style={{
                    width: `${viewports[viewport].width}px`,
                    height: `${viewports[viewport].height}px`,
                    transform: isFullscreen ? 'none' : 'scale(0.8)',
                    transformOrigin: 'top center',
                  }}
                  title="Email Preview"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <EyeOff className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Sin Vista Previa
                </h3>
                <p className="text-gray-600">
                  Selecciona un escenario para ver la vista previa
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-4">Datos de Prueba</h4>

              {/* Sample Data Templates */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plantillas de Datos
                </label>
                <div className="space-y-2">
                  {sampleDataTemplates.map((template, index) => (
                    <BaseButton
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => applySampleData(template)}
                      className="w-full justify-start text-left"
                    >
                      {template.name}
                    </BaseButton>
                  ))}
                </div>
              </div>

              {/* Manual Data Editing */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Cliente
                  </label>
                  <Input
                    value={previewData.customerName || ''}
                    onChange={(e) => updatePreviewData('customerName', e.target.value)}
                    placeholder="ej: María González"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    value={previewData.customerEmail || ''}
                    onChange={(e) => updatePreviewData('customerEmail', e.target.value)}
                    placeholder="ej: maria@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Orden
                  </label>
                  <Input
                    value={previewData.orderNumber || ''}
                    onChange={(e) => updatePreviewData('orderNumber', e.target.value)}
                    placeholder="ej: ORD-2024-00123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto Total
                  </label>
                  <Input
                    type="number"
                    value={previewData.totalAmount || ''}
                    onChange={(e) => updatePreviewData('totalAmount', parseFloat(e.target.value))}
                    placeholder="ej: 150.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MatPass (si aplica)
                  </label>
                  <Input
                    value={previewData.matpassItems?.[0]?.name || ''}
                    onChange={(e) => updateNestedPreviewData('matpassItems.0.name', e.target.value)}
                    placeholder="ej: MatPass 10 Clases"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reserva (si aplica)
                  </label>
                  <Input
                    value={previewData.bookings?.[0]?.sessionType || ''}
                    onChange={(e) => updateNestedPreviewData('bookings.0.sessionType', e.target.value)}
                    placeholder="ej: Yoga Flow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Producto (si aplica)
                  </label>
                  <Input
                    value={previewData.products?.[0]?.name || ''}
                    onChange={(e) => updateNestedPreviewData('products.0.name', e.target.value)}
                    placeholder="ej: Yoga Mat Premium"
                  />
                </div>
              </div>

              {/* Preview Stats */}
              {scenario && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-2">Estadísticas</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Componentes: {scenario.components?.length || 0}</div>
                    <div>Placeholders usados: {
                      scenario.components?.reduce((count, comp) => {
                        const matches = comp.component.template.match(/\{\{(\w+)\}\}/g);
                        return count + (matches ? matches.length : 0);
                      }, 0) || 0
                    }</div>
                    <div>Última actualización: {new Date().toLocaleTimeString()}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
