// Centralized Theme Configuration
// Change colors here to update the entire application theme

export interface ThemeColors {
  // Primary colors (buttons, main actions)
  primary: {
    main: string;
    hover: string;
    light: string;
    dark: string;
    contrast: string;
  };
  
  // Background colors
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    surface: string;
  };
  
  // Text colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  
  // Accent colors (other elements, highlights)
  accent: {
    main: string;
    hover: string;
    light: string;
    dark: string;
    contrast: string;
  };
  
  // Status colors
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  
  // Border colors
  border: {
    light: string;
    medium: string;
    dark: string;
  };
}

// Current Theme - Change these values to update the entire app
export const currentTheme: ThemeColors = {
  primary: {
    main: '#6ea058',      // Button green
    hover: '#5a8a47',     // Darker green for hover
    light: '#8bb570',     // Lighter green
    dark: '#4f7c41',      // Darker green
    contrast: '#ffffff',   // White text on green
  },
  
  background: {
    primary: '#f4eeed',    // Main background (light beige)
    secondary: '#ede6e5',  // Secondary background
    tertiary: '#e0d6d4',   // Tertiary background
    surface: '#ffffff',    // Card/surface background
  },
  
  text: {
    primary: '#383838',    // Main text (dark gray)
    secondary: '#666666',  // Secondary text
    tertiary: '#888888',   // Tertiary text
    inverse: '#ffffff',    // White text for dark backgrounds
  },
  
  accent: {
    main: '#f4a556',      // Orange accent
    hover: '#e07c2f',     // Darker orange for hover
    light: '#f5b369',     // Lighter orange
    dark: '#bb5f25',      // Darker orange
    contrast: '#383838',   // Dark text on orange
  },
  
  status: {
    success: '#6ea058',   // Use primary green for success
    warning: '#f4a556',   // Use accent orange for warning
    error: '#dc2626',     // Red for errors
    info: '#3b82f6',      // Blue for info
  },
  
  border: {
    light: '#e0d6d4',     // Light border
    medium: '#c7b8b5',    // Medium border
    dark: '#a89490',      // Dark border
  },
};

// Alternative theme configurations (examples)
export const darkTheme: ThemeColors = {
  primary: {
    main: '#6ea058',
    hover: '#5a8a47',
    light: '#8bb570',
    dark: '#4f7c41',
    contrast: '#ffffff',
  },
  
  background: {
    primary: '#0a0a23',
    secondary: '#1a1a2e',
    tertiary: '#16213e',
    surface: '#1a1a2e',
  },
  
  text: {
    primary: '#ffffff',
    secondary: '#c0c0c0',
    tertiary: '#94a3b8',
    inverse: '#0a0a23',
  },
  
  accent: {
    main: '#f4a556',
    hover: '#e07c2f',
    light: '#f5b369',
    dark: '#bb5f25',
    contrast: '#ffffff',
  },
  
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  border: {
    light: '#2a2a4a',
    medium: '#475569',
    dark: '#334155',
  },
};

// Function to convert theme to CSS variables
export function themeToCSSVariables(theme: ThemeColors): Record<string, string> {
  return {
    // Primary colors
    '--color-primary-main': theme.primary.main,
    '--color-primary-hover': theme.primary.hover,
    '--color-primary-light': theme.primary.light,
    '--color-primary-dark': theme.primary.dark,
    '--color-primary-contrast': theme.primary.contrast,
    
    // Background colors
    '--color-background-primary': theme.background.primary,
    '--color-background-secondary': theme.background.secondary,
    '--color-background-tertiary': theme.background.tertiary,
    '--color-background-surface': theme.background.surface,
    
    // Text colors
    '--color-text-primary': theme.text.primary,
    '--color-text-secondary': theme.text.secondary,
    '--color-text-tertiary': theme.text.tertiary,
    '--color-text-inverse': theme.text.inverse,
    
    // Accent colors
    '--color-accent-main': theme.accent.main,
    '--color-accent-hover': theme.accent.hover,
    '--color-accent-light': theme.accent.light,
    '--color-accent-dark': theme.accent.dark,
    '--color-accent-contrast': theme.accent.contrast,
    
    // Status colors
    '--color-status-success': theme.status.success,
    '--color-status-warning': theme.status.warning,
    '--color-status-error': theme.status.error,
    '--color-status-info': theme.status.info,
    
    // Border colors
    '--color-border-light': theme.border.light,
    '--color-border-medium': theme.border.medium,
    '--color-border-dark': theme.border.dark,
  };
}

// Utility function to apply theme to document
export function applyTheme(theme: ThemeColors) {
  if (typeof document === 'undefined') return;
  
  const cssVars = themeToCSSVariables(theme);
  const root = document.documentElement;
  
  Object.entries(cssVars).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

// Export current theme as default
export default currentTheme;
