import { useState, useEffect } from 'react';
import { safeApiCall } from '@/lib/api-utils';

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

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Calculate isAdmin reactively - only based on database role
  const isAdmin = Boolean(user?.role === 'ADMIN');
  
  useEffect(() => {
    console.log('🔐 useAuth: useEffect triggered');
    // Check for existing token in localStorage (only on client side)
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    console.log('🔐 useAuth: Token found:', !!token);
    
    if (token) {
      console.log('🔐 useAuth: Verifying token...');
      // Verify token with our API using safe API call
      safeApiCall<VerifyApiResponse>('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ token })
      })
      .then(response => {
        console.log('🔐 useAuth: Token verification response:', response);
        // Handle both nested and direct response structures
        const userData = response.data?.user;
        if (response.success && userData && typeof userData === 'object') {
          const newUser = {
            ...userData,
            access_token: token
          } as User;
          
          // Only update if user data has actually changed
          setUser(prevUser => {
            if (prevUser && 
                prevUser.id === newUser.id && 
                prevUser.email === newUser.email && 
                prevUser.role === newUser.role &&
                prevUser.access_token === newUser.access_token &&
                prevUser.fullName === newUser.fullName) {
              return prevUser; // Return same object reference to prevent re-renders
            }
            console.log('🔐 useAuth: User authenticated from token:', newUser);
            return newUser;
          });
          setIsLoading(false); // Set loading to false immediately after setting user
        } else {
          console.log('🔐 useAuth: Invalid token, clearing storage');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            document.cookie = 'auth_token=; path=/; max-age=0';
          }
          setUser(null);
          setIsLoading(false); // Set loading to false immediately after clearing user
        }
      })
      .catch(error => {
        console.error('🔐 useAuth: Token verification error:', error);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          document.cookie = 'auth-token=; path=/; max-age=0';
        }
        setUser(null);
        setIsLoading(false); // Set loading to false immediately after error
      });
    } else {
      console.log('🔐 useAuth: No token found');
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 useAuth: Attempting sign in for:', email);
    
    try {
      const response = await safeApiCall<LoginApiResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      if (response.success && response.data && response.data.user && typeof response.data.user === 'object') {
        // Store token in localStorage and cookie (only on client side)
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.data.user.access_token);
          // Also store in cookie for middleware access
          document.cookie = `auth_token=${response.data.user.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
        }
        
        console.log('🔐 useAuth: Sign in successful:', response.data.user);
        setUser(response.data.user);
        setIsLoading(false);
        
        return { data: response.data.user, error: null };
      } else {
        console.error('🔐 useAuth: Sign in error:', response.message || response.error || 'Unknown error');
        setIsLoading(false);
        return { data: null, error: { message: response.message || 'Login failed' } };
      }
    } catch (error) {
      console.error('🔐 useAuth: Sign in error:', error);
      setIsLoading(false);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    console.log('🔐 useAuth: Signing out');
    
    // Remove token from localStorage and cookie (only on client side)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      // Clear the cookie
      document.cookie = 'auth_token=; path=/; max-age=0';
    }
    setUser(null);
    
    return { error: null };
  };

  // Debug logging removed for production

  return {
    user,
    isLoading,
    signIn,
    signOut,
    isAdmin
  };
}