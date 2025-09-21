import { useState, useEffect } from 'react';

interface LogoSettings {
  isActive: boolean;
  type: 'text' | 'image';
  text?: string;
  imageUrl?: string;
}

export function useLogo() {
  const [logoSettings] = useState<LogoSettings>({
    isActive: true,
    type: 'text',
    text: 'MatMax'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // For now, just use default settings
    // In the future, this could fetch from an API
    setIsLoading(false);
  }, []);

  return {
    logoSettings,
    isLoading
  };
}
