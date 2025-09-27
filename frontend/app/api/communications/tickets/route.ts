import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const createTicketSchema = z.object({
  customerId: z.string(),
  subject: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  conversationId: z.string().optional(),
  customFields: z.record(z.string(), z.any()).optional(),
});

// GET /api/communications/tickets - List tickets with filters
export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Only agents/admins can view all tickets; users see only their own
    const canViewAll = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT_AGENT'].includes(user.role);
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const statusId = searchParams.get('statusId');
    const priority = searchParams.get('priority') as 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | null;
    const assignedAgentId = searchParams.get('assignedAgentId');
    const customerId = searchParams.get('customerId');
    const category = searchParams.get('category');
    const search = searchParams.get('search'); // Search in subject and description

    const skip = (page - 1) * limit;

    const where: any = {};

    // Apply access control
    if (!canViewAll) {
      where.customerId = user.id;
    } else {
      // Apply filters for agents/admins
      if (customerId) where.customerId = customerId;
      if (assignedAgentId) {
        where.assignedAgentId = assignedAgentId === 'unassigned' ? null : assignedAgentId;
      }
    }

    // Apply common filters
    if (statusId) where.statusId = parseInt(statusId);
    if (priority) where.priority = priority;
    if (category) where.category = category;

    // Search functionality
    if (search) {
      where.OR = [
        { subject: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { ticketNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
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
          status: true,
          conversation: {
            select: {
              id: true,
              lastMessageAt: true,
              totalMessages: true,
            },
          },
          _count: {
            select: {
              notes: true,
              satisfactionRatings: true,
            },
          },
        },
        orderBy: [
          { priority: 'desc' }, // High priority first
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.ticket.count({ where }),
    ]);

    // Get summary statistics for the current filters (for agents/admins)
    let stats = null;
    if (canViewAll) {
      const statusCounts = await prisma.ticket.groupBy({
        by: ['statusId'],
        where: {
          ...where,
          OR: undefined, // Remove search from stats
        },
        _count: true,
      });

      const priorityCounts = await prisma.ticket.groupBy({
        by: ['priority'],
        where: {
          ...where,
          OR: undefined,
        },
        _count: true,
      });

      stats = {
        byStatus: statusCounts,
        byPriority: priorityCounts,
      };
    }

    return NextResponse.json({
      tickets,
      stats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// POST /api/communications/tickets - Create new ticket
export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createTicketSchema.parse(body);

    // Verify the customer exists
    const customer = await prisma.user.findUnique({
      where: { id: validatedData.customerId },
      select: { id: true, fullName: true, email: true },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Get the default ticket status (usually "open")
    const defaultStatus = await prisma.ticketStatus.findFirst({
      where: { isDefault: true },
    });

    if (!defaultStatus) {
      return NextResponse.json({ error: 'No default ticket status configured' }, { status: 500 });
    }

    // Generate ticket number
    const ticketCount = await prisma.ticket.count();
    const ticketNumber = `TKT-${String(ticketCount + 1).padStart(6, '0')}`;

    // Create the ticket
    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        customerId: validatedData.customerId,
        subject: validatedData.subject,
        description: validatedData.description,
        priority: validatedData.priority,
        category: validatedData.category,
        tags: validatedData.tags,
        conversationId: validatedData.conversationId,
        customFields: validatedData.customFields,
        statusId: defaultStatus.id,
        // Auto-assign based on rules (simplified - in real implementation, this would be more complex)
        // For now, we'll leave unassigned and let assignment rules handle it
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
        status: true,
        conversation: {
          select: {
            id: true,
            lastMessageAt: true,
            totalMessages: true,
          },
        },
      },
    });

    // Create initial note if created by an agent
    if (['ADMIN', 'SUPER_ADMIN', 'SUPPORT_AGENT'].includes(user.role)) {
      await prisma.ticketNote.create({
        data: {
          ticketId: ticket.id,
          content: `Ticket created by ${user.email}`,
          noteType: 'SYSTEM',
          authorId: user.id,
          isInternal: true,
        },
      });
    }

    // TODO: In a real implementation:
    // 1. Apply assignment rules
    // 2. Send notification to customer
    // 3. Set SLA due dates
    // 4. Trigger automation rules

    return NextResponse.json(ticket, { status: 201 });

  } catch (error) {
    console.error('Error creating ticket:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
