'use client';

import { useState, useEffect, useCallback } from 'react';
import { safeApiCall } from '@/lib/api-client';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'TEACHER' | 'CLIENT';
  access_token: string;
  phone?: string;
  language?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
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
  
  // Calculate isAdmin and isTeacher reactively - only based on database role
  const isAdmin = Boolean(user?.role === 'ADMIN');
  const isTeacher = Boolean(user?.role === 'TEACHER');
  
  // Memoize the token verification to prevent infinite loops
  const verifyToken = useCallback(async (token: string) => {
    try {
      console.log('🔐 useAuth: Verifying token...');
      const response = await safeApiCall<VerifyApiResponse>('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ token })
      });
      
      console.log('🔐 useAuth: Token verification response:', response);
      
      if (response.success && response.user && typeof response.user === 'object') {
        const newUser = {
          ...response.user,
          access_token: token
        } as User;
        
        console.log('🔐 useAuth: User authenticated from token:', newUser);
        return newUser;
      } else {
        console.log('🔐 useAuth: Invalid token, clearing storage');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          document.cookie = 'auth_token=; path=/; max-age=0';
        }
        return null;
      }
    } catch (error) {
      console.error('🔐 useAuth: Token verification error:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        document.cookie = 'auth-token=; path=/; max-age=0';
      }
      return null;
    }
  }, []);

  useEffect(() => {
    console.log('🔐 useAuth: useEffect triggered');
    
    let isMounted = true; // Flag to prevent state updates after unmount
    
    const initializeAuth = async () => {
      // Check for existing token in localStorage (only on client side)
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      console.log('🔐 useAuth: Token found:', !!token);
      
      if (token) {
        const userData = await verifyToken(token);
        if (isMounted) {
          setUser(userData);
          setIsLoading(false);
        }
      } else {
        console.log('🔐 useAuth: No token found');
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [verifyToken]);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 useAuth: Attempting sign in for:', email);
    
    try {
      const response = await safeApiCall<{ user: User; token: string }>('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (response.success && response.user && response.token) {
        // Store token in localStorage and cookie
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.token);
          document.cookie = `auth_token=${response.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        }
        
        setUser(response.user);
        setIsLoading(false);
        console.log('🔐 useAuth: Sign in successful');
        return { success: true, user: response.user };
      } else {
        console.log('🔐 useAuth: Sign in failed:', response.error);
        return { success: false, error: response.error || 'Sign in failed' };
      }
    } catch (error) {
      console.error('🔐 useAuth: Sign in error:', error);
      return { success: false, error: 'Sign in failed' };
    }
  };

  const signOut = useCallback(() => {
    console.log('🔐 useAuth: Signing out');
    
    // Clear token from storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      document.cookie = 'auth_token=; path=/; max-age=0';
    }
    
    setUser(null);
    setIsLoading(false);
  }, []);

  return {
    user,
    isLoading,
    isAdmin,
    isTeacher,
    signIn,
    signOut
  };
}
