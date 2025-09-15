import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const testConfigSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  tokenApi: z.string().min(1, 'API token is required'),
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
    const { username, tokenApi } = testConfigSchema.parse(body);

    // Test connection by getting balance
    const authHeader = Buffer.from(`${username}:${tokenApi}`).toString('base64');
    
    const response = await fetch('https://api.labsmobile.com/json/balance', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const balance = await response.json();

    return NextResponse.json({
      success: true,
      balance
    });
  } catch (error) {
    console.error('Test SMS config error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: 'Failed to test SMS configuration' },
      { status: 500 }
    );
  }
}
