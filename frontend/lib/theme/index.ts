// Theme System Exports
// Import everything you need for theming from here

export * from './theme-config';
export * from './ThemeProvider';
export * from './theme-utils';

// Re-export theme manager component
export { ThemeManager } from '../../components/theme/ThemeManager';

// Quick access to commonly used items
export { 
  currentTheme as defaultTheme,
  darkTheme,
  type ThemeColors,
  themeToCSSVariables,
  applyTheme 
} from './theme-config';

export { 
  useTheme,
  useThemeColors,
  useThemeSwitcher,
  ThemeProvider 
} from './ThemeProvider';

export { 
  themeClasses,
  combineThemeClasses,
  getCSSVariable,
  setCSSVariable,
  generateColorVariants 
} from './theme-utils';
