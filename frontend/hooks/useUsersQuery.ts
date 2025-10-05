import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

interface User {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  role: string;
  telegramId?: string;
  whatsappId?: string;
  instagramId?: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UsersQueryParams {
  search?: string;
  role?: string;
  limit?: number;
  page?: number;
}

export function useUsersQuery(params?: UsersQueryParams) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['users', params],
    queryFn: async (): Promise<UsersResponse> => {
      if (!user?.access_token) {
        throw new Error('No authentication token available');
      }

      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.set('search', params.search);
      if (params?.role) queryParams.set('role', params.role);
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      if (params?.page) queryParams.set('page', params.page.toString());

      const url = `/api/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!user?.access_token,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
}

export type { User, UsersResponse, UsersQueryParams };
