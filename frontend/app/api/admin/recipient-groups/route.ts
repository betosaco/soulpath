import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const groupData = await request.json();
    console.log('👥 Creating recipient group:', groupData);

    // Validate required fields
    if (!groupData.name || !groupData.name.trim()) {
      return NextResponse.json({
        error: 'Group name is required'
      }, { status: 400 });
    }

    if (!groupData.role) {
      return NextResponse.json({
        error: 'Role is required'
      }, { status: 400 });
    }

    // Create recipient group
    const group = await prisma.recipientGroup.create({
      data: {
        name: groupData.name.trim(),
        description: groupData.description || null,
        role: groupData.role,
        scope: groupData.scope || 'ALL',
        recipientIds: groupData.recipientIds || [],
        customEmails: groupData.customEmails || [],
        createdBy: user.id
      }
    });

    console.log('✅ Recipient group created:', group.id);

    return NextResponse.json({
      success: true,
      message: 'Recipient group created successfully',
      group
    });

  } catch (error) {
    console.error('❌ Error creating recipient group:', error);
    return NextResponse.json({
      error: 'Failed to create recipient group',
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

    // Get query parameters
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Fetch recipient groups
    const whereClause: any = {
      createdBy: user.id,
      isActive: true
    };

    if (role) {
      whereClause.role = role;
    }

    const groups = await prisma.recipientGroup.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        description: true,
        role: true,
        scope: true,
        recipientIds: true,
        customEmails: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: Math.min(limit, 100),
      skip: offset
    });

    // Get total count
    const totalCount = await prisma.recipientGroup.count({
      where: whereClause
    });

    console.log(`✅ Fetched ${groups.length} recipient groups for user ${user.id}`);

    return NextResponse.json({
      success: true,
      groups,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + groups.length < totalCount
      }
    });

  } catch (error) {
    console.error('❌ Error fetching recipient groups:', error);
    return NextResponse.json({
      error: 'Failed to fetch recipient groups',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
