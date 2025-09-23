import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth as useAuthStore } from '@/store/appStore';
import { safeApiCall } from '@/lib/api-utils';
import { queryKeys } from '@/lib/query-client';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  fullName?: string;
  role?: string;
  access_token: string;
}

interface LoginApiResponse {
  success: boolean;
  user?: User;
  message?: string;
  error?: string;
}

interface VerifyApiResponse {
  success: boolean;
  user?: Omit<User, 'access_token'>;
  message?: string;
  error?: string;
}

// API function for verifying token
async function verifyTokenAPI(token: string): Promise<User | null> {
  console.log('🔐 Verifying token...');
  
  const response = await safeApiCall<VerifyApiResponse>('/api/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ token })
  });
  
  console.log('🔐 Token verification response:', response);
  
  // Handle both nested and direct response structures
  const userData = response.data?.user;
  if (response.success && userData && typeof userData === 'object') {
    const user = {
      ...userData,
      access_token: token
    } as User;
    
    console.log('🔐 User authenticated from token:', user);
    return user;
  }
  
  console.log('🔐 Invalid token');
  return null;
}

// API function for login
async function loginAPI(email: string, password: string): Promise<User> {
  console.log('🔐 Attempting sign in for:', email);
  
  const response = await safeApiCall<LoginApiResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  if (response.success && response.data && response.data.user && typeof response.data.user === 'object') {
    console.log('🔐 Sign in successful:', response.data.user);
    return response.data.user;
  } else {
    console.error('🔐 Sign in error:', response.message || response.error || 'Unknown error');
    throw new Error(response.message || 'Login failed');
  }
}

/**
 * useAuthQuery - TanStack Query hook for authentication
 * 
 * Features:
 * - Automatic token verification on mount
 * - Caching of user data
 * - Optimistic updates for login/logout
 * - Error handling and retry logic
 */
export function useAuthQuery() {
  const { setUser, setLoading, signOut: signOutStore } = useAuthStore();
  const queryClient = useQueryClient();
  
  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  // Query for user verification
  const userQuery = useQuery({
    queryKey: queryKeys.auth.verify(),
    queryFn: () => verifyTokenAPI(token!),
    enabled: !!token, // Only run if token exists
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 1, // Only retry once for auth
    onSuccess: (user) => {
      setUser(user);
      setLoading(false);
    },
    onError: (error) => {
      console.error('🔐 Token verification error:', error);
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        document.cookie = 'auth_token=; path=/; max-age=0';
      }
      setUser(null);
      setLoading(false);
    },
  });
  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginAPI,
    onSuccess: (user) => {
      // Store token in localStorage and cookie
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', user.access_token);
        document.cookie = `auth_token=${user.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
      }
      
      // Update store
      setUser(user);
      setLoading(false);
      
      // Update query cache
      queryClient.setQueryData(queryKeys.auth.verify(), user);
      
      toast.success('Login successful!');
    },
    onError: (error) => {
      console.error('🔐 Login error:', error);
      setLoading(false);
      toast.error(`Login failed: ${error.message}`);
    },
  });
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Remove token from localStorage and cookie
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        document.cookie = 'auth_token=; path=/; max-age=0';
      }
      
      // Clear store
      signOutStore();
      
      // Clear query cache
      queryClient.clear();
      
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Logged out successfully');
    },
    onError: (error) => {
      console.error('🔐 Logout error:', error);
      toast.error(`Logout failed: ${error.message}`);
    },
  });
  
  // Derived state
  const user = userQuery.data;
  const isLoading = userQuery.isLoading || loginMutation.isPending;
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';
  
  // Login function
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      return { data: result, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };
  
  // Logout function
  const signOut = async () => {
    try {
      await logoutMutation.mutateAsync();
      return { error: null };
    } catch (error) {
      return { error };
    }
  };
  
  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    signIn,
    signOut,
    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
  };
}

// Re-export the original hook for backward compatibility
export { useAuth as useAuthLegacy } from './useAuth';
