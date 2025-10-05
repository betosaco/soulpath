import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export interface CommunicationTemplate {
  id: number;
  templateKey: string;
  name: string;
  description?: string;
  type: 'email' | 'sms';
  category?: string;
  isActive: boolean;
  isDefault: boolean;
  translations: CommunicationTemplateTranslation[];
}

export interface CommunicationTemplateTranslation {
  id: number;
  templateId: number;
  language: string;
  subject?: string;
  content: string;
}

interface TemplatesQueryParams {
  type?: 'email' | 'sms';
  category?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

interface TemplatesResponse {
  templates: CommunicationTemplate[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useTemplatesQuery(params?: TemplatesQueryParams) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['templates', params],
    queryFn: async () => {
      if (!user?.access_token) {
        throw new Error('No authentication token available');
      }

      const searchParams = new URLSearchParams();
      if (params?.type) searchParams.set('type', params.type);
      if (params?.category) searchParams.set('category', params.category);
      if (params?.isActive !== undefined) searchParams.set('isActive', params.isActive.toString());
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());

      const url = `/api/admin/communication/templates${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.status}`);
      }

      return response.json() as Promise<TemplatesResponse>;
    },
    enabled: !!user?.access_token,
  });
}

export function useCreateTemplateMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateData: {
      templateKey: string;
      name: string;
      description?: string;
      type: 'email' | 'sms';
      category?: string;
      translations: Array<{
        language: string;
        subject?: string;
        content: string;
      }>;
    }) => {
      if (!user?.access_token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('/api/admin/communication/templates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(templateData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create template: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate templates queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    }
  });
}

export function useUpdateTemplateMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      templateData
    }: {
      id: number;
      templateData: Partial<{
        templateKey: string;
        name: string;
        description?: string;
        type: 'email' | 'sms';
        category?: string;
        isActive: boolean;
        isDefault: boolean;
        translations: Array<{
          language: string;
          subject?: string;
          content: string;
        }>;
      }>;
    }) => {
      if (!user?.access_token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`/api/admin/communication/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(templateData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update template: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate templates queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    }
  });
}

export function useDeleteTemplateMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!user?.access_token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`/api/admin/communication/templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete template: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate templates queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    }
  });
}
