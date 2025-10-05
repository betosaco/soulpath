import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    const includeInactive = url.searchParams.get('includeInactive') === 'true';

    if (!role) {
      return NextResponse.json({
        error: 'Role parameter is required'
      }, { status: 400 });
    }

    console.log(`👥 Fetching users by role: ${role}`);

    // Map role parameter to database role values
    const roleMapping: { [key: string]: string } = {
      'CLIENT': 'CLIENT',
      'TEACHER': 'TEACHER',
      'ADMIN': 'ADMIN',
      'USER': 'USER',
      'ALL': 'ALL' // Special case for all users
    };

    const dbRole = roleMapping[role];
    if (!dbRole) {
      return NextResponse.json({
        error: 'Invalid role parameter'
      }, { status: 400 });
    }

    let users;
    if (dbRole === 'ALL') {
      // Get all active users
      users = await prisma.user.findMany({
        where: {
          status: includeInactive ? undefined : 'ACTIVE'
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          status: true,
          telegramChatId: true,
          createdAt: true
        },
        orderBy: {
          fullName: 'asc'
        }
      });
    } else {
      // Get users by specific role
      users = await prisma.user.findMany({
        where: {
          role: dbRole,
          status: includeInactive ? undefined : 'ACTIVE'
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          status: true,
          telegramChatId: true,
          createdAt: true
        },
        orderBy: {
          fullName: 'asc'
        }
      });
    }

    console.log(`✅ Found ${users.length} users for role ${role}`);

    return NextResponse.json({
      success: true,
      role,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        fullName: user.fullName || user.email,
        role: user.role,
        status: user.status,
        telegramChatId: user.telegramChatId,
        displayName: user.fullName ? `${user.fullName} (${user.email})` : user.email
      }))
    });

  } catch (error) {
    console.error('❌ Error fetching users by role:', error);
    return NextResponse.json({
      error: 'Failed to fetch users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
