import { NextRequest, NextResponse } from 'next/server';
import { handleAdminAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/admin/communication/config - Starting request...');

    const auth = await handleAdminAuth(request);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    console.log('✅ User authenticated:', user.email);

    console.log('🔍 Fetching from communication_config table...');
    
    // Try to fetch from database first
    let config = await prisma.communicationConfig.findFirst();

    if (!config) {
      console.log('⚠️ No communication config found, creating default...');
      
      // Create default communication configuration
      config = await prisma.communicationConfig.create({
        data: {
          email_enabled: true,
          brevo_api_key: '',
          sender_email: 'noreply@matmax.world',
          sender_name: 'MATMAX Wellness Studio',
          admin_email: 'admin@matmax.world',
          sms_enabled: false,
          sms_provider: 'labsmobile',
          labsmobile_username: '',
          labsmobile_token: '',
          sms_sender_name: 'MATMAX Wellness Studio'
        }
      });
      
      console.log('✅ Default communication config created');
    }

    console.log('✅ Communication config fetched successfully:', config);
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('❌ Unexpected error in GET /api/admin/communication/config:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 PUT /api/admin/communication/config - Starting request...');

    const auth = await handleAdminAuth(request);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    console.log('✅ User authenticated:', user.email);
    const body = await request.json();
    console.log('📝 Request body:', body);
    
    // Try to update the table
    const config = await prisma.communicationConfig.upsert({
      where: { id: 1 },
      update: body,
      create: {
        id: 1,
        ...body
      }
    });

    console.log('✅ Communication config updated successfully:', config);
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('❌ Unexpected error in PUT /api/admin/communication/config:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}
