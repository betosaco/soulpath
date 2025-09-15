'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { ThemeColors, currentTheme, darkTheme, applyTheme } from './theme-config';

export type ThemeName = 'light' | 'dark' | 'custom';

interface ThemeContextType {
  theme: ThemeColors;
  themeName: ThemeName;
  setTheme: (theme: ThemeColors, name?: ThemeName) => void;
  switchToTheme: (name: ThemeName) => void;
  availableThemes: Record<ThemeName, ThemeColors>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: ThemeName;
}

export function ThemeProvider({ children, initialTheme = 'light' }: ThemeProviderProps) {
  const availableThemes: Record<ThemeName, ThemeColors> = useMemo(() => ({
    light: currentTheme,
    dark: darkTheme,
    custom: currentTheme, // Default to current theme, can be overridden
  }), []);

  const [theme, setThemeState] = useState<ThemeColors>(availableThemes[initialTheme]);
  const [themeName, setThemeName] = useState<ThemeName>(initialTheme);

  // Apply theme to CSS variables when theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('app-theme') as ThemeName;
      if (savedTheme && availableThemes[savedTheme]) {
        setThemeState(availableThemes[savedTheme]);
        setThemeName(savedTheme);
      }
    }
  }, [availableThemes]);

  const setTheme = (newTheme: ThemeColors, name: ThemeName = 'custom') => {
    setThemeState(newTheme);
    setThemeName(name);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-theme', name);
      if (name === 'custom') {
        localStorage.setItem('custom-theme', JSON.stringify(newTheme));
      }
    }
  };

  const switchToTheme = (name: ThemeName) => {
    let themeToApply = availableThemes[name];
    
    // If switching to custom theme, try to load from localStorage
    if (name === 'custom' && typeof window !== 'undefined') {
      const savedCustomTheme = localStorage.getItem('custom-theme');
      if (savedCustomTheme) {
        try {
          themeToApply = JSON.parse(savedCustomTheme);
        } catch {
          console.warn('Failed to parse custom theme from localStorage');
        }
      }
    }
    
    setTheme(themeToApply, name);
  };

  const value: ThemeContextType = {
    theme,
    themeName,
    setTheme,
    switchToTheme,
    availableThemes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook for easy access to theme colors
export function useThemeColors() {
  const { theme } = useTheme();
  return theme;
}

// Hook for theme switching
export function useThemeSwitcher() {
  const { switchToTheme, themeName, availableThemes } = useTheme();
  return { switchToTheme, currentTheme: themeName, availableThemes };
}
