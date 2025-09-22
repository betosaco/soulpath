import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { telegramChatId } = await request.json();

    if (!telegramChatId) {
      return NextResponse.json(
        { success: false, error: 'Telegram chat ID is required' },
        { status: 400 }
      );
    }

    console.log('🔗 Linking Telegram account for user:', session.user.id, 'Chat ID:', telegramChatId);

    // Check if Telegram chat ID is already linked to another user
    const existingLink = await prisma.telegramUser.findFirst({
      where: {
        telegramChatId: telegramChatId.toString(),
        userId: { not: session.user.id }
      }
    });

    if (existingLink) {
      return NextResponse.json(
        { success: false, error: 'This Telegram account is already linked to another user' },
        { status: 409 }
      );
    }

    // Link or update Telegram account
    const telegramUser = await prisma.telegramUser.upsert({
      where: { userId: session.user.id },
      update: {
        telegramChatId: telegramChatId.toString(),
        isActive: true,
        lastInteraction: new Date(),
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        telegramChatId: telegramChatId.toString(),
        telegramUsername: session.user.name || undefined,
        telegramFirstName: session.user.name?.split(' ')[0] || undefined,
        telegramLastName: session.user.name?.split(' ').slice(1).join(' ') || undefined,
        isActive: true,
        lastInteraction: new Date()
      }
    });

    // Send welcome message via Telegram bot
    try {
      const telegramResponse = await fetch('https://telemax-1kpe0zyxd-matmaxworlds-projects.vercel.app/api/telegram/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          telegramChatId: telegramChatId.toString(),
          telegramUsername: session.user.name || undefined,
          telegramFirstName: session.user.name?.split(' ')[0] || undefined,
          telegramLastName: session.user.name?.split(' ').slice(1).join(' ') || undefined
        })
      });

      if (telegramResponse.ok) {
        console.log('✅ Welcome message sent to Telegram');
      } else {
        console.warn('⚠️ Could not send welcome message to Telegram');
      }
    } catch (telegramError) {
      console.warn('⚠️ Telegram welcome message failed:', telegramError);
      // Don't fail the account linking if Telegram message fails
    }

    return NextResponse.json({
      success: true,
      message: 'Telegram account linked successfully! You will now receive order notifications.',
      telegramUserId: telegramUser.id
    });

  } catch (error) {
    console.error('❌ Error linking Telegram account:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to link Telegram account' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get current Telegram link status
    const telegramUser = await prisma.telegramUser.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        telegramChatId: true,
        telegramUsername: true,
        isActive: true,
        lastInteraction: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      linked: !!telegramUser?.isActive,
      telegramUser: telegramUser || null
    });

  } catch (error) {
    console.error('❌ Error fetching Telegram link status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Telegram link status' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Unlink Telegram account
    await prisma.telegramUser.updateMany({
      where: { userId: session.user.id },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Telegram account unlinked successfully'
    });

  } catch (error) {
    console.error('❌ Error unlinking Telegram account:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unlink Telegram account' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
