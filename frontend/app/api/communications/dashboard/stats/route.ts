import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/communications/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Only agents/admins can view dashboard stats
    const canView = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT_AGENT'].includes(user.role);
    
    if (!canView) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d'; // 1d, 7d, 30d

    // Calculate date range
    let dateRange: Date;
    switch (period) {
      case '1d':
        dateRange = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateRange = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default: // 7d
        dateRange = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }

    // Build where clauses for agent-specific data
    const isAgent = user.role === 'SUPPORT_AGENT';
    const agentFilter = isAgent ? { assignedAgentId: user.id } : {};

    // Get ticket statistics
    const [
      totalTickets,
      openTickets,
      ticketsByStatus,
      ticketsByPriority,
      recentTickets,
      overdueTickets,
    ] = await Promise.all([
      // Total tickets
      prisma.ticket.count({
        where: {
          ...agentFilter,
          createdAt: { gte: dateRange },
        },
      }),

      // Open tickets (not in final status)
      prisma.ticket.count({
        where: {
          ...agentFilter,
          status: {
            isFinal: false,
          },
        },
      }),

      // Tickets by status
      prisma.ticket.groupBy({
        by: ['statusId'],
        where: {
          ...agentFilter,
          createdAt: { gte: dateRange },
        },
        _count: true,
      }).then(async (results) => {
        const statuses = await prisma.ticketStatus.findMany({
          where: {
            id: { in: results.map(r => r.statusId) },
          },
        });
        
        return results.map(result => {
          const status = statuses.find(s => s.id === result.statusId);
          return {
            statusId: result.statusId,
            statusName: status?.displayName || 'Unknown',
            color: status?.color,
            count: result._count,
          };
        });
      }),

      // Tickets by priority
      prisma.ticket.groupBy({
        by: ['priority'],
        where: {
          ...agentFilter,
          createdAt: { gte: dateRange },
        },
        _count: true,
      }),

      // Recent tickets
      prisma.ticket.findMany({
        where: {
          ...agentFilter,
          createdAt: { gte: dateRange },
        },
        include: {
          customer: {
            select: {
              fullName: true,
              email: true,
              avatarUrl: true,
            },
          },
          status: {
            select: {
              displayName: true,
              color: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),

      // Overdue tickets (past SLA)
      prisma.ticket.count({
        where: {
          ...agentFilter,
          slaDueAt: { lt: new Date() },
          status: { isFinal: false },
        },
      }),
    ]);

    // Get conversation statistics
    const [
      totalConversations,
      activeConversations,
      conversationsByChannel,
    ] = await Promise.all([
      // Total conversations
      prisma.conversation.count({
        where: {
          ...agentFilter,
          createdAt: { gte: dateRange },
        },
      }),

      // Active conversations
      prisma.conversation.count({
        where: {
          ...agentFilter,
          status: 'ACTIVE',
        },
      }),

      // Conversations by channel
      prisma.conversation.groupBy({
        by: ['primaryChannelId'],
        where: {
          ...agentFilter,
          createdAt: { gte: dateRange },
        },
        _count: true,
      }).then(async (results) => {
        const channels = await prisma.communicationChannel.findMany({
          where: {
            id: { in: results.map(r => r.primaryChannelId).filter(Boolean) as number[] },
          },
        });
        
        return results.map(result => {
          const channel = result.primaryChannelId 
            ? channels.find(c => c.id === result.primaryChannelId)
            : null;
          return {
            channelId: result.primaryChannelId,
            channelName: channel?.displayName || 'Unknown',
            count: result._count,
          };
        });
      }),
    ]);

    // Get message statistics
    const [
      totalMessages,
      messagesIn24h,
      avgResponseTime,
    ] = await Promise.all([
      // Total messages in period
      prisma.message.count({
        where: {
          createdAt: { gte: dateRange },
          ...(isAgent && { senderId: user.id }),
        },
      }),

      // Messages in last 24 hours
      prisma.message.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          ...(isAgent && { senderId: user.id }),
        },
      }),

      // Average response time (simplified calculation)
      prisma.ticket.aggregate({
        where: {
          ...agentFilter,
          responseTimeMinutes: { not: null },
          createdAt: { gte: dateRange },
        },
        _avg: {
          responseTimeMinutes: true,
        },
      }).then(result => result._avg.responseTimeMinutes || 0),
    ]);

    // Get satisfaction ratings
    const satisfactionStats = await prisma.satisfactionRating.aggregate({
      where: {
        createdAt: { gte: dateRange },
        ...(isAgent && { agentId: user.id }),
      },
      _avg: {
        rating: true,
      },
      _count: true,
    });

    // Performance metrics for agents
    let performanceMetrics = null;
    if (isAgent) {
      performanceMetrics = await prisma.agentPerformanceMetric.findFirst({
        where: {
          agentId: user.id,
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today
          },
        },
      });
    }

    const stats = {
      period,
      tickets: {
        total: totalTickets,
        open: openTickets,
        overdue: overdueTickets,
        byStatus: ticketsByStatus,
        byPriority: ticketsByPriority,
        recent: recentTickets.slice(0, 5), // Limit to 5 for dashboard
      },
      conversations: {
        total: totalConversations,
        active: activeConversations,
        byChannel: conversationsByChannel,
      },
      messages: {
        total: totalMessages,
        in24h: messagesIn24h,
        avgResponseTimeMinutes: Math.round(avgResponseTime),
      },
      satisfaction: {
        averageRating: satisfactionStats._avg.rating 
          ? Math.round(satisfactionStats._avg.rating * 10) / 10 
          : null,
        totalRatings: satisfactionStats._count,
      },
      performance: performanceMetrics ? {
        ticketsAssigned: performanceMetrics.ticketsAssigned,
        ticketsResolved: performanceMetrics.ticketsResolved,
        avgFirstResponseTime: performanceMetrics.avgFirstResponseTime,
        avgResolutionTime: performanceMetrics.avgResolutionTime,
        customerSatisfactionScore: performanceMetrics.customerSatisfactionScore,
      } : null,
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
