#!/usr/bin/env node

/*
  Seed communications data (channels, customers, conversations, messages, tickets, notes)
  Usage:
    node scripts/seed-communications.js [--reset] [--customers=3] [--conversations=2] [--messages=6]
*/

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { reset: false, customers: 3, conversations: 2, messages: 6 };
  for (const arg of args) {
    if (arg === '--reset') opts.reset = true;
    else if (arg.startsWith('--customers=')) opts.customers = parseInt(arg.split('=')[1] || '3');
    else if (arg.startsWith('--conversations=')) opts.conversations = parseInt(arg.split('=')[1] || '2');
    else if (arg.startsWith('--messages=')) opts.messages = parseInt(arg.split('=')[1] || '6');
  }
  return opts;
}

async function main() {
  const { reset, customers, conversations, messages } = parseArgs();
  console.log('🔧 Communications seeding started', { reset, customers, conversations, messages });

  if (reset) {
    console.log('🧹 Resetting existing conversations/messages/tickets...');
    await prisma.$transaction([
      prisma.ticketNote.deleteMany({}),
      prisma.message.deleteMany({}),
      prisma.ticket.deleteMany({}),
      prisma.conversation.deleteMany({}),
    ]);
  }

  // Ensure channels
  const channelSpecs = [
    { name: 'email', displayName: 'Email' },
    { name: 'whatsapp', displayName: 'WhatsApp' },
    { name: 'live_chat', displayName: 'Live Chat' },
  ];
  const channels = [];
  for (const spec of channelSpecs) {
    const ch = await prisma.communicationChannel.upsert({
      where: { name: spec.name },
      update: { displayName: spec.displayName, isActive: true },
      create: { name: spec.name, displayName: spec.displayName, isActive: true },
    });
    channels.push(ch);
  }
  console.log('✅ Channels ensured:', channels.map(c => c.name).join(', '));

  // Ensure ticket statuses
  const ticketStatuses = [
    { name: 'OPEN', displayName: 'Open', color: '#2563eb', isDefault: true, isFinal: false, order: 1 },
    { name: 'IN_PROGRESS', displayName: 'In Progress', color: '#f59e0b', isDefault: false, isFinal: false, order: 2 },
    { name: 'RESOLVED', displayName: 'Resolved', color: '#10b981', isDefault: false, isFinal: false, order: 3 },
    { name: 'CLOSED', displayName: 'Closed', color: '#6b7280', isDefault: false, isFinal: true, order: 4 },
  ];
  const statusMap = {};
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
  console.log('✅ Ticket statuses ensured');

  // Ensure an admin agent user to assign
  const adminEmail = 'admin@soulpath.lat';
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN', status: 'ACTIVE', fullName: 'Admin Agent' },
    create: { email: adminEmail, role: 'ADMIN', status: 'ACTIVE', fullName: 'Admin Agent' },
    select: { id: true, email: true }
  });

  // Create demo customers
  const customerResults = [];
  for (let i = 1; i <= customers; i++) {
    const email = `customer${i}@example.com`;
    const fullName = `Customer ${i}`;
    const cust = await prisma.user.upsert({
      where: { email },
      update: { fullName, role: 'USER', status: 'ACTIVE' },
      create: { email, fullName, role: 'USER', status: 'ACTIVE', language: 'en' },
      select: { id: true, email: true, fullName: true }
    });
    customerResults.push(cust);
  }
  console.log(`✅ Customers ensured: ${customerResults.length}`);

  // Seed conversations + messages + tickets
  let convCount = 0, msgCount = 0, ticketCount = 0, noteCount = 0;
  for (const customer of customerResults) {
    for (let c = 1; c <= conversations; c++) {
      const channel = channels[(c - 1) % channels.length];
      const conversation = await prisma.conversation.create({
        data: {
          customerId: customer.id,
          subject: `Inquiry ${c} from ${customer.fullName}`,
          status: 'ACTIVE',
          priority: ['LOW', 'NORMAL', 'HIGH'][c % 3],
          primaryChannelId: channel.id,
          firstMessageAt: new Date(Date.now() - 60 * 60 * 1000),
          lastMessageAt: new Date(),
          totalMessages: 0,
          agentMessagesCount: 0,
          customerMessagesCount: 0,
        },
      });
      convCount += 1;

      // Messages
      let total = 0, aCount = 0, uCount = 0;
      for (let m = 1; m <= messages; m++) {
        const isAgent = m % 2 === 0;
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            content: isAgent ? `Agent response ${m} to ${customer.fullName}` : `Customer message ${m} from ${customer.fullName}`,
            messageType: 'TEXT',
            senderType: isAgent ? 'AGENT' : 'CUSTOMER',
            senderId: isAgent ? admin.id : customer.id,
            channelId: channel.id,
            sentAt: new Date(Date.now() - (messages - m) * 5 * 60 * 1000),
            status: 'DELIVERED',
          },
        });
        total++; if (isAgent) aCount++; else uCount++;
      }
      msgCount += messages;
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          totalMessages: total,
          agentMessagesCount: aCount,
          customerMessagesCount: uCount,
          lastAgentResponseAt: aCount > 0 ? new Date() : null,
          lastCustomerMessageAt: uCount > 0 ? new Date() : null,
        }
      });

      // Ticket + notes
      const statusId = statusMap[c % 3 === 0 ? 'IN_PROGRESS' : 'OPEN'];
      const ticket = await prisma.ticket.create({
        data: {
          ticketNumber: `T-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          customerId: customer.id,
          subject: `Support needed for inquiry ${c}`,
          description: 'Automatically generated test ticket',
          statusId,
          priority: ['LOW', 'NORMAL', 'HIGH', 'URGENT'][c % 4],
          assignedAgentId: admin.id,
          assignedAt: new Date(),
          assignedById: admin.id,
          conversationId: conversation.id,
          category: 'General',
          tags: ['seed', 'test'],
        }
      });
      ticketCount += 1;

      const notesCreated = await prisma.ticketNote.createMany({
        data: [
          {
            ticketId: ticket.id,
            content: 'Initial note: reviewing the customer inquiry.',
            noteType: 'NOTE',
            authorId: admin.id,
            mentions: [],
            isInternal: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            ticketId: ticket.id,
            content: 'Status updated to reflect current progress.',
            noteType: 'STATUS_CHANGE',
            authorId: admin.id,
            mentions: [],
            isInternal: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]
      });
      noteCount += (notesCreated.count || 2);
    }
  }

  console.log(`✅ Seed complete: conversations=${convCount}, messages=${msgCount}, tickets=${ticketCount}, notes=${noteCount}`);
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });


