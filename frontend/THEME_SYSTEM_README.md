# Centralized Theme System

This project now uses a centralized theme system that allows you to easily change colors and themes from one place.

## 🎨 Quick Start

### Changing Colors

To change the entire app's color scheme, edit `/lib/theme/theme-config.ts`:

```typescript
export const currentTheme: ThemeColors = {
  primary: {
    main: '#6ea058',      // 🟢 Button color - Change this to update all buttons
    hover: '#5a8a47',     // Darker version for hover states
    // ... other variants
  },
  
  background: {
    primary: '#f4eeed',    // 🎨 Main background - Change this to update page background
    secondary: '#ede6e5',  // Secondary backgrounds
    // ... other variants
  },
  
  text: {
    primary: '#383838',    // 📝 Main text color - Change this to update all text
    secondary: '#666666',  // Secondary text
    // ... other variants
  },
  
  accent: {
    main: '#f4a556',      // 🧡 Accent color - Change this for highlights and other elements
    hover: '#e07c2f',     // Darker version for hover states
    // ... other variants
  }
};
```

### Current Color Scheme

- **Buttons**: `#6ea058` (Green)
- **Background**: `#f4eeed` (Light beige)
- **Text**: `#383838` (Dark gray)
- **Accents**: `#f4a556` (Orange)

## 🚀 Usage

### 1. Using Theme Classes

Import and use pre-defined theme classes:

```typescript
import { themeClasses } from '@/lib/theme';

// Button examples
<button className={themeClasses.button.primary}>Primary Button</button>
<button className={themeClasses.button.accent}>Accent Button</button>
<button className={themeClasses.button.outline}>Outline Button</button>

// Background examples
<div className={themeClasses.background.primary}>Main background</div>
<div className={themeClasses.card.default}>Card with theme</div>

// Text examples
<h1 className={themeClasses.text.primary}>Main heading</h1>
<p className={themeClasses.text.secondary}>Secondary text</p>
```

### 2. Using CSS Variables

Use CSS variables directly in your components:

```css
.my-component {
  background-color: var(--color-background-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-medium);
}
```

```jsx
<div className="bg-[var(--color-primary-main)] text-[var(--color-primary-contrast)]">
  Custom styled element
</div>
```

### 3. Using Theme Hook

Access theme colors programmatically:

```typescript
import { useThemeColors } from '@/lib/theme';

function MyComponent() {
  const theme = useThemeColors();
  
  return (
    <div style={{ backgroundColor: theme.primary.main }}>
      Dynamic theming
    </div>
  );
}
```

## 🎛️ Theme Management

### Visual Theme Manager

Add the theme manager component to allow users to customize colors:

```typescript
import { ThemeManager } from '@/lib/theme';

function App() {
  return (
    <div>
      {/* Your app content */}
      <ThemeManager /> {/* Floating theme manager button */}
    </div>
  );
}
```

### Programmatic Theme Switching

```typescript
import { useThemeSwitcher } from '@/lib/theme';

function ThemeToggle() {
  const { switchToTheme, currentTheme } = useThemeSwitcher();
  
  return (
    <button onClick={() => switchToTheme('dark')}>
      Switch to {currentTheme === 'light' ? 'Dark' : 'Light'} Theme
    </button>
  );
}
```

## 🏗️ Architecture

### Files Structure

```
lib/theme/
├── theme-config.ts      # 🎨 Main theme configuration (EDIT THIS)
├── ThemeProvider.tsx    # Theme context provider
├── theme-utils.ts       # Utility classes and functions
└── index.ts            # Exports

components/theme/
└── ThemeManager.tsx     # Visual theme editor component

app/globals.css          # CSS variables (auto-synced)
```

### Theme Provider Setup

Wrap your app with the ThemeProvider:

```typescript
import { ThemeProvider } from '@/lib/theme';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ThemeProvider initialTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## 🎯 Available CSS Variables

### Primary Colors (Buttons)
- `--color-primary-main` - Main button color
- `--color-primary-hover` - Button hover state
- `--color-primary-light` - Light variant
- `--color-primary-dark` - Dark variant
- `--color-primary-contrast` - Text color on primary background

### Background Colors
- `--color-background-primary` - Main page background
- `--color-background-secondary` - Secondary backgrounds
- `--color-background-tertiary` - Tertiary backgrounds
- `--color-background-surface` - Card/surface backgrounds

### Text Colors
- `--color-text-primary` - Main text color
- `--color-text-secondary` - Secondary text
- `--color-text-tertiary` - Tertiary/muted text
- `--color-text-inverse` - Text on dark backgrounds

### Accent Colors (Other Elements)
- `--color-accent-main` - Main accent color
- `--color-accent-hover` - Accent hover state
- `--color-accent-light` - Light accent variant
- `--color-accent-dark` - Dark accent variant
- `--color-accent-contrast` - Text on accent background

## 🔧 Creating Custom Themes

### Method 1: Edit the Config File

Edit `/lib/theme/theme-config.ts` and change the `currentTheme` object.

### Method 2: Create New Theme Variants

```typescript
// In theme-config.ts
export const myCustomTheme: ThemeColors = {
  primary: { main: '#ff6b6b', /* ... */ },
  background: { primary: '#f8f9fa', /* ... */ },
  // ... rest of theme
};

// Use it
import { myCustomTheme } from '@/lib/theme';
const { setTheme } = useTheme();
setTheme(myCustomTheme, 'custom');
```

### Method 3: Use the Visual Theme Manager

Click the palette icon (🎨) in the bottom-right corner to open the visual theme editor.

## 🎨 Pre-defined Themes

- **Light Theme** (current): Green buttons, light beige background
- **Dark Theme**: Same colors but with dark backgrounds
- **Custom Theme**: User-defined via theme manager

## 📝 Best Practices

1. **Always use theme variables** instead of hardcoded colors
2. **Use theme classes** for common patterns
3. **Test both light and dark themes** when making changes
4. **Keep color contrast** in mind for accessibility
5. **Update theme-config.ts** to change colors globally

## 🔄 Migration from Old System

Replace hardcoded colors with theme variables:

```diff
- className="bg-[#FFD700] text-[#0A0A23]"
+ className="bg-[var(--color-primary-main)] text-[var(--color-primary-contrast)]"

- className="text-[#EAEAEA]"
+ className={themeClasses.text.primary}
```

## 🎯 Current Implementation

The theme system is now active with your requested colors:
- ✅ Buttons: `#6ea058` (green)
- ✅ Background: `#f4eeed` (light beige)  
- ✅ Fonts: `#383838` (dark gray)
- ✅ Other elements: `#f4a556` (orange)

To change these colors, simply edit the `currentTheme` object in `/lib/theme/theme-config.ts`!
