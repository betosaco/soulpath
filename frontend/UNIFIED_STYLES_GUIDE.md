# 🎨 Unified Component Styles Guide

## Overview

This guide explains how to use the unified component styles system that provides consistent theming across all components in the application. All components (menus, modals, buttons, cards, etc.) should use these unified styles for consistency.

## 📁 Files

- `styles/unified-component-styles.css` - Main unified stylesheet with all component styles
- `styles/unified-schedule-management.css` - Schedule-specific styles that extend the unified styles
- `lib/design-system.ts` - Design tokens (for reference)
- `lib/styles/common.ts` - Legacy styles (for backward compatibility)

## 🚀 Quick Start

### 1. Import the Unified Styles

```typescript
// In your component file
import '@/styles/unified-component-styles.css';
```

### 2. Use Unified Classes

```tsx
// Buttons
<button className="unified-button unified-button--primary">Primary Button</button>
<button className="unified-button unified-button--secondary">Secondary Button</button>
<button className="unified-button unified-button--accent">Accent Button</button>

// Modals
<div className="unified-modal-overlay">
  <div className="unified-modal">
    <div className="unified-modal__header">
      <h2 className="unified-modal__title">Modal Title</h2>
    </div>
    <div className="unified-modal__content">Content here</div>
    <div className="unified-modal__footer">Footer here</div>
  </div>
</div>

// Cards
<div className="unified-card">
  <div className="unified-card__header">
    <h3 className="unified-card__title">Card Title</h3>
  </div>
  <div className="unified-card__content">Card content</div>
</div>
```

## 🎨 Color Scheme

The unified styles use a consistent color scheme:

- **Primary**: `#6ea058` (Green) - Used for main actions and buttons
- **Background**: `#f4eeed` (Light beige) - Main background color
- **Text**: `#383838` (Dark gray) - Primary text color
- **Accent**: `#f4a556` (Orange) - Used for highlights and secondary actions
- **Status Colors**: Success (green), Warning (orange), Error (red), Info (blue)

## 📋 Component Classes

### Buttons

```css
.unified-button                    /* Base button class */
.unified-button--primary          /* Primary button (green) */
.unified-button--secondary        /* Secondary button (white with border) */
.unified-button--accent           /* Accent button (orange) */
.unified-button--outline          /* Outline button (transparent with border) */
.unified-button--ghost            /* Ghost button (transparent) */
.unified-button--danger           /* Danger button (red) */
.unified-button--sm               /* Small size */
.unified-button--lg               /* Large size */
.unified-button--icon             /* Icon-only button */
```

### Modals

```css
.unified-modal-overlay            /* Modal backdrop */
.unified-modal                    /* Modal container */
.unified-modal--large             /* Large modal */
.unified-modal--fullscreen        /* Fullscreen modal */
.unified-modal__header            /* Modal header */
.unified-modal__title             /* Modal title */
.unified-modal__content           /* Modal content */
.unified-modal__footer            /* Modal footer */
.unified-modal__close             /* Close button */
```

### Cards

```css
.unified-card                     /* Card container */
.unified-card__header             /* Card header */
.unified-card__title              /* Card title */
.unified-card__subtitle           /* Card subtitle */
.unified-card__content            /* Card content */
.unified-card__footer             /* Card footer */
```

### Forms

```css
.unified-form-group               /* Form field group */
.unified-form-label               /* Form label */
.unified-form-input               /* Text input */
.unified-form-select              /* Select dropdown */
.unified-form-textarea            /* Textarea */
.unified-form-checkbox            /* Checkbox container */
```

### Tables

```css
.unified-table                    /* Table container */
.unified-table th                 /* Table header cells */
.unified-table td                 /* Table data cells */
```

### Badges

```css
.unified-badge                    /* Base badge */
.unified-badge--primary           /* Primary badge */
.unified-badge--secondary         /* Secondary badge */
.unified-badge--accent            /* Accent badge */
.unified-badge--success           /* Success badge */
.unified-badge--warning           /* Warning badge */
.unified-badge--error             /* Error badge */
.unified-badge--info              /* Info badge */
```

### Tabs

```css
.unified-tabs                     /* Tab container */
.unified-tab                      /* Individual tab */
.unified-tab--active              /* Active tab */
```

### Menus

```css
.unified-menu                     /* Menu container */
.unified-menu-item                /* Menu item */
.unified-menu-item--active        /* Active menu item */
.unified-menu-divider             /* Menu divider */
```

## 🎯 Schedule Management

For schedule management components, use the extended classes:

```css
.unified-schedule-management       /* Main container */
.unified-schedule-management__tabs /* Schedule tabs */
.unified-schedule-management__filters /* Filter section */
.unified-schedule-management__grid /* Schedule grid */
.unified-schedule-management__card /* Schedule card */
```

## 🔧 Utility Classes

```css
/* Text alignment */
.unified-text-center
.unified-text-left
.unified-text-right

/* Margins */
.unified-mt-sm, .unified-mt-md, .unified-mt-lg, .unified-mt-xl
.unified-mb-sm, .unified-mb-md, .unified-mb-lg, .unified-mb-xl

/* Padding */
.unified-p-sm, .unified-p-md, .unified-p-lg, .unified-p-xl

/* Flexbox */
.unified-flex
.unified-flex-col
.unified-items-center
.unified-justify-center
.unified-justify-between
.unified-gap-sm, .unified-gap-md, .unified-gap-lg

/* Display */
.unified-hidden
.unified-block
.unified-inline-block

/* Sizing */
.unified-w-full
.unified-h-full

/* Border radius */
.unified-rounded
.unified-rounded-lg
.unified-rounded-full

/* Shadows */
.unified-shadow
.unified-shadow-lg

/* Borders */
.unified-border
.unified-border-medium

/* Backgrounds */
.unified-bg-primary
.unified-bg-secondary
.unified-bg-surface

/* Text colors */
.unified-text-primary
.unified-text-secondary
.unified-text-tertiary
```

## 📱 Responsive Design

The unified styles include responsive design considerations:

- Mobile-first approach
- Flexible grid layouts
- Responsive typography
- Touch-friendly button sizes
- Adaptive spacing

## 🔄 Migration Guide

### From Existing Styles

1. **Replace button classes**:
   ```tsx
   // Old
   <button className="btn btn-primary">Click me</button>
   
   // New
   <button className="unified-button unified-button--primary">Click me</button>
   ```

2. **Replace modal classes**:
   ```tsx
   // Old
   <div className="modal-overlay">
     <div className="modal">
   
   // New
   <div className="unified-modal-overlay">
     <div className="unified-modal">
   ```

3. **Replace card classes**:
   ```tsx
   // Old
   <div className="card">
     <div className="card-header">
   
   // New
   <div className="unified-card">
     <div className="unified-card__header">
   ```

## 🎨 Customization

To customize the unified styles, modify the CSS custom properties in `unified-component-styles.css`:

```css
:root {
  --unified-primary: #6ea058;        /* Change primary color */
  --unified-bg-primary: #f4eeed;     /* Change background color */
  --unified-text-primary: #383838;   /* Change text color */
  /* ... other properties */
}
```

## 📝 Best Practices

1. **Always use unified classes** for new components
2. **Import the stylesheet** in component files that use unified classes
3. **Use semantic class names** that describe the component's purpose
4. **Combine with utility classes** for additional styling needs
5. **Test responsive behavior** on different screen sizes
6. **Maintain consistency** across all components

## 🐛 Troubleshooting

### Styles not applying?
- Make sure you've imported `unified-component-styles.css`
- Check that class names are spelled correctly
- Verify CSS custom properties are defined

### Colors not matching?
- Check if CSS custom properties are overridden elsewhere
- Ensure the unified stylesheet is loaded after other stylesheets

### Responsive issues?
- Use the provided responsive utility classes
- Check mobile breakpoints in the CSS

## 📚 Examples

### Complete Modal Example

```tsx
import '@/styles/unified-component-styles.css';

function MyModal({ isOpen, onClose }) {
  return (
    <div className={`unified-modal-overlay ${isOpen ? 'block' : 'hidden'}`}>
      <div className="unified-modal">
        <div className="unified-modal__header">
          <h2 className="unified-modal__title">Modal Title</h2>
          <button className="unified-modal__close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="unified-modal__content">
          <p>Modal content goes here</p>
        </div>
        <div className="unified-modal__footer">
          <button className="unified-button unified-button--secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="unified-button unified-button--primary">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Complete Card Example

```tsx
import '@/styles/unified-component-styles.css';

function MyCard({ title, content, actions }) {
  return (
    <div className="unified-card">
      <div className="unified-card__header">
        <h3 className="unified-card__title">{title}</h3>
      </div>
      <div className="unified-card__content">
        {content}
      </div>
      {actions && (
        <div className="unified-card__footer">
          {actions}
        </div>
      )}
    </div>
  );
}
```

This unified system ensures all components have consistent styling and behavior across the entire application.
