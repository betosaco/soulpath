import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const testSmsSchema = z.object({
  phoneNumber: z.string().min(1, 'Phone number is required'),
  message: z.string().min(1, 'Message is required'),
  username: z.string().min(1, 'Username is required'),
  tokenApi: z.string().min(1, 'API token is required'),
  senderName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const body = await request.json();
    const { phoneNumber, message, username, tokenApi, senderName } = testSmsSchema.parse(body);

    // Send test SMS using LabsMobile API
    const authHeader = Buffer.from(`${username}:${tokenApi}`).toString('base64');
    
    const smsData = {
      message,
      tpoa: senderName || 'MatMax Yoga Studio',
      recipient: [
        {
          msisdn: phoneNumber
        }
      ]
    };

    const response = await fetch('https://api.labsmobile.com/json/send', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(smsData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Test SMS send error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: 'Failed to send test SMS' },
      { status: 500 }
    );
  }
}
