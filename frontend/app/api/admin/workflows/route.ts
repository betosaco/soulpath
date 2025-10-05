import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workflowData = await request.json();
    console.log('🔧 Saving workflow:', workflowData);

    // Validate required fields
    if (!workflowData.name || !workflowData.name.trim()) {
      return NextResponse.json({
        error: 'Workflow name is required'
      }, { status: 400 });
    }

    // Save workflow to database
    const workflow = await prisma.workflow.create({
      data: {
        name: workflowData.name.trim(),
        description: workflowData.description || null,
        data: workflowData, // Store the complete workflow structure
        createdBy: user.id,
        tags: workflowData.tags || [],
        isActive: workflowData.isActive !== undefined ? workflowData.isActive : true,
        isPublished: workflowData.isPublished || false,
        version: workflowData.version || 1
      }
    });

    console.log('✅ Workflow saved to database:', workflow.id);

    return NextResponse.json({
      success: true,
      message: 'Workflow saved successfully',
      workflow: {
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        isActive: workflow.isActive,
        isPublished: workflow.isPublished,
        version: workflow.version,
        tags: workflow.tags,
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt,
        // Don't return the full data object to keep response size manageable
        nodeCount: workflowData.nodes?.length || 0,
        connectionCount: workflowData.connections?.length || 0
      }
    });

  } catch (error) {
    console.error('❌ Error saving workflow:', error);
    return NextResponse.json({
      error: 'Failed to save workflow',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters for filtering
    const url = new URL(request.url);
    const includeInactive = url.searchParams.get('includeInactive') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Fetch workflows from database
    const workflows = await prisma.workflow.findMany({
      where: {
        createdBy: user.id,
        ...(includeInactive ? {} : { isActive: true })
      },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        isPublished: true,
        version: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        // Include node/connection counts from the data JSON
        data: false // Don't include full data in list view
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: Math.min(limit, 100), // Max 100 per request
      skip: offset
    });

    // Add computed fields for each workflow
    const workflowsWithCounts = await Promise.all(
      workflows.map(async (workflow) => {
        // Get the full workflow data to count nodes/connections
        const fullWorkflow = await prisma.workflow.findUnique({
          where: { id: workflow.id },
          select: { data: true }
        });

        const workflowData = fullWorkflow?.data as any || {};
        return {
          ...workflow,
          nodeCount: workflowData.nodes?.length || 0,
          connectionCount: workflowData.connections?.length || 0
        };
      })
    );

    // Get total count for pagination
    const totalCount = await prisma.workflow.count({
      where: {
        createdBy: user.id,
        ...(includeInactive ? {} : { isActive: true })
      }
    });

    console.log(`✅ Fetched ${workflowsWithCounts.length} workflows for user ${user.id}`);

    return NextResponse.json({
      success: true,
      workflows: workflowsWithCounts,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + workflowsWithCounts.length < totalCount
      }
    });

  } catch (error) {
    console.error('❌ Error fetching workflows:', error);
    return NextResponse.json({
      error: 'Failed to fetch workflows',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
