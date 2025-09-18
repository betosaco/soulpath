import { useState, useEffect } from 'react';

/**
 * Custom hook to handle hydration safely
 * Prevents hydration mismatches by ensuring consistent server/client rendering
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Custom hook for client-only rendering
 * Only renders content after hydration is complete
 */
export function useClientOnly() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
