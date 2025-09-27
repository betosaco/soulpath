import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const url = new URL(request.url);
    const reset = url.searchParams.get('reset') === 'true';
    const customersCount = parseInt(url.searchParams.get('customers') || '3');
    const conversationsPerCustomer = parseInt(url.searchParams.get('conversationsPerCustomer') || '2');
    const messagesPerConversation = parseInt(url.searchParams.get('messagesPerConversation') || '6');

    // Optional reset: delete existing demo data created by this seeder
    if (reset) {
      await prisma.$transaction([
        prisma.message.deleteMany({}),
        prisma.ticketNote.deleteMany({}),
        prisma.ticket.deleteMany({}),
        prisma.conversation.deleteMany({}),
        // Do not delete users or channels globally by default
      ]);
    }

    // 1) Ensure demo channels
    const channelSpecs = [
      { name: 'email', displayName: 'Email' },
      { name: 'whatsapp', displayName: 'WhatsApp' },
      { name: 'live_chat', displayName: 'Live Chat' },
    ];

    const channels = [] as Array<{ id: number; name: string; displayName: string }>;
    for (const spec of channelSpecs) {
      const ch = await prisma.communicationChannel.upsert({
        where: { name: spec.name },
        update: { displayName: spec.displayName, isActive: true },
        create: { name: spec.name, displayName: spec.displayName, isActive: true },
      });
      channels.push({ id: ch.id, name: ch.name, displayName: ch.displayName });
    }

    // 2) Ensure ticket statuses
    const ticketStatuses = [
      { name: 'OPEN', displayName: 'Open', color: '#2563eb', isDefault: true, isFinal: false, order: 1 },
      { name: 'IN_PROGRESS', displayName: 'In Progress', color: '#f59e0b', isDefault: false, isFinal: false, order: 2 },
      { name: 'RESOLVED', displayName: 'Resolved', color: '#10b981', isDefault: false, isFinal: false, order: 3 },
      { name: 'CLOSED', displayName: 'Closed', color: '#6b7280', isDefault: false, isFinal: true, order: 4 },
    ];

    const statusMap: Record<string, number> = {};
    for (const s of ticketStatuses) {
      const up = await prisma.ticketStatus.upsert({
        where: { name: s.name },
        update: {
          displayName: s.displayName,
          color: s.color,
          isDefault: s.isDefault,
          isFinal: s.isFinal,
          displayOrder: s.order,
          isActive: true,
        },
        create: {
          name: s.name,
          displayName: s.displayName,
          color: s.color,
          isDefault: s.isDefault,
          isFinal: s.isFinal,
          displayOrder: s.order,
          isActive: true,
        },
      });
      statusMap[s.name] = up.id;
    }

    // 3) Create demo customers (or reuse existing by email)
    const customers = [] as Array<{ id: string; email: string; fullName: string }>;
    for (let i = 1; i <= customersCount; i++) {
      const email = `customer${i}@example.com`;
      const fullName = `Customer ${i}`;
      const cust = await prisma.user.upsert({
        where: { email },
        update: { fullName, role: 'USER', status: 'ACTIVE' },
        create: {
          email,
          fullName,
          role: 'USER',
          status: 'ACTIVE',
          language: 'en',
        },
      });
      customers.push({ id: cust.id, email: cust.email, fullName: cust.fullName || fullName });
    }

    // 4) Seed conversations + messages + tickets
    const seeded: Array<{ conversationId: string; ticketId?: string }> = [];

    for (const customer of customers) {
      for (let c = 1; c <= conversationsPerCustomer; c++) {
        const channel = channels[(c - 1) % channels.length];

        const conversation = await prisma.conversation.create({
          data: {
            customerId: customer.id,
            subject: `Inquiry ${c} from ${customer.fullName}`,
            status: 'ACTIVE',
            priority: (['LOW', 'NORMAL', 'HIGH'][c % 3] as 'LOW' | 'NORMAL' | 'HIGH'),
            primaryChannelId: channel.id,
            firstMessageAt: new Date(Date.now() - 60 * 60 * 1000),
            lastMessageAt: new Date(),
            totalMessages: 0,
            agentMessagesCount: 0,
            customerMessagesCount: 0,
          },
        });

        // Create alternating messages between customer and agent (current admin user as agent)
        let total = 0;
        let agentCount = 0;
        let customerCount = 0;
        for (let m = 1; m <= messagesPerConversation; m++) {
          const isAgent = m % 2 === 0;
          await prisma.message.create({
            data: {
              conversationId: conversation.id,
              content: isAgent
                ? `Agent response ${m} to ${customer.fullName}`
                : `Customer message ${m} from ${customer.fullName}`,
              messageType: 'TEXT',
              senderType: isAgent ? 'AGENT' : 'CUSTOMER',
              senderId: isAgent ? user.id : customer.id,
              channelId: channel.id,
              sentAt: new Date(Date.now() - (messagesPerConversation - m) * 5 * 60 * 1000),
              status: 'DELIVERED',
            },
          });
          total += 1;
          if (isAgent) agentCount += 1; else customerCount += 1;
        }

        // Update conversation counters
        await prisma.conversation.update({
          where: { id: conversation.id },
          data: {
            totalMessages: total,
            agentMessagesCount: agentCount,
            customerMessagesCount: customerCount,
            lastAgentResponseAt: agentCount > 0 ? new Date() : undefined,
            lastCustomerMessageAt: customerCount > 0 ? new Date() : undefined,
          },
        });

        // Create a ticket linked to this conversation (always)
        const statusId = statusMap[c % 3 === 0 ? 'IN_PROGRESS' : 'OPEN'];
        const ticket = await prisma.ticket.create({
          data: {
            ticketNumber: `T-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            customerId: customer.id,
            subject: `Support needed for inquiry ${c}`,
            description: 'Automatically generated test ticket',
            statusId,
            priority: (['LOW', 'NORMAL', 'HIGH', 'URGENT'][c % 4] as 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'),
            assignedAgentId: user.id,
            assignedAt: new Date(),
            assignedById: user.id,
            conversationId: conversation.id,
            category: 'General',
            tags: ['seed', 'test'],
          },
        });

        // Add demo ticket notes
        await prisma.ticketNote.createMany({
          data: [
            {
              ticketId: ticket.id,
              content: 'Initial note: reviewing the customer inquiry.',
              noteType: 'NOTE',
              authorId: user.id,
              mentions: [],
              isInternal: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              ticketId: ticket.id,
              content: 'Status updated to reflect current progress.',
              noteType: 'STATUS_CHANGE',
              authorId: user.id,
              mentions: [],
              isInternal: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        });

        seeded.push({ conversationId: conversation.id, ticketId: ticket.id });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Communications demo data seeded',
      details: {
        channels,
        customers: customers.map(c => ({ id: c.id, email: c.email })),
        created: seeded,
      }
    });
  } catch (error) {
    console.error('❌ Error seeding communications data:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to seed communications data',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
