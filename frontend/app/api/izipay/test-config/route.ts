import { NextResponse } from 'next/server';
import { getIzipayConfig } from '@/lib/izipay';

export async function GET() {
  try {
    const config = getIzipayConfig();
    
    return NextResponse.json({
      success: true,
      config: {
        username: config.USERNAME,
        apiBaseUrl: config.API_BASE_URL,
        hasPassword: !!config.PASSWORD,
        hasPublicKey: !!config.PUBLIC_KEY,
        hasHmacKey: !!config.HMAC_KEY,
        javascriptUrl: config.JAVASCRIPT_URL
      },
      environment: process.env.NODE_ENV,
      envVars: {
        IZIPAY_TEST_USERNAME: process.env.IZIPAY_TEST_USERNAME,
        IZIPAY_TEST_PASSWORD: process.env.IZIPAY_TEST_PASSWORD ? '***' : 'NOT_SET',
        IZIPAY_API_BASE_URL: process.env.IZIPAY_API_BASE_URL
      }
    });
  } catch (error) {
    console.error('Error testing config:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
