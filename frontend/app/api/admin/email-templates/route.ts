import { NextRequest, NextResponse } from 'next/server';
import { prisma, withConnection } from '@/lib/prisma';
import { addCorsHeaders, handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS() {
  return handleCorsPreflight();
}

export async function GET() {
  try {
    const templates = await withConnection(async () => {
      return await prisma.communicationTemplate.findMany({
        include: {
          translations: true
        },
        orderBy: {
          name: 'asc'
      }
      });
    });

    return addCorsHeaders(NextResponse.json({
      success: true,
      templates
    }));

  } catch (error) {
    console.error('Error fetching email templates:', error);
    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'Failed to fetch email templates'
    }, { status: 500 }));
  }
}

export async function PUT(request: NextRequest) {
  try {
    const templateData = await request.json();
    
    const updatedTemplate = await withConnection(async () => {
      // Update the template
      await prisma.communicationTemplate.update({
        where: { id: templateData.id },
        data: {
          name: templateData.name,
          description: templateData.description,
          isActive: templateData.isActive
        }
      });

      // Update translations
      for (const translation of templateData.translations) {
        await prisma.communicationTemplateTranslation.update({
          where: { id: translation.id },
          data: {
            subject: translation.subject,
            content: translation.content
          }
        });
      }

      return prisma.communicationTemplate.findUnique({
        where: { id: templateData.id },
        include: {
          translations: true
        }
      });
    });

    return addCorsHeaders(NextResponse.json({
      success: true,
      template: updatedTemplate
    }));

  } catch (error) {
    console.error('Error updating email template:', error);
    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'Failed to update email template'
    }, { status: 500 }));
  }
}
