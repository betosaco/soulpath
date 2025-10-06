/**
 * 🎨 Template Preview API
 *
 * Renders email scenarios with test data for live preview in the Template Studio.
 * Supports both individual component testing and full scenario assembly.
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthenticatedUser } from '@/lib/auth';
import { OrderData } from '@/lib/communication/templates/types';
import { resolvePlaceholders } from '@/lib/communication/placeholderRegistry';

const prisma = new PrismaClient();

// Test data for preview rendering
const TEST_ORDER_DATA: OrderData = {
  customerName: 'María González',
  customerEmail: 'maria.gonzalez@email.com',
  customerPhone: '+51 999 123 456',
  orderNumber: 'ORD-2024-00123',
  orderDate: '2024-10-05',
  totalAmount: 150.00,
  currency: 'PEN',
  subtotal: 130.00,
  taxAmount: 20.00,
  shippingAmount: 10.00,
  isNewCustomer: true,
  orderItems: [
    {
      id: 'item-1',
      name: 'MatPass 10 Clases',
      type: 'matpass',
      quantity: 1,
      unitPrice: 120.00,
      totalPrice: 120.00,
      description: 'Acceso ilimitado a 10 clases de yoga',
    },
    {
      id: 'item-2',
      name: 'Yoga Mat Premium',
      type: 'product',
      quantity: 1,
      unitPrice: 30.00,
      totalPrice: 30.00,
      description: 'Tapete de yoga profesional con superficie antideslizante',
    },
  ],
  matpassItems: [
    {
      name: 'MatPass 10 Clases',
      type: '10_clases',
      quantity: 1,
      unitPrice: 120.00,
      totalPrice: 120.00,
      sessions: 10,
      expiryDate: '2024-12-05',
      description: 'Acceso ilimitado a 10 clases de yoga',
    },
  ],
  bookings: [
    {
      id: 'booking-1',
      bookingDate: '2024-10-10',
      bookingTime: '10:00',
      sessionType: 'Yoga Flow',
      teacherName: 'Ana María Santos',
      venue: 'Centro Lima',
      duration: 60,
    },
  ],
  products: [
    {
      name: 'Yoga Mat Premium',
      type: 'equipment',
      quantity: 1,
      unitPrice: 30.00,
      totalPrice: 30.00,
      description: 'Tapete de yoga profesional con superficie antideslizante',
    },
  ],
  orderUrl: 'https://matmax.com/orders/ORD-2024-00123',
  websiteUrl: 'https://matmax.com',
  workflowVar1: 'Custom workflow data 1',
  workflowVar2: 'Custom workflow data 2',
};

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      scenarioId,
      componentIds, // For custom component selection
      customData, // Override test data
      renderType = 'full', // 'full' | 'component' | 'subject'
    } = body;

    // Merge custom data with test data
    const orderData: OrderData = {
      ...TEST_ORDER_DATA,
      ...(customData || {}),
    };

    let html = '';
    let subject = '';
    let components: any[] = [];

    if (renderType === 'component' && componentIds) {
      // Render specific components only
      for (const componentId of componentIds) {
        const component = await prisma.emailComponent.findUnique({
          where: { id: parseInt(componentId) },
        });

        if (component) {
          const renderedHtml = resolvePlaceholders(component.template, orderData);
          components.push({
            id: component.id,
            componentKey: component.componentKey,
            name: component.name,
            type: component.type,
            html: renderedHtml,
          });
          html += renderedHtml;
        }
      }
    } else if (scenarioId) {
      // Render full scenario
      const scenario = await prisma.emailScenario.findUnique({
        where: { id: parseInt(scenarioId) },
        include: {
          components: {
            include: {
              component: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
          subjectTemplate: true,
        },
      });

      if (!scenario) {
        return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
      }

      // Render subject
      if (scenario.subjectTemplate) {
        subject = resolvePlaceholders(scenario.subjectTemplate.template, orderData);
      }

      // Render components
      for (const scenarioComponent of scenario.components) {
        const component = scenarioComponent.component;
        const renderedHtml = resolvePlaceholders(component.template, orderData);

        components.push({
          id: component.id,
          componentKey: component.componentKey,
          name: component.name,
          type: component.type,
          order: scenarioComponent.order,
          html: renderedHtml,
        });

        html += renderedHtml;
      }
    } else {
      return NextResponse.json(
        { error: 'Either scenarioId or componentIds must be provided' },
        { status: 400 }
      );
    }

    // Wrap in basic email structure
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Preview</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
          .email-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        </style>
      </head>
      <body>
        <div class="email-container">
          ${html}
        </div>
      </body>
      </html>
    `;

    return NextResponse.json({
      success: true,
      data: {
        subject,
        html: fullHtml,
        plainHtml: html,
        components,
        testData: orderData,
        renderType,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error rendering template preview:', error);
    return NextResponse.json(
      { error: 'Failed to render preview' },
      { status: 500 }
    );
  }
}

// GET endpoint for retrieving test data options
export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: {
        testData: TEST_ORDER_DATA,
        availableScenarios: await prisma.emailScenario.findMany({
          select: {
            id: true,
            scenarioKey: true,
            name: true,
          },
          where: { isActive: true },
          orderBy: { priority: 'desc' },
        }),
        availableComponents: await prisma.emailComponent.findMany({
          select: {
            id: true,
            componentKey: true,
            name: true,
            type: true,
          },
          where: { isActive: true },
          orderBy: { type: 'asc' },
        }),
      },
    });

  } catch (error) {
    console.error('Error fetching preview options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preview options' },
      { status: 500 }
    );
  }
}
