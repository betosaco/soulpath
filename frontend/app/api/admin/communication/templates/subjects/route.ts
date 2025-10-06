/**
 * 📧 Email Subject Templates API
 *
 * Provides endpoints for managing email subject templates in the Template Studio.
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthenticatedUser } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subjectTemplates = await prisma.emailSubjectTemplate.findMany({
      where: { isActive: true },
      select: {
        id: true,
        templateKey: true,
        template: true,
        placeholders: true,
        maxLength: true,
      },
      orderBy: { templateKey: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: subjectTemplates,
    });

  } catch (error) {
    console.error('Error fetching subject templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subject templates' },
      { status: 500 }
    );
  }
}
