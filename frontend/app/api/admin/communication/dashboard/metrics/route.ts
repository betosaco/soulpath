import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    // Get date range for metrics
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // This would typically aggregate from message logs, workflow executions, etc.
    // For now, we'll return mock data that represents what a real implementation would provide

    const metrics = {
      messagesSent24h: {
        total: 1247,
        email: 892,
        sms: 156,
        telegram: 145,
        whatsapp: 45,
        instagram: 9
      },
      deliveryRate: {
        overall: 98.5,
        email: 99.2,
        sms: 97.8,
        telegram: 98.1
      },
      mostActiveWorkflow: {
        id: 'workflow-1',
        name: 'Order Confirmation Flow',
        executions: 145
      },
      recentErrors: [
        {
          id: 'error-1',
          workflowName: 'Payment Reminder',
          errorMessage: 'SMS provider timeout',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
        },
        {
          id: 'error-2',
          workflowName: 'Welcome Email',
          errorMessage: 'Template rendering failed',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        }
      ],
      messageVolume7d: [
        { date: '2024-10-01', email: 1200, sms: 180, telegram: 95, whatsapp: 45, instagram: 12 },
        { date: '2024-10-02', email: 1350, sms: 210, telegram: 110, whatsapp: 52, instagram: 15 },
        { date: '2024-10-03', email: 1180, sms: 165, telegram: 85, whatsapp: 38, instagram: 8 },
        { date: '2024-10-04', email: 1420, sms: 195, telegram: 125, whatsapp: 58, instagram: 18 },
        { date: '2024-10-05', email: 1380, sms: 175, telegram: 105, whatsapp: 48, instagram: 14 },
        { date: '2024-10-06', email: 1290, sms: 190, telegram: 115, whatsapp: 55, instagram: 16 },
        { date: '2024-10-07', email: 1450, sms: 200, telegram: 130, whatsapp: 60, instagram: 20 }
      ],
      activeWorkflows: 12,
      configuredTemplates: 45,
      systemHealth: {
        status: 'healthy' as const,
        score: 98.5,
        issues: []
      }
    };

    return NextResponse.json(metrics);

  } catch (error) {
    console.error('❌ Error fetching dashboard metrics:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
