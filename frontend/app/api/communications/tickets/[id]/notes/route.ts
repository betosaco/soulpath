import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for creating notes
const createNoteSchema = z.object({
  content: z.string().min(1),
  noteType: z.enum(['NOTE', 'STATUS_CHANGE', 'ASSIGNMENT', 'SYSTEM']).default('NOTE'),
  mentions: z.array(z.string()).default([]), // Array of user IDs
  attachments: z.array(z.object({
    type: z.string(),
    url: z.string(),
    name: z.string().optional(),
    size: z.number().optional(),
    mimeType: z.string().optional(),
  })).optional(),
  isInternal: z.boolean().default(true),
});

// POST /api/communications/tickets/[id]/notes - Add note to ticket
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Only agents/admins can add notes to tickets
    const canAddNote = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT_AGENT'].includes(user.role);
    
    if (!canAddNote) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id: ticketId } = await params;
    const body = await request.json();
    const validatedData = createNoteSchema.parse(body);

    // Verify ticket exists
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { id: true, customerId: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Create the note
    const note = await prisma.ticketNote.create({
      data: {
        ...validatedData,
        ticketId,
        authorId: user.id,
      },
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
    });

    // Send notifications to mentioned users
    if (validatedData.mentions.length > 0) {
      // TODO: In a real implementation, send notifications to mentioned users
      // This could be email notifications, in-app notifications, etc.
      console.log('Mentioned users:', validatedData.mentions);
    }

    // Update ticket's last activity
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(note, { status: 201 });

  } catch (error) {
    console.error('Error creating ticket note:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}

// GET /api/communications/tickets/[id]/notes - Get notes for a ticket
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id: ticketId } = await params;
    const { searchParams } = new URL(request.url);
    const includeInternal = searchParams.get('includeInternal') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Verify ticket access
    const canViewAll = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT_AGENT'].includes(user.role);
    
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { 
        id: true, 
        customerId: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const isOwner = ticket.customerId === user.id;
    
    if (!canViewAll && !isOwner) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const skip = (page - 1) * limit;

    const where: any = {
      ticketId,
    };

    // Customers can only see non-internal notes unless specifically requested
    if (!canViewAll || !includeInternal) {
      where.isInternal = false;
    }

    const [notes, total] = await Promise.all([
      prisma.ticketNote.findMany({
        where,
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
        skip,
        take: limit,
      }),
      prisma.ticketNote.count({ where }),
    ]);

    return NextResponse.json({
      notes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching ticket notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}
