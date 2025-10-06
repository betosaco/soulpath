/**
 * 📧 Individual Email Scenario API
 *
 * GET, PUT, DELETE operations for specific email scenarios.
 * Handles scenario updates, component reordering, and deletion.
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthenticatedUser } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scenarioId = parseInt(params.id);
    if (isNaN(scenarioId)) {
      return NextResponse.json({ error: 'Invalid scenario ID' }, { status: 400 });
    }

    const scenario = await prisma.emailScenario.findUnique({
      where: { id: scenarioId },
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

    return NextResponse.json({
      success: true,
      data: scenario,
    });

  } catch (error) {
    console.error('Error fetching email scenario:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scenario' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scenarioId = parseInt(params.id);
    if (isNaN(scenarioId)) {
      return NextResponse.json({ error: 'Invalid scenario ID' }, { status: 400 });
    }

    const body = await request.json();
    const {
      name,
      description,
      customerType,
      orderTypes,
      subjectTemplateKey,
      priority,
      isActive,
      componentIds, // For reordering components
    } = body;

    // Find subject template if specified
    let subjectTemplateId = null;
    if (subjectTemplateKey) {
      const subjectTemplate = await prisma.emailSubjectTemplate.findUnique({
        where: { templateKey: subjectTemplateKey },
      });
      subjectTemplateId = subjectTemplate?.id || null;
    }

    // Update scenario
    const scenario = await prisma.emailScenario.update({
      where: { id: scenarioId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(customerType && { customerType }),
        ...(orderTypes && { orderTypes }),
        ...(subjectTemplateId !== undefined && { subjectTemplateId }),
        ...(priority !== undefined && { priority }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date(),
      },
      include: {
        components: {
          include: { component: true },
          orderBy: { order: 'asc' },
        },
        subjectTemplate: true,
      },
    });

    // Update component order if specified
    if (componentIds && Array.isArray(componentIds)) {
      // First, remove all existing component relationships
      await prisma.emailScenarioComponent.deleteMany({
        where: { scenarioId },
      });

      // Then add them back in the new order
      for (let i = 0; i < componentIds.length; i++) {
        const componentId = componentIds[i];
        await prisma.emailScenarioComponent.create({
          data: {
            scenarioId,
            componentId,
            order: i + 1,
          },
        });
      }

      // Re-fetch with updated components
      const scenarioWithComponents = await prisma.emailScenario.findUnique({
        where: { id: scenarioId },
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
    console.error('Error updating email scenario:', error);
    return NextResponse.json(
      { error: 'Failed to update scenario' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scenarioId = parseInt(params.id);
    if (isNaN(scenarioId)) {
      return NextResponse.json({ error: 'Invalid scenario ID' }, { status: 400 });
    }

    // Check if scenario exists
    const scenario = await prisma.emailScenario.findUnique({
      where: { id: scenarioId },
    });

    if (!scenario) {
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
    }

    // Delete scenario (components will be cascade deleted due to onDelete: Cascade)
    await prisma.emailScenario.delete({
      where: { id: scenarioId },
    });

    return NextResponse.json({
      success: true,
      message: 'Scenario deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting email scenario:', error);
    return NextResponse.json(
      { error: 'Failed to delete scenario' },
      { status: 500 }
    );
  }
}
