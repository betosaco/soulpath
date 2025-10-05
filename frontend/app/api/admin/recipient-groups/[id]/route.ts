import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/admin/recipient-groups/[id] - Get a specific recipient group
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const groupId = params.id;
    console.log(`🔍 GET /api/admin/recipient-groups/${groupId} - Starting request...`);

    const group = await prisma.recipientGroup.findUnique({
      where: {
        id: groupId,
        createdBy: user.id
      }
    });

    if (!group) {
      return NextResponse.json({
        error: 'Recipient group not found'
      }, { status: 404 });
    }

    console.log(`✅ Found recipient group: ${group.name}`);

    return NextResponse.json({
      success: true,
      group
    });

  } catch (error) {
    console.error('❌ Error fetching recipient group:', error);
    return NextResponse.json({
      error: 'Failed to fetch recipient group',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/admin/recipient-groups/[id] - Update a recipient group
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const groupId = params.id;
    const groupData = await request.json();
    console.log(`🔧 PUT /api/admin/recipient-groups/${groupId} - Updating group:`, groupData);

    // Check if group exists and belongs to user
    const existingGroup = await prisma.recipientGroup.findUnique({
      where: {
        id: groupId,
        createdBy: user.id
      }
    });

    if (!existingGroup) {
      return NextResponse.json({
        error: 'Recipient group not found'
      }, { status: 404 });
    }

    // Update group
    const updatedGroup = await prisma.recipientGroup.update({
      where: { id: groupId },
      data: {
        name: groupData.name?.trim() || existingGroup.name,
        description: groupData.description || existingGroup.description,
        role: groupData.role || existingGroup.role,
        scope: groupData.scope || existingGroup.scope,
        recipientIds: groupData.recipientIds || existingGroup.recipientIds,
        customEmails: groupData.customEmails || existingGroup.customEmails
      }
    });

    console.log('✅ Recipient group updated:', updatedGroup.id);

    return NextResponse.json({
      success: true,
      message: 'Recipient group updated successfully',
      group: updatedGroup
    });

  } catch (error) {
    console.error('❌ Error updating recipient group:', error);
    return NextResponse.json({
      error: 'Failed to update recipient group',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/admin/recipient-groups/[id] - Delete a recipient group
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const groupId = params.id;
    console.log(`🗑️ DELETE /api/admin/recipient-groups/${groupId} - Deleting group...`);

    // Check if group exists and belongs to user
    const existingGroup = await prisma.recipientGroup.findUnique({
      where: {
        id: groupId,
        createdBy: user.id
      }
    });

    if (!existingGroup) {
      return NextResponse.json({
        error: 'Recipient group not found'
      }, { status: 404 });
    }

    // Soft delete
    await prisma.recipientGroup.update({
      where: { id: groupId },
      data: { isActive: false }
    });

    console.log('✅ Recipient group soft-deleted:', groupId);

    return NextResponse.json({
      success: true,
      message: 'Recipient group deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting recipient group:', error);
    return NextResponse.json({
      error: 'Failed to delete recipient group',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
