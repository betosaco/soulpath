import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

// GET /api/communications/conversations/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
        assignedAgent: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        primaryChannel: {
          select: {
            id: true,
            name: true,
            displayName: true,
            description: true,
          },
        },
        _count: {
          select: {
            messages: true,
            tickets: true,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/communications/conversations/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      subject,
      status,
      priority,
      assignedAgentId,
      channelMetadata,
      botEnabled, // Custom field for bot control
    } = body;

    // Validate status if provided
    if (status && !['ACTIVE', 'ARCHIVED', 'CLOSED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Validate priority if provided
    if (priority && !['LOW', 'NORMAL', 'HIGH', 'URGENT'].includes(priority)) {
      return NextResponse.json({ error: 'Invalid priority' }, { status: 400 });
    }

    // Build update data
    const updateData: any = {};
    if (subject !== undefined) updateData.subject = subject;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (channelMetadata !== undefined) updateData.channelMetadata = channelMetadata;
    
    // Handle agent assignment
    if (assignedAgentId !== undefined) {
      updateData.assignedAgentId = assignedAgentId;
      if (assignedAgentId) {
        updateData.assignedAt = new Date();
      } else {
        updateData.assignedAt = null;
      }
    }

    // Handle bot control (stored in channelMetadata for now)
    if (botEnabled !== undefined) {
      updateData.channelMetadata = {
        ...updateData.channelMetadata,
        botEnabled,
        botUpdatedAt: new Date().toISOString(),
        botUpdatedBy: user.id,
      };
    }

    const updatedConversation = await prisma.conversation.update({
      where: { id: params.id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
        assignedAgent: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        primaryChannel: {
          select: {
            id: true,
            name: true,
            displayName: true,
            description: true,
          },
        },
        _count: {
          select: {
            messages: true,
            tickets: true,
          },
        },
      },
    });

    // Log the update for audit purposes
    if (assignedAgentId !== undefined || botEnabled !== undefined) {
      console.log(`Conversation ${params.id} updated by ${user.id}:`, {
        assignedAgentId,
        botEnabled,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(updatedConversation);
  } catch (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}