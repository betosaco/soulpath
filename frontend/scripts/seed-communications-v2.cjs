#!/usr/bin/env node
/*
  Seed Communications V2
  - CommonJS script to seed multi-channel conversations, messages, and tickets
  - Usage:
      node scripts/seed-communications-v2.cjs --customers=5 --conversations=3 --messages=8 --reset
*/

// Load env if available
try {
  require('dotenv').config({ path: '../../.env.local' });
} catch {}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function getArg(name, def) {
  const match = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (!match) return def;
  const val = match.split('=')[1];
  if (val === 'true') return true;
  if (val === 'false') return false;
  const num = Number(val);
  return Number.isNaN(num) ? val : num;
}

async function ensureChannels() {
  const specs = [
    { name: 'email', displayName: 'Email' },
    { name: 'whatsapp', displayName: 'WhatsApp' },
    { name: 'live_chat', displayName: 'Live Chat' },
    { name: 'sms', displayName: 'SMS' },
    { name: 'instagram', displayName: 'Instagram' },
  ];
  const out = [];
  for (const s of specs) {
    const ch = await prisma.communicationChannel.upsert({
      where: { name: s.name },
      update: { displayName: s.displayName, isActive: true },
      create: { name: s.name, displayName: s.displayName, isActive: true },
    });
    out.push(ch);
  }
  return out;
}

async function ensureTicketStatuses() {
  const statuses = [
    { name: 'OPEN', displayName: 'Open', color: '#2563eb', isDefault: true, isFinal: false, order: 1 },
    { name: 'IN_PROGRESS', displayName: 'In Progress', color: '#f59e0b', isDefault: false, isFinal: false, order: 2 },
    { name: 'RESOLVED', displayName: 'Resolved', color: '#10b981', isDefault: false, isFinal: false, order: 3 },
    { name: 'CLOSED', displayName: 'Closed', color: '#6b7280', isDefault: false, isFinal: true, order: 4 },
  ];
  const map = {};
  for (const s of statuses) {
    const up = await prisma.ticketStatus.upsert({
      where: { name: s.name },
      update: { displayName: s.displayName, color: s.color, isDefault: s.isDefault, isFinal: s.isFinal, displayOrder: s.order, isActive: true },
      create: { name: s.name, displayName: s.displayName, color: s.color, isDefault: s.isDefault, isFinal: s.isFinal, displayOrder: s.order, isActive: true },
    });
    map[s.name] = up.id;
  }
  return map;
}

async function ensureAdmin() {
  // Use a known admin if exists, else create a local admin
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@matmax.world';
  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN', status: 'ACTIVE', fullName: 'Seed Admin' },
    create: { email, role: 'ADMIN', status: 'ACTIVE', fullName: 'Seed Admin', language: 'en' },
  });
  return admin;
}

async function run() {
  const customersCount = getArg('customers', 5);
  const conversationsPerCustomer = getArg('conversations', 3);
  const messagesPerConversation = getArg('messages', 8);
  const reset = !!getArg('reset', false);

  console.log('🌱 Seeding communications (v2) with params:', {
    customersCount, conversationsPerCustomer, messagesPerConversation, reset,
  });

  if (reset) {
    console.log('🧹 Resetting demo data...');
    await prisma.$transaction([
      prisma.message.deleteMany({}),
      prisma.ticketNote.deleteMany({}),
      prisma.ticket.deleteMany({}),
      prisma.conversation.deleteMany({}),
    ]);
  }

  const [channels, statusMap, admin] = await Promise.all([
    ensureChannels(),
    ensureTicketStatuses(),
    ensureAdmin(),
  ]);

  // Create demo customers
  const customers = [];
  for (let i = 1; i <= customersCount; i++) {
    const email = `customer${i}@example.com`;
    const fullName = `Customer ${i}`;
    const u = await prisma.user.upsert({
      where: { email },
      update: { fullName, role: 'USER', status: 'ACTIVE' },
      create: { email, fullName, role: 'USER', status: 'ACTIVE', language: 'en' },
    });
    customers.push(u);
  }

  // Seed conversations/messages/tickets
  for (const customer of customers) {
    for (let c = 1; c <= conversationsPerCustomer; c++) {
      const channel = channels[(c - 1) % channels.length];
      const priorityArray = ['LOW', 'NORMAL', 'HIGH'];
      const priority = priorityArray[c % priorityArray.length];

      const conv = await prisma.conversation.create({
        data: {
          customerId: customer.id,
          subject: `Inquiry ${c} from ${customer.fullName || customer.email}`,
          status: 'ACTIVE',
          priority,
          primaryChannelId: channel.id,
          firstMessageAt: new Date(Date.now() - 90 * 60 * 1000),
          lastMessageAt: new Date(),
          totalMessages: 0,
          agentMessagesCount: 0,
          customerMessagesCount: 0,
        },
      });

      let total = 0; let agentCount = 0; let customerCount = 0;
      for (let m = 1; m <= messagesPerConversation; m++) {
        const isAgent = m % 2 === 0;
        await prisma.message.create({
          data: {
            conversationId: conv.id,
            content: isAgent ? `Agent response ${m}` : `Customer message ${m}`,
            messageType: 'TEXT',
            senderType: isAgent ? 'AGENT' : 'CUSTOMER',
            senderId: isAgent ? admin.id : customer.id,
            channelId: channel.id,
            sentAt: new Date(Date.now() - (messagesPerConversation - m) * 3 * 60 * 1000),
            status: 'DELIVERED',
          },
        });
        total++;
        if (isAgent) agentCount++; else customerCount++;
      }

      await prisma.conversation.update({
        where: { id: conv.id },
        data: {
          totalMessages: total,
          agentMessagesCount: agentCount,
          customerMessagesCount: customerCount,
          lastAgentResponseAt: agentCount ? new Date() : null,
          lastCustomerMessageAt: customerCount ? new Date() : null,
        },
      });

      const ticket = await prisma.ticket.create({
        data: {
          ticketNumber: `T-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          customerId: customer.id,
          subject: `Support: Issue ${c}`,
          description: 'Seeded ticket for testing unified communications',
          statusId: statusMap[c % 2 === 0 ? 'OPEN' : 'IN_PROGRESS'],
          priority: (['LOW', 'NORMAL', 'HIGH', 'URGENT'][c % 4]),
          assignedAgentId: admin.id,
          assignedAt: new Date(),
          assignedById: admin.id,
          conversationId: conv.id,
          category: 'General',
          tags: ['seed', 'v2'],
        },
      });

      await prisma.ticketNote.createMany({
        data: [
          { ticketId: ticket.id, content: 'Initial investigation started.', noteType: 'NOTE', authorId: admin.id, mentions: [], isInternal: true, createdAt: new Date(), updatedAt: new Date() },
          { ticketId: ticket.id, content: 'Customer updated with ETA.', noteType: 'STATUS_CHANGE', authorId: admin.id, mentions: [], isInternal: false, createdAt: new Date(), updatedAt: new Date() },
        ],
      });
    }
  }

  console.log('✅ Seed completed.');
}

run()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


