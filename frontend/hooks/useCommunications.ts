import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ConversationsResponse,
  TicketsResponse,
  MessagesResponse,
  TicketNotesResponse,
  ChannelsResponse,
  DashboardStats,
  Conversation,
  Ticket,
  Message,
  TicketNote,
  CommunicationChannel,
  ConversationFilters,
  TicketFilters,
  MessageFilters,
  TicketNoteFilters,
  CreateConversationData,
  UpdateConversationData,
  CreateMessageData,
  CreateTicketData,
  UpdateTicketData,
  CreateTicketNoteData,
  CreateChannelData,
} from '@/lib/types/communications';

// Query keys factory
export const communicationsKeys = {
  all: ['communications'] as const,
  conversations: () => [...communicationsKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...communicationsKeys.conversations(), id] as const,
  conversationsList: (filters: ConversationFilters) => 
    [...communicationsKeys.conversations(), 'list', filters] as const,
  
  tickets: () => [...communicationsKeys.all, 'tickets'] as const,
  ticket: (id: string) => [...communicationsKeys.tickets(), id] as const,
  ticketsList: (filters: TicketFilters) => 
    [...communicationsKeys.tickets(), 'list', filters] as const,
  
  messages: () => [...communicationsKeys.all, 'messages'] as const,
  messagesList: (filters: MessageFilters) => 
    [...communicationsKeys.messages(), 'list', filters] as const,
    
  ticketNotes: (ticketId: string) => 
    [...communicationsKeys.all, 'ticketNotes', ticketId] as const,
  ticketNotesList: (ticketId: string, filters: TicketNoteFilters) => 
    [...communicationsKeys.ticketNotes(ticketId), 'list', filters] as const,
    
  channels: () => [...communicationsKeys.all, 'channels'] as const,
  dashboard: () => [...communicationsKeys.all, 'dashboard'] as const,
  dashboardStats: (period: string) => 
    [...communicationsKeys.dashboard(), 'stats', period] as const,
};

// Helper: attach Authorization header from localStorage token (client-side)
function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// API functions
async function fetchConversations(filters: ConversationFilters): Promise<ConversationsResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });
  
  const response = await fetch(`/api/communications/conversations?${params}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }
  return response.json();
}

async function fetchConversation(id: string): Promise<Conversation> {
  const response = await fetch(`/api/communications/conversations/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch conversation');
  }
  return response.json();
}

async function fetchTickets(filters: TicketFilters): Promise<TicketsResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });
  
  const response = await fetch(`/api/communications/tickets?${params}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch tickets');
  }
  return response.json();
}

async function fetchTicket(id: string): Promise<Ticket> {
  const response = await fetch(`/api/communications/tickets/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch ticket');
  }
  return response.json();
}

async function fetchMessages(filters: MessageFilters): Promise<MessagesResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });
  
  const response = await fetch(`/api/communications/messages?${params}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return response.json();
}

async function fetchTicketNotes(ticketId: string, filters: TicketNoteFilters): Promise<TicketNotesResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });
  
  const response = await fetch(`/api/communications/tickets/${ticketId}/notes?${params}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch ticket notes');
  }
  return response.json();
}

async function fetchChannels(activeOnly: boolean = true): Promise<ChannelsResponse> {
  const params = new URLSearchParams();
  if (activeOnly) {
    params.append('activeOnly', 'true');
  }
  
  const response = await fetch(`/api/communications/channels?${params}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch channels');
  }
  return response.json();
}

async function fetchDashboardStats(period: string = '7d'): Promise<DashboardStats> {
  const response = await fetch(`/api/communications/dashboard/stats?period=${period}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  return response.json();
}

// Query hooks
export function useConversations(filters: ConversationFilters = {}) {
  return useQuery({
    queryKey: communicationsKeys.conversationsList(filters),
    queryFn: () => fetchConversations(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: communicationsKeys.conversation(id),
    queryFn: () => fetchConversation(id),
    enabled: !!id,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useTickets(filters: TicketFilters = {}) {
  return useQuery({
    queryKey: communicationsKeys.ticketsList(filters),
    queryFn: () => fetchTickets(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: communicationsKeys.ticket(id),
    queryFn: () => fetchTicket(id),
    enabled: !!id,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useMessages(filters: MessageFilters) {
  return useQuery({
    queryKey: communicationsKeys.messagesList(filters),
    queryFn: () => fetchMessages(filters),
    enabled: !!filters.conversationId,
    staleTime: 1000 * 60 * 2, // 2 minutes (reduce real-time polling)
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
}

export function useTicketNotes(ticketId: string, filters: TicketNoteFilters = {}) {
  return useQuery({
    queryKey: communicationsKeys.ticketNotesList(ticketId, filters),
    queryFn: () => fetchTicketNotes(ticketId, filters),
    enabled: !!ticketId,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useChannels(activeOnly: boolean = true) {
  return useQuery({
    queryKey: communicationsKeys.channels(),
    queryFn: () => fetchChannels(activeOnly),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useDashboardStats(period: string = '7d') {
  return useQuery({
    queryKey: communicationsKeys.dashboardStats(period),
    queryFn: () => fetchDashboardStats(period),
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: true, // Only refetch on reconnect
    // Remove aggressive auto-refresh interval
  });
}

// Mutation hooks
export function useCreateConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateConversationData): Promise<Conversation> => {
      const response = await fetch('/api/communications/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }
      
      return response.json();
    },
    onSuccess: (newConversation) => {
      // Invalidate conversations list
      queryClient.invalidateQueries({ queryKey: communicationsKeys.conversations() });
      // Set the new conversation in cache
      queryClient.setQueryData(
        communicationsKeys.conversation(newConversation.id),
        newConversation
      );
    },
  });
}

export function useUpdateConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateConversationData }): Promise<Conversation> => {
      const response = await fetch(`/api/communications/conversations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update conversation');
      }
      
      return response.json();
    },
    onSuccess: (updatedConversation) => {
      // Update the conversation in cache
      queryClient.setQueryData(
        communicationsKeys.conversation(updatedConversation.id),
        updatedConversation
      );
      // Invalidate conversations list to reflect changes
      queryClient.invalidateQueries({ queryKey: communicationsKeys.conversations() });
    },
  });
}

export function useCreateMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateMessageData): Promise<Message> => {
      const response = await fetch('/api/communications/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return response.json();
    },
    onSuccess: (newMessage) => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({ 
        queryKey: communicationsKeys.messagesList({ conversationId: newMessage.conversationId }) 
      });
      // Invalidate conversation to update last message info
      queryClient.invalidateQueries({ 
        queryKey: communicationsKeys.conversation(newMessage.conversationId) 
      });
      // Invalidate conversations list to update last message timestamps
      queryClient.invalidateQueries({ queryKey: communicationsKeys.conversations() });
    },
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateTicketData): Promise<Ticket> => {
      const response = await fetch('/api/communications/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }
      
      return response.json();
    },
    onSuccess: (newTicket) => {
      // Invalidate tickets list
      queryClient.invalidateQueries({ queryKey: communicationsKeys.tickets() });
      // Set the new ticket in cache
      queryClient.setQueryData(
        communicationsKeys.ticket(newTicket.id),
        newTicket
      );
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: communicationsKeys.dashboard() });
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTicketData }): Promise<Ticket> => {
      const response = await fetch(`/api/communications/tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update ticket');
      }
      
      return response.json();
    },
    onSuccess: (updatedTicket) => {
      // Update the ticket in cache
      queryClient.setQueryData(
        communicationsKeys.ticket(updatedTicket.id),
        updatedTicket
      );
      // Invalidate tickets list to reflect changes
      queryClient.invalidateQueries({ queryKey: communicationsKeys.tickets() });
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: communicationsKeys.dashboard() });
    },
  });
}

export function useCreateTicketNote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ ticketId, data }: { ticketId: string; data: CreateTicketNoteData }): Promise<TicketNote> => {
      const response = await fetch(`/api/communications/tickets/${ticketId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create note');
      }
      
      return response.json();
    },
    onSuccess: (newNote) => {
      // Invalidate ticket notes
      queryClient.invalidateQueries({ 
        queryKey: communicationsKeys.ticketNotes(newNote.ticketId) 
      });
      // Invalidate ticket to update note count
      queryClient.invalidateQueries({ 
        queryKey: communicationsKeys.ticket(newNote.ticketId) 
      });
    },
  });
}

export function useCreateChannel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateChannelData): Promise<CommunicationChannel> => {
      const response = await fetch('/api/communications/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create channel');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate channels list
      queryClient.invalidateQueries({ queryKey: communicationsKeys.channels() });
    },
  });
}
