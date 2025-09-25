import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    // Get Redis URL without exposing the full URL
    const redisUrl = process.env.REDIS_REDIS_URL || process.env.REDIS_URL;
    const hasRedisUrl = !!redisUrl;
    
    // Parse URL to get connection details (without exposing credentials)
    let connectionInfo = null;
    if (redisUrl) {
      try {
        const url = new URL(redisUrl);
        connectionInfo = {
          protocol: url.protocol,
          hostname: url.hostname,
          port: url.port,
          hasUsername: !!url.username,
          hasPassword: !!url.password,
          pathname: url.pathname
        };
      } catch (e) {
        connectionInfo = { error: 'Invalid URL format' };
      }
    }

    return NextResponse.json({
      success: true,
      environment: {
        hasRedisUrl,
        hasRedisHost: !!process.env.REDIS_HOST,
        hasRedisPassword: !!process.env.REDIS_PASSWORD,
        hasRedisUsername: !!process.env.REDIS_USERNAME,
        nodeEnv: process.env.NODE_ENV,
        connectionInfo
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Debug failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
