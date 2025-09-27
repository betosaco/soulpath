import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for creating channels
const createChannelSchema = z.object({
  name: z.string().min(1),
  displayName: z.string().min(1),
  description: z.string().optional(),
  configuration: z.record(z.string(), z.any()).optional(),
  isActive: z.boolean().default(true),
});

// GET /api/communications/channels - List all communication channels
export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const where: any = {};
    
    if (activeOnly) {
      where.isActive = true;
    }

    const channels = await prisma.communicationChannel.findMany({
      where,
      include: {
        _count: {
          select: {
            conversations: true,
            messages: {
              where: {
                createdAt: {
                  gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
                },
              },
            },
            webhooks: true,
          },
        },
      },
      orderBy: { displayName: 'asc' },
    });

    // For non-admin users, hide sensitive configuration data
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(user.role);
    
    const sanitizedChannels = channels.map(channel => ({
      ...channel,
      configuration: isAdmin ? channel.configuration : undefined,
    }));

    return NextResponse.json({ channels: sanitizedChannels });

  } catch (error) {
    console.error('Error fetching channels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channels' },
      { status: 500 }
    );
  }
}

// POST /api/communications/channels - Create new communication channel
export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Only admins can create channels
    const canCreate = ['ADMIN', 'SUPER_ADMIN'].includes(user.role);
    
    if (!canCreate) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createChannelSchema.parse(body);

    // Check if channel name already exists
    const existingChannel = await prisma.communicationChannel.findUnique({
      where: { name: validatedData.name },
    });

    if (existingChannel) {
      return NextResponse.json(
        { error: 'Channel with this name already exists' },
        { status: 409 }
      );
    }

    const channel = await prisma.communicationChannel.create({
      data: validatedData,
      include: {
        _count: {
          select: {
            conversations: true,
            messages: true,
            webhooks: true,
          },
        },
      },
    });

    return NextResponse.json(channel, { status: 201 });

  } catch (error) {
    console.error('Error creating channel:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create channel' },
      { status: 500 }
    );
  }
}
