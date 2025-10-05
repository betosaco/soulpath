import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/admin/workflows/[id] - Get a specific workflow
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workflowId = params.id;
    console.log(`🔍 GET /api/admin/workflows/${workflowId} - Starting request...`);

    // Fetch workflow from database
    // Allow access to published templates even if not created by the user
    const workflow = await prisma.workflow.findUnique({
      where: {
        id: workflowId,
        OR: [
          { createdBy: user.id }, // User's own workflows
          { isPublished: true }   // Published templates
        ]
      }
    });

    if (!workflow) {
      return NextResponse.json({
        error: 'Workflow not found'
      }, { status: 404 });
    }

    console.log(`✅ Found workflow: ${workflow.name} (published: ${workflow.isPublished})`);

    return NextResponse.json({
      success: true,
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
        data: workflow.data, // Return full workflow data for editing
        nodeCount: (workflow.data as any)?.nodes?.length || 0,
        connectionCount: (workflow.data as any)?.connections?.length || 0
      }
    });

  } catch (error) {
    console.error('❌ Error fetching workflow:', error);
    return NextResponse.json({
      error: 'Failed to fetch workflow',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/admin/workflows/[id] - Update a workflow
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workflowId = params.id;
    const workflowData = await request.json();
    console.log(`🔧 PUT /api/admin/workflows/${workflowId} - Updating workflow:`, workflowData);

    // Validate required fields
    if (!workflowData.name || !workflowData.name.trim()) {
      return NextResponse.json({
        error: 'Workflow name is required'
      }, { status: 400 });
    }

    // Check if workflow exists and belongs to user
    const existingWorkflow = await prisma.workflow.findUnique({
      where: {
        id: workflowId,
        createdBy: user.id
      }
    });

    if (!existingWorkflow) {
      return NextResponse.json({
        error: 'Workflow not found'
      }, { status: 404 });
    }

    // Update workflow in database
    const updatedWorkflow = await prisma.workflow.update({
      where: { id: workflowId },
      data: {
        name: workflowData.name.trim(),
        description: workflowData.description || null,
        data: workflowData, // Store the complete workflow structure
        tags: workflowData.tags || [],
        isActive: workflowData.isActive !== undefined ? workflowData.isActive : existingWorkflow.isActive,
        isPublished: workflowData.isPublished !== undefined ? workflowData.isPublished : existingWorkflow.isPublished,
        version: workflowData.version || existingWorkflow.version
      }
    });

    console.log('✅ Workflow updated in database:', updatedWorkflow.id);

    return NextResponse.json({
      success: true,
      message: 'Workflow updated successfully',
      workflow: {
        id: updatedWorkflow.id,
        name: updatedWorkflow.name,
        description: updatedWorkflow.description,
        isActive: updatedWorkflow.isActive,
        isPublished: updatedWorkflow.isPublished,
        version: updatedWorkflow.version,
        tags: updatedWorkflow.tags,
        createdAt: updatedWorkflow.createdAt,
        updatedAt: updatedWorkflow.updatedAt,
        nodeCount: workflowData.nodes?.length || 0,
        connectionCount: workflowData.connections?.length || 0
      }
    });

  } catch (error) {
    console.error('❌ Error updating workflow:', error);
    return NextResponse.json({
      error: 'Failed to update workflow',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/admin/workflows/[id] - Delete a workflow
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workflowId = params.id;
    console.log(`🗑️ DELETE /api/admin/workflows/${workflowId} - Deleting workflow...`);

    // Check if workflow exists and belongs to user
    const existingWorkflow = await prisma.workflow.findUnique({
      where: {
        id: workflowId,
        createdBy: user.id
      }
    });

    if (!existingWorkflow) {
      return NextResponse.json({
        error: 'Workflow not found'
      }, { status: 404 });
    }

    // Soft delete by setting isActive to false (or hard delete if preferred)
    const deletedWorkflow = await prisma.workflow.update({
      where: { id: workflowId },
      data: { isActive: false }
    });

    console.log('✅ Workflow soft-deleted:', deletedWorkflow.id);

    return NextResponse.json({
      success: true,
      message: 'Workflow deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting workflow:', error);
    return NextResponse.json({
      error: 'Failed to delete workflow',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
