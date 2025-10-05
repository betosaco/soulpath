import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/admin/users/telegram - Starting request...');

    const user = await requireAuth(request);
    console.log('👤 Auth result:', user ? { id: user.id, email: user.email, role: user.role } : 'null');

    if (!user) {
      console.log('❌ No user found in authentication');
      return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 401 });
    }

    if (user.role !== 'ADMIN') {
      console.log('❌ User role is not ADMIN:', user.role);
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    console.log('✅ User authenticated:', user.email);

    // Fetch users with their Telegram information (only those with chat IDs)
    const users = await prisma.user.findMany({
      where: {
        telegramChatId: {
          not: null
        }
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        telegramChatId: true,
        telegramUsername: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`✅ Found ${users.length} users`);

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        id: user.id,
        name: user.fullName,
        email: user.email,
        telegram_chat_id: user.telegramChatId,
        telegram_username: user.telegramUsername
      }))
    });

  } catch (error) {
    console.error('❌ Unexpected error in GET /api/admin/users/telegram:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/admin/users/telegram - Starting request...');

    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, chatId, action } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    if (action === 'attach' && !chatId) {
      return NextResponse.json({ success: false, error: 'Chat ID is required for attach action' }, { status: 400 });
    }

    console.log(`✅ User authenticated: ${user.email}`);

    if (action === 'attach') {
      // Attach chat ID to user
      await prisma.user.update({
        where: { id: userId },
        data: { telegramChatId: chatId }
      });

      console.log(`✅ Attached chat ID ${chatId} to user ${userId}`);

      return NextResponse.json({
        success: true,
        message: 'Chat ID attached successfully',
        action: 'attach',
        userId,
        chatId
      });

    } else if (action === 'detach') {
      // Detach chat ID from user
      await prisma.user.update({
        where: { id: userId },
        data: { telegramChatId: null }
      });

      console.log(`✅ Detached chat ID from user ${userId}`);

      return NextResponse.json({
        success: true,
        message: 'Chat ID detached successfully',
        action: 'detach',
        userId
      });

    } else {
      return NextResponse.json({ success: false, error: 'Invalid action. Use "attach" or "detach"' }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Unexpected error in POST /api/admin/users/telegram:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}
