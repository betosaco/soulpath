// Theme Utility Classes and Functions
// Easy-to-use CSS classes for consistent theming

export const themeClasses = {
  // Button styles
  button: {
    primary: 'bg-[var(--color-primary-main)] text-[var(--color-primary-contrast)] hover:bg-[var(--color-primary-hover)] focus:ring-[var(--color-primary-main)]/50 shadow-lg transition-all duration-200',
    secondary: 'bg-[var(--color-background-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-background-tertiary)] focus:ring-[var(--color-primary-main)]/50 border border-[var(--color-border-medium)] transition-all duration-200',
    accent: 'bg-[var(--color-accent-main)] text-[var(--color-accent-contrast)] hover:bg-[var(--color-accent-hover)] focus:ring-[var(--color-accent-main)]/50 shadow-lg transition-all duration-200',
    outline: 'bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)] focus:ring-[var(--color-primary-main)]/50 border border-[var(--color-border-medium)] transition-all duration-200',
    ghost: 'bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)] focus:ring-[var(--color-primary-main)]/50 transition-all duration-200',
  },
  
  // Background styles
  background: {
    primary: 'bg-[var(--color-background-primary)]',
    secondary: 'bg-[var(--color-background-secondary)]',
    tertiary: 'bg-[var(--color-background-tertiary)]',
    surface: 'bg-[var(--color-background-surface)]',
  },
  
  // Text styles
  text: {
    primary: 'text-[var(--color-text-primary)]',
    secondary: 'text-[var(--color-text-secondary)]',
    tertiary: 'text-[var(--color-text-tertiary)]',
    inverse: 'text-[var(--color-text-inverse)]',
    accent: 'text-[var(--color-accent-main)]',
  },
  
  // Border styles
  border: {
    light: 'border-[var(--color-border-light)]',
    medium: 'border-[var(--color-border-medium)]',
    dark: 'border-[var(--color-border-dark)]',
  },
  
  // Card styles
  card: {
    default: 'bg-[var(--color-background-surface)] border border-[var(--color-border-light)] rounded-xl shadow-lg',
    elevated: 'bg-[var(--color-background-surface)] border border-[var(--color-border-light)] rounded-xl shadow-xl',
    flat: 'bg-[var(--color-background-surface)] border border-[var(--color-border-light)] rounded-lg',
  },
  
  // Input styles
  input: {
    default: 'w-full px-4 py-3 bg-[var(--color-background-surface)] border border-[var(--color-border-medium)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-main)]/50 focus:border-[var(--color-primary-main)] transition-all duration-200',
    error: 'border-[var(--color-status-error)] focus:ring-[var(--color-status-error)]/50 focus:border-[var(--color-status-error)]',
  },
};

// Utility function to combine theme classes
export function combineThemeClasses(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

// Get CSS variable value
export function getCSSVariable(variable: string): string {
  if (typeof document === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

// Set CSS variable value
export function setCSSVariable(variable: string, value: string): void {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty(variable, value);
}

// Color manipulation utilities
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Generate lighter/darker variants of a color
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const { r, g, b } = rgb;
  const amount = Math.round(2.55 * percent);
  
  return rgbToHex(
    Math.min(255, r + amount),
    Math.min(255, g + amount),
    Math.min(255, b + amount)
  );
}

export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const { r, g, b } = rgb;
  const amount = Math.round(2.55 * percent);
  
  return rgbToHex(
    Math.max(0, r - amount),
    Math.max(0, g - amount),
    Math.max(0, b - amount)
  );
}

// Generate color variants automatically
export function generateColorVariants(baseColor: string) {
  return {
    main: baseColor,
    light: lightenColor(baseColor, 20),
    dark: darkenColor(baseColor, 20),
    hover: darkenColor(baseColor, 10),
  };
}
