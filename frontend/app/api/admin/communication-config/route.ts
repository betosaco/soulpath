import { NextRequest, NextResponse } from 'next/server';
import { prisma, withConnection } from '@/lib/prisma';
import { addCorsHeaders, handleCorsPreflight } from '@/lib/cors';

export async function OPTIONS() {
  return handleCorsPreflight();
}

export async function GET() {
  try {
    const config = await withConnection(async () => {
      return await prisma.communicationConfig.findFirst();
    });

    return addCorsHeaders(NextResponse.json({
      success: true,
      config
    }));

  } catch (error) {
    console.error('Error fetching communication config:', error);
    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'Failed to fetch communication config'
    }, { status: 500 }));
  }
}

export async function PUT(request: NextRequest) {
  try {
    const configData = await request.json();
    
    const updatedConfig = await withConnection(async () => {
      return await prisma.communicationConfig.upsert({
        where: { id: 1 },
        update: {
          email_enabled: configData.email_enabled,
          brevo_api_key: configData.brevo_api_key,
          sender_email: configData.sender_email,
          sender_name: configData.sender_name,
          admin_email: configData.admin_email
        },
        create: {
          email_enabled: configData.email_enabled,
          brevo_api_key: configData.brevo_api_key,
          sender_email: configData.sender_email,
          sender_name: configData.sender_name,
          admin_email: configData.admin_email
        }
      });
    });

    return addCorsHeaders(NextResponse.json({
      success: true,
      config: updatedConfig
    }));

  } catch (error) {
    console.error('Error updating communication config:', error);
    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'Failed to update communication config'
    }, { status: 500 }));
  }
}
