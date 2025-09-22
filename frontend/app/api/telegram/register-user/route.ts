import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TelegramUserRegistration {
  userId: string; // Our system user ID
  telegramChatId: string;
  telegramUserId?: string;
  telegramUsername?: string;
  telegramFirstName?: string;
  telegramLastName?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Telegram user registration API called');

    const registrationData: TelegramUserRegistration = await request.json();
    console.log('Registration data:', JSON.stringify(registrationData, null, 2));

    // Validate required fields
    if (!registrationData.userId || !registrationData.telegramChatId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId and telegramChatId' },
        { status: 400 }
      );
    }

    // Check if user exists in our system
    const user = await prisma.user.findUnique({
      where: { id: registrationData.userId }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found in system' },
        { status: 404 }
      );
    }

    // Check if Telegram user already exists
    const existingTelegramUser = await prisma.telegramUser.findFirst({
      where: {
        OR: [
          { userId: registrationData.userId },
          { telegramChatId: registrationData.telegramChatId }
        ]
      }
    });

    if (existingTelegramUser) {
      // Update existing record
      const updatedTelegramUser = await prisma.telegramUser.update({
        where: { id: existingTelegramUser.id },
        data: {
          telegramUserId: registrationData.telegramUserId,
          telegramUsername: registrationData.telegramUsername,
          telegramFirstName: registrationData.telegramFirstName,
          telegramLastName: registrationData.telegramLastName,
          isActive: true,
          lastInteraction: new Date(),
          updatedAt: new Date()
        }
      });

      console.log('✅ Telegram user updated:', updatedTelegramUser.id);
      return NextResponse.json({
        success: true,
        message: 'Telegram user updated successfully',
        telegramUserId: updatedTelegramUser.id
      });
    } else {
      // Create new Telegram user record
      const newTelegramUser = await prisma.telegramUser.create({
        data: {
          userId: registrationData.userId,
          telegramChatId: registrationData.telegramChatId,
          telegramUserId: registrationData.telegramUserId,
          telegramUsername: registrationData.telegramUsername,
          telegramFirstName: registrationData.telegramFirstName,
          telegramLastName: registrationData.telegramLastName,
          isActive: true,
          lastInteraction: new Date()
        }
      });

      console.log('✅ Telegram user created:', newTelegramUser.id);
      return NextResponse.json({
        success: true,
        message: 'Telegram user registered successfully',
        telegramUserId: newTelegramUser.id
      });
    }

  } catch (error) {
    console.error('❌ Error registering Telegram user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to register Telegram user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const telegramChatId = searchParams.get('telegramChatId');

    if (!userId && !telegramChatId) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or telegramChatId parameter' },
        { status: 400 }
      );
    }

    let telegramUser;

    if (userId) {
      telegramUser = await prisma.telegramUser.findFirst({
        where: { userId: userId, isActive: true }
      });
    } else if (telegramChatId) {
      telegramUser = await prisma.telegramUser.findFirst({
        where: { telegramChatId: telegramChatId, isActive: true }
      });
    }

    if (telegramUser) {
      return NextResponse.json({
        success: true,
        telegramUser: {
          id: telegramUser.id,
          userId: telegramUser.userId,
          telegramChatId: telegramUser.telegramChatId,
          telegramUsername: telegramUser.telegramUsername,
          telegramFirstName: telegramUser.telegramFirstName,
          telegramLastName: telegramUser.telegramLastName,
          isActive: telegramUser.isActive,
          lastInteraction: telegramUser.lastInteraction,
          notificationPreferences: telegramUser.notificationPreferences
        }
      });
    } else {
      return NextResponse.json({
        success: true,
        telegramUser: null
      });
    }

  } catch (error) {
    console.error('❌ Error fetching Telegram user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Telegram user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
