import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const templates = await prisma.communicationTemplate.findMany({
      where: {
        isActive: true
      },
      include: {
        translations: {
          orderBy: {
            language: 'asc'
          }
        }
      },
      orderBy: {
        templateKey: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      templates
    });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch email templates'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}