import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateTicketSchema = z.object({
  subject: z.string().optional(),
  description: z.string().optional(),
  statusId: z.number().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  assignedAgentId: z.string().nullable().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  customFields: z.record(z.string(), z.any()).optional(),
});

// GET /api/communications/tickets/[id] - Get single ticket with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    const canViewAll = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT_AGENT'].includes(user.role);

    const where: any = { id };
    
    // Apply access control
    if (!canViewAll) {
      where.customerId = user.id;
    }

    const ticket = await prisma.ticket.findUnique({
      where,
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,
            status: true,
            createdAt: true,
            orders: {
              select: {
                id: true,
                orderNumber: true,
                subtotal: true,
                taxAmount: true,
                status: true,
                createdAt: true,
              },
              take: 5,
              orderBy: { createdAt: 'desc' },
            },
            bookings: {
              select: {
                id: true,
                status: true,
                sessionType: true,
                createdAt: true,
                serviceType: { select: { name: true } },
              },
              take: 5,
              orderBy: { createdAt: 'desc' },
            },
            // Get other recent tickets
            ticketsAsCustomer: {
              select: {
                id: true,
                ticketNumber: true,
                subject: true,
                priority: true,
                status: { select: { displayName: true, color: true } },
                createdAt: true,
              },
              where: { id: { not: id } },
              take: 5,
              orderBy: { createdAt: 'desc' },
            },
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
        assignedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        status: true,
        conversation: {
          select: {
            id: true,
            lastMessageAt: true,
            totalMessages: true,
            primaryChannel: true,
          },
        },
        notes: {
          include: {
            author: {
              select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        satisfactionRatings: {
          include: {
            customer: {
              select: {
                fullName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: {
            notes: true,
            satisfactionRatings: true,
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(ticket);

  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}

// PUT /api/communications/tickets/[id] - Update ticket
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Only agents/admins can update tickets
    const canUpdate = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT_AGENT'].includes(user.role);
    
    if (!canUpdate) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateTicketSchema.parse(body);

    // Get the existing ticket to compare changes
    const existingTicket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        status: true,
        assignedAgent: { select: { fullName: true } },
      },
    });

    if (!existingTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const updateData: any = { ...validatedData };

    // Handle status changes
    if (validatedData.statusId) {
      const newStatus = await prisma.ticketStatus.findUnique({
        where: { id: validatedData.statusId },
      });

      if (!newStatus) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }

      // Set resolution/closed timestamps for final statuses
      if (newStatus.isFinal && !existingTicket.resolvedAt) {
        updateData.resolvedAt = new Date();
        
        // Calculate resolution time
        const resolutionTimeMs = updateData.resolvedAt.getTime() - existingTicket.createdAt.getTime();
        updateData.resolutionTimeMinutes = Math.floor(resolutionTimeMs / (1000 * 60));
      }
    }

    // Handle assignment changes
    if (validatedData.assignedAgentId !== undefined) {
      updateData.assignedAt = validatedData.assignedAgentId ? new Date() : null;
      updateData.assignedById = user.id;
    }

    // Update the ticket
    const ticket = await prisma.ticket.update({
      where: { id },
      data: updateData,
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
      },
    });

    // Create system notes for significant changes
    const systemNotes = [];

    // Status change note
    if (validatedData.statusId && existingTicket.statusId !== validatedData.statusId) {
      const newStatus = await prisma.ticketStatus.findUnique({
        where: { id: validatedData.statusId },
      });
      
      systemNotes.push({
        content: `Status changed from ${existingTicket.status.displayName} to ${newStatus?.displayName}`,
        noteType: 'STATUS_CHANGE' as const,
      });
    }

    // Assignment change note
    if (validatedData.assignedAgentId !== undefined && existingTicket.assignedAgentId !== validatedData.assignedAgentId) {
      if (validatedData.assignedAgentId) {
        const newAgent = await prisma.user.findUnique({
          where: { id: validatedData.assignedAgentId },
          select: { fullName: true },
        });
        
        const previousAgent = existingTicket.assignedAgent?.fullName || 'Unassigned';
        systemNotes.push({
          content: `Assignment changed from ${previousAgent} to ${newAgent?.fullName || 'Unknown'}`,
          noteType: 'ASSIGNMENT' as const,
        });
      } else {
        systemNotes.push({
          content: `Assignment removed (was assigned to ${existingTicket.assignedAgent?.fullName || 'Unknown'})`,
          noteType: 'ASSIGNMENT' as const,
        });
      }
    }

    // Priority change note
    if (validatedData.priority && existingTicket.priority !== validatedData.priority) {
      systemNotes.push({
        content: `Priority changed from ${existingTicket.priority} to ${validatedData.priority}`,
        noteType: 'SYSTEM' as const,
      });
    }

    // Create system notes
    for (const note of systemNotes) {
      await prisma.ticketNote.create({
        data: {
          ...note,
          ticketId: id,
          authorId: user.id,
          isInternal: true,
        },
      });
    }

    // TODO: In a real implementation:
    // 1. Send notifications for status/assignment changes
    // 2. Update SLA timers
    // 3. Trigger automation rules
    // 4. Send real-time updates

    return NextResponse.json(ticket);

  } catch (error) {
    console.error('Error updating ticket:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}
