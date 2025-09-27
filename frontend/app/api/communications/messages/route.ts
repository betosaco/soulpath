import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for creating messages
const createMessageSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1),
  messageType: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO', 'LOCATION', 'CONTACT']).default('TEXT'),
  channelId: z.number(),
  attachments: z.array(z.object({
    type: z.string(),
    url: z.string(),
    name: z.string().optional(),
    size: z.number().optional(),
    mimeType: z.string().optional(),
  })).optional(),
  replyToMessageId: z.string().optional(),
  externalMessageId: z.string().optional(),
  channelMetadata: z.record(z.string(), z.any()).optional(),
});

// POST /api/communications/messages - Send a new message
export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createMessageSchema.parse(body);

    // Verify conversation exists and user has access
    const conversation = await prisma.conversation.findUnique({
      where: { id: validatedData.conversationId },
      include: {
        customer: { select: { id: true } },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Check permissions
    const isCustomer = conversation.customer.id === user.id;
    const isAgent = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT_AGENT'].includes(user.role);
    const isAssignedAgent = conversation.assignedAgentId === user.id;

    if (!isCustomer && !isAgent) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Determine sender type
    let senderType: 'CUSTOMER' | 'AGENT';
    if (isCustomer) {
      senderType = 'CUSTOMER';
    } else {
      senderType = 'AGENT';
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        ...validatedData,
        senderId: user.id,
        senderType,
        sentAt: new Date(),
        status: 'DELIVERED', // In real implementation, this might start as 'PENDING'
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        channel: true,
        replyToMessage: {
          select: {
            id: true,
            content: true,
            senderType: true,
            sender: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    // Update conversation's last message timestamp
    await prisma.conversation.update({
      where: { id: validatedData.conversationId },
      data: {
        lastMessageAt: new Date(),
        ...(senderType === 'AGENT' && { lastAgentResponseAt: new Date() }),
        ...(senderType === 'CUSTOMER' && { lastCustomerMessageAt: new Date() }),
      },
    });

    // TODO: In a real implementation, you would also:
    // 1. Send the message through the appropriate channel (WhatsApp, email, etc.)
    // 2. Trigger any automation rules
    // 3. Check if this creates SLA violations
    // 4. Send real-time updates via WebSocket

    return NextResponse.json(message, { status: 201 });

  } catch (error) {
    console.error('Error sending message:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// GET /api/communications/messages - Get messages for a conversation
export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const messageType = searchParams.get('messageType');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 }
      );
    }

    // Verify conversation access
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { 
        id: true, 
        customerId: true, 
        assignedAgentId: true 
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const isCustomer = conversation.customerId === user.id;
    const isAgent = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT_AGENT'].includes(user.role);

    if (!isCustomer && !isAgent) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const skip = (page - 1) * limit;

    const where: any = {
      conversationId,
    };

    if (messageType) {
      where.messageType = messageType;
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
            },
          },
          channel: true,
          replyToMessage: {
            select: {
              id: true,
              content: true,
              senderType: true,
              sender: {
                select: {
                  fullName: true,
                },
              },
            },
          },
        },
        orderBy: { sentAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.message.count({ where }),
    ]);

    // Mark messages as read if user is viewing them
    // Only mark as read if the user is not the sender
    const messagesToMarkAsRead = messages.filter(
      msg => msg.senderId !== user.id && msg.status !== 'READ'
    );

    if (messagesToMarkAsRead.length > 0) {
      await prisma.message.updateMany({
        where: {
          id: { in: messagesToMarkAsRead.map(m => m.id) },
        },
        data: {
          status: 'READ',
          readAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
