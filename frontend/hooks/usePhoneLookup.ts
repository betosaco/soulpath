import { useState, useCallback } from 'react';

export interface CustomerData {
  id: string;
  email: string;
  emailMasked?: string; // Masked email for display
  fullName: string | null;
  phone: string | null;
  birthDate: string | null;
  birthTime: string | null;
  birthPlace: string | null;
  language: string | null;
  status: string;
  notes: string | null;
  adminNotes: string | null;
  lastBooking: string | null;
  createdAt: string;
  customerProfile: {
    firstName: string;
    lastName: string;
    dateOfBirth: string | null;
    totalOrders: number;
    totalSpent: number;
    lastOrderAt: string | null;
    status: string;
  } | null;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
}

export interface PhoneLookupResponse {
  success: boolean;
  found: boolean;
  data?: CustomerData;
  message: string;
  error?: string;
}

export function usePhoneLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupByPhone = useCallback(async (
    phoneNumber: string, 
    countryCode?: string
  ): Promise<PhoneLookupResponse> => {
    if (!phoneNumber.trim()) {
      return {
        success: false,
        found: false,
        message: 'Phone number is required'
      };
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/customers/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          countryCode: countryCode || 'PE' // Default to Peru
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to lookup customer');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
      setError(errorMessage);
      return {
        success: false,
        found: false,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const lookupByPhoneGet = useCallback(async (
    phoneNumber: string, 
    countryCode?: string
  ): Promise<PhoneLookupResponse> => {
    if (!phoneNumber.trim()) {
      return {
        success: false,
        found: false,
        message: 'Phone number is required'
      };
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        phone: phoneNumber.trim(),
        ...(countryCode && { countryCode })
      });

      const response = await fetch(`/api/customers/lookup?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to lookup customer');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
      setError(errorMessage);
      return {
        success: false,
        found: false,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    lookupByPhone,
    lookupByPhoneGet,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}
