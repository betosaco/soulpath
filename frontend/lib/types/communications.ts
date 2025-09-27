// ============================================================================
// UNIFIED COMMUNICATIONS & HELP DESK MODULE - TYPE DEFINITIONS
// ============================================================================

// Base types for the communications module
export interface CommunicationChannel {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  isActive: boolean;
  configuration?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  _count?: {
    conversations: number;
    messages: number;
    webhooks: number;
  };
}

export interface Conversation {
  id: string;
  customerId: string;
  subject?: string;
  status: ConversationStatus;
  priority: Priority;
  assignedAgentId?: string;
  assignedAt?: string;
  primaryChannelId?: number;
  channelMetadata?: Record<string, any>;
  firstMessageAt?: string;
  lastMessageAt?: string;
  lastAgentResponseAt?: string;
  lastCustomerMessageAt?: string;
  totalMessages: number;
  agentMessagesCount: number;
  customerMessagesCount: number;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  customer?: UserProfile;
  assignedAgent?: UserProfile;
  primaryChannel?: CommunicationChannel;
  messages?: Message[];
  tickets?: Ticket[];
  satisfactionRatings?: SatisfactionRating[];
  _count?: {
    messages: number;
    tickets: number;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  messageType: MessageType;
  senderType: SenderType;
  senderId?: string;
  channelId: number;
  externalMessageId?: string;
  channelMetadata?: Record<string, any>;
  status: MessageStatus;
  attachments?: MessageAttachment[];
  replyToMessageId?: string;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  sender?: UserProfile;
  channel?: CommunicationChannel;
  replyToMessage?: {
    id: string;
    content: string;
    senderType: SenderType;
    sender?: {
      fullName?: string;
    };
  };
  conversation?: Conversation;
  replies?: Message[];
}

export interface MessageAttachment {
  type: string;
  url: string;
  name?: string;
  size?: number;
  mimeType?: string;
}

export interface TicketStatus {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  color?: string;
  isDefault: boolean;
  isFinal: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  customerId: string;
  subject: string;
  description?: string;
  statusId: number;
  priority: Priority;
  assignedAgentId?: string;
  assignedAt?: string;
  assignedById?: string;
  category?: string;
  tags: string[];
  conversationId?: string;
  slaDueAt?: string;
  firstResponseAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  responseTimeMinutes?: number;
  resolutionTimeMinutes?: number;
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  customer?: UserProfile & {
    customerProfile?: {
      id: number;
      customerTier?: string;
      totalSpent?: number;
      lastPurchaseDate?: string;
      preferredLanguage?: string;
    };
    orders?: Array<{
      id: string;
      orderNumber: string;
      totalAmount: number;
      status: string;
      createdAt: string;
    }>;
    bookings?: Array<{
      id: string;
      status: string;
      scheduledDate?: string;
      scheduledTime?: string;
      serviceType?: { name: string };
    }>;
    ticketsAsCustomer?: Array<{
      id: string;
      ticketNumber: string;
      subject: string;
      priority: Priority;
      status: { displayName: string; color?: string };
      createdAt: string;
    }>;
  };
  assignedAgent?: UserProfile;
  assignedBy?: UserProfile;
  status?: TicketStatus;
  conversation?: {
    id: string;
    lastMessageAt?: string;
    totalMessages: number;
    primaryChannel?: CommunicationChannel;
  };
  notes?: TicketNote[];
  satisfactionRatings?: SatisfactionRating[];
  _count?: {
    notes: number;
    satisfactionRatings: number;
  };
}

export interface TicketNote {
  id: string;
  ticketId: string;
  content: string;
  noteType: TicketNoteType;
  authorId: string;
  mentions: string[];
  attachments?: MessageAttachment[];
  isInternal: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  ticket?: Ticket;
  author?: UserProfile;
}

export interface SatisfactionRating {
  id: number;
  ticketId?: string;
  conversationId?: string;
  customerId: string;
  agentId?: string;
  rating: number;
  feedback?: string;
  ratingType: SatisfactionRatingType;
  createdAt: string;
  
  // Relations
  ticket?: Ticket;
  conversation?: Conversation;
  customer?: UserProfile;
  agent?: UserProfile;
}

export interface AgentPerformanceMetric {
  id: number;
  agentId: string;
  date: string;
  ticketsAssigned: number;
  ticketsResolved: number;
  ticketsClosed: number;
  avgFirstResponseTime?: number;
  avgResolutionTime?: number;
  slaBreaches: number;
  messagesSent: number;
  conversationsHandled: number;
  customerSatisfactionScore?: number;
  totalRatingsReceived: number;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  agent?: UserProfile;
}

// Supporting interfaces
export interface UserProfile {
  id: string;
  fullName?: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  status?: string;
  createdAt?: string;
}

// Dashboard statistics
export interface DashboardStats {
  period: string;
  tickets: {
    total: number;
    open: number;
    overdue: number;
    byStatus: Array<{
      statusId: number;
      statusName: string;
      color?: string;
      count: number;
    }>;
    byPriority: Array<{
      priority: Priority;
      _count: number;
    }>;
    recent: Ticket[];
  };
  conversations: {
    total: number;
    active: number;
    byChannel: Array<{
      channelId?: number;
      channelName: string;
      count: number;
    }>;
  };
  messages: {
    total: number;
    in24h: number;
    avgResponseTimeMinutes: number;
  };
  satisfaction: {
    averageRating?: number;
    totalRatings: number;
  };
  performance?: {
    ticketsAssigned: number;
    ticketsResolved: number;
    avgFirstResponseTime?: number;
    avgResolutionTime?: number;
    customerSatisfactionScore?: number;
  };
}

// API Response interfaces
export interface ConversationsResponse {
  conversations: Conversation[];
  pagination: PaginationInfo;
}

export interface TicketsResponse {
  tickets: Ticket[];
  stats?: {
    byStatus: Array<{ statusId: number; _count: number }>;
    byPriority: Array<{ priority: Priority; _count: number }>;
  };
  pagination: PaginationInfo;
}

export interface MessagesResponse {
  messages: Message[];
  pagination: PaginationInfo;
}

export interface TicketNotesResponse {
  notes: TicketNote[];
  pagination: PaginationInfo;
}

export interface ChannelsResponse {
  channels: CommunicationChannel[];
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Enums matching Prisma schema
export type ConversationStatus = 'ACTIVE' | 'ARCHIVED' | 'CLOSED';

export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO' | 'LOCATION' | 'CONTACT' | 'SYSTEM';

export type SenderType = 'CUSTOMER' | 'AGENT' | 'SYSTEM' | 'BOT';

export type MessageStatus = 'PENDING' | 'DELIVERED' | 'READ' | 'FAILED' | 'DELETED';

export type TicketNoteType = 'NOTE' | 'STATUS_CHANGE' | 'ASSIGNMENT' | 'SYSTEM';

export type AssignmentType = 'ROUND_ROBIN' | 'SKILL_BASED' | 'LOAD_BASED' | 'SPECIFIC_AGENT';

export type HelpdeskTemplateType = 'EMAIL' | 'SMS' | 'WHATSAPP' | 'CHAT';

export type KnowledgeBaseContentType = 'ARTICLE' | 'FAQ' | 'PROCEDURE' | 'TEMPLATE';

export type KnowledgeBaseDifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type SatisfactionRatingType = 'OVERALL' | 'RESPONSE_TIME' | 'RESOLUTION_QUALITY' | 'AGENT_HELPFULNESS';

// Form data types for creating/updating resources
export interface CreateConversationData {
  customerId: string;
  subject?: string;
  priority?: Priority;
  primaryChannelId?: number;
  channelMetadata?: Record<string, any>;
}

export interface UpdateConversationData {
  subject?: string;
  status?: ConversationStatus;
  priority?: Priority;
  assignedAgentId?: string | null;
  channelMetadata?: Record<string, any>;
}

export interface CreateMessageData {
  conversationId: string;
  content: string;
  messageType?: MessageType;
  channelId: number;
  attachments?: MessageAttachment[];
  replyToMessageId?: string;
  externalMessageId?: string;
  channelMetadata?: Record<string, any>;
}

export interface CreateTicketData {
  customerId: string;
  subject: string;
  description?: string;
  priority?: Priority;
  category?: string;
  tags?: string[];
  conversationId?: string;
  customFields?: Record<string, any>;
}

export interface UpdateTicketData {
  subject?: string;
  description?: string;
  statusId?: number;
  priority?: Priority;
  assignedAgentId?: string | null;
  category?: string;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface CreateTicketNoteData {
  content: string;
  noteType?: TicketNoteType;
  mentions?: string[];
  attachments?: MessageAttachment[];
  isInternal?: boolean;
}

export interface CreateChannelData {
  name: string;
  displayName: string;
  description?: string;
  configuration?: Record<string, any>;
  isActive?: boolean;
}

// Filter interfaces for API queries
export interface ConversationFilters {
  page?: number;
  limit?: number;
  status?: ConversationStatus;
  priority?: Priority;
  assignedAgentId?: string;
  customerId?: string;
  channelId?: string;
}

export interface TicketFilters {
  page?: number;
  limit?: number;
  statusId?: string;
  priority?: Priority;
  assignedAgentId?: string;
  customerId?: string;
  category?: string;
  search?: string;
}

export interface MessageFilters {
  conversationId: string;
  page?: number;
  limit?: number;
  messageType?: MessageType;
}

export interface TicketNoteFilters {
  page?: number;
  limit?: number;
  includeInternal?: boolean;
}
