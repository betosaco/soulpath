import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 POST /api/admin/workflows - Starting request (v2)...');

    const user = getAuthenticatedUser(request);
    console.log('👤 Auth result:', user ? { id: user.id, email: user.email, role: user.role } : 'null');

    if (!user) {
      console.log('❌ No user found in authentication');
      return NextResponse.json({
        success: false,
        error: 'Authentication failed'
      }, { status: 401 });
    }

    const workflowData = await request.json();
    console.log('🔧 Received workflow data:', {
      name: workflowData.name,
      nodeCount: workflowData.nodes?.length || 0,
      connectionCount: workflowData.connections?.length || 0
    });

    // Validate required fields
    if (!workflowData.name || !workflowData.name.trim()) {
      console.log('❌ Validation failed: Workflow name is required');
      return NextResponse.json({
        success: false,
        error: 'Workflow name is required'
      }, { status: 400 });
    }

    // Save workflow to database
    console.log('💾 Attempting to save workflow to database...');
    console.log('📋 Prisma data to create:', {
      name: workflowData.name.trim(),
      description: workflowData.description || null,
      createdBy: user.id,
      // tags: workflowData.tags || [],
      dataSize: JSON.stringify(workflowData).length
    });

    let workflow;
    try {
      workflow = await prisma.workflow.create({
        data: {
          name: workflowData.name.trim(),
          description: workflowData.description || null,
          data: workflowData, // Store the complete workflow structure
          createdBy: user.id,
          // tags: workflowData.tags || [], // Temporarily commented out
          isActive: workflowData.isActive !== undefined ? workflowData.isActive : true,
          isPublished: workflowData.isPublished || false,
          version: workflowData.version || 1
        }
      });

      console.log('✅ Workflow saved to database:', workflow.id);
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      return NextResponse.json({
        success: false,
        error: 'Database error',
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 });
    }

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
        // tags: workflow.tags,
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
