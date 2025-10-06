/**
 * 📧 Email Scenarios API
 *
 * CRUD operations for email scenarios in the modular template system.
 * Provides endpoints for managing scenario definitions, rules, and relationships.
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthenticatedUser } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const customerType = searchParams.get('customerType');
    const orderTypes = searchParams.get('orderTypes')?.split(',');
    const isActive = searchParams.get('isActive') === 'true';

    const scenarios = await prisma.emailScenario.findMany({
      where: {
        ...(customerType && { customerType }),
        ...(orderTypes && { orderTypes: { hasSome: orderTypes } }),
        ...(searchParams.has('isActive') && { isActive }),
      },
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
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: scenarios,
    });

  } catch (error) {
    console.error('Error fetching email scenarios:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scenarios' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      scenarioKey,
      name,
      description,
      customerType,
      orderTypes,
      subjectTemplateKey,
      priority,
      componentIds,
    } = body;

    // Validate required fields
    if (!scenarioKey || !name || !customerType || !orderTypes) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find subject template if specified
    let subjectTemplateId = null;
    if (subjectTemplateKey) {
      const subjectTemplate = await prisma.emailSubjectTemplate.findUnique({
        where: { templateKey: subjectTemplateKey },
      });
      subjectTemplateId = subjectTemplate?.id || null;
    }

    // Create scenario
    const scenario = await prisma.emailScenario.create({
      data: {
        scenarioKey,
        name,
        description,
        customerType,
        orderTypes,
        priority: priority || 0,
        subjectTemplateId,
      },
      include: {
        components: {
          include: { component: true },
        },
        subjectTemplate: true,
      },
    });

    // Add components if specified
    if (componentIds && componentIds.length > 0) {
      for (let i = 0; i < componentIds.length; i++) {
        const componentId = componentIds[i];
        await prisma.emailScenarioComponent.create({
          data: {
            scenarioId: scenario.id,
            componentId,
            order: i + 1,
          },
        });
      }

      // Re-fetch with components
      const scenarioWithComponents = await prisma.emailScenario.findUnique({
        where: { id: scenario.id },
        include: {
          components: {
            include: { component: true },
            orderBy: { order: 'asc' },
          },
          subjectTemplate: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: scenarioWithComponents,
      });
    }

    return NextResponse.json({
      success: true,
      data: scenario,
    });

  } catch (error) {
    console.error('Error creating email scenario:', error);
    return NextResponse.json(
      { error: 'Failed to create scenario' },
      { status: 500 }
    );
  }
}
