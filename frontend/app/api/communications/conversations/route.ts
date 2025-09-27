import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const createConversationSchema = z.object({
  customerId: z.string(),
  subject: z.string().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  primaryChannelId: z.number().optional(),
  channelMetadata: z.record(z.string(), z.any()).optional(),
});

const updateConversationSchema = z.object({
  subject: z.string().optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  assignedAgentId: z.string().nullable().optional(),
});

// GET /api/communications/conversations - List conversations with filters
export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Only agents/admins can view all conversations; users see only their own
    const canViewAll = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT_AGENT'].includes(user.role);
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') as 'ACTIVE' | 'ARCHIVED' | 'CLOSED' | null;
    const priority = searchParams.get('priority') as 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | null;
    const assignedAgentId = searchParams.get('assignedAgentId');
    const customerId = searchParams.get('customerId');
    const channelId = searchParams.get('channelId');

    const skip = (page - 1) * limit;

    const where: any = {};

    // Apply access control
    if (!canViewAll) {
      where.customerId = user.id;
    } else {
      // Apply filters for agents/admins
      if (customerId) where.customerId = customerId;
      if (assignedAgentId) where.assignedAgentId = assignedAgentId;
    }

    // Apply common filters
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (channelId) where.primaryChannelId = parseInt(channelId);

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              fullName: true,
              email: true,
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
          primaryChannel: true,
          _count: {
            select: {
              messages: true,
              tickets: true,
            },
          },
        },
        orderBy: [
          { lastMessageAt: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.conversation.count({ where }),
    ]);

    return NextResponse.json({
      conversations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// POST /api/communications/conversations - Create new conversation
export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Only agents/admins can create conversations
    const canCreate = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT_AGENT'].includes(user.role);
    
    if (!canCreate) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createConversationSchema.parse(body);

    // Verify the customer exists
    const customer = await prisma.user.findUnique({
      where: { id: validatedData.customerId },
      select: { id: true, fullName: true, email: true },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const conversation = await prisma.conversation.create({
      data: {
        ...validatedData,
        firstMessageAt: new Date(),
        lastMessageAt: new Date(),
      },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
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
        primaryChannel: true,
      },
    });

    return NextResponse.json(conversation, { status: 201 });

  } catch (error) {
    console.error('Error creating conversation:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
