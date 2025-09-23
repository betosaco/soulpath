# Frontend Refactoring Migration Guide

This guide outlines the changes made during the unified booking and shopping experience refactoring and how to migrate existing code to use the new components.

## Overview

The refactoring consolidates fragmented booking flows into a single, unified experience while enforcing a consistent design system across all components.

## Key Changes

### 1. New AppShell Component

**Before:**
```tsx
import { AppLayout } from '@/components/AppLayout';

function MyPage() {
  return (
    <AppLayout user={user} isAdmin={isAdmin}>
      <div>My content</div>
    </AppLayout>
  );
}
```

**After:**
```tsx
import { AppShell } from '@/components/AppShell';

function MyPage() {
  return (
    <AppShell user={user} isAdmin={isAdmin}>
      <div>My content</div>
    </AppShell>
  );
}
```

**Note:** `AppLayout` still works for backward compatibility but now delegates to `AppShell`.

### 2. Unified Booking Flow

**Before:** Multiple fragmented components
- `BookingSection.tsx`
- `CalendlyBookingFlow.tsx`
- `PackagesBookingFlow.tsx`
- `ScheduleBookingFlow.tsx`
- `CustomerBookingFlow.tsx`
- `PackagePurchaseFlow.tsx`

**After:** Single unified component
```tsx
import { MasterBookingFlow } from '@/components/MasterBookingFlow';

function CheckoutPage() {
  return (
    <MasterBookingFlow 
      onCheckoutComplete={(orderData) => {
        console.log('Order completed:', orderData);
      }}
    />
  );
}
```

### 3. Unified Form System

**Before:** Inconsistent form handling
```tsx
function MyForm() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Manual validation and submission
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Manual form fields */}
    </form>
  );
}
```

**After:** Standardized form with validation
```tsx
import { UnifiedForm, FormField, FormSection } from '@/components/UnifiedForm';
import { z } from 'zod';

const mySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

function MyForm() {
  return (
    <UnifiedForm
      schema={mySchema}
      initialValues={{ name: '', email: '' }}
      onSubmit={async (data) => {
        // Handle submission
      }}
    >
      {({ values, errors, setValue, isSubmitting, isValid }) => (
        <FormSection title="User Information">
          <FormField label="Name" error={errors.name} required>
            <input
              value={values.name}
              onChange={(e) => setValue('name', e.target.value)}
              className="unified-form-input"
            />
          </FormField>
          
          <FormField label="Email" error={errors.email} required>
            <input
              type="email"
              value={values.email}
              onChange={(e) => setValue('email', e.target.value)}
              className="unified-form-input"
            />
          </FormField>
        </FormSection>
      )}
    </UnifiedForm>
  );
}
```

### 4. Header Consolidation

**Before:**
```tsx
import { Header } from '@/components/Header';
```

**After:**
```tsx
import { CentralizedHeader } from '@/components/CentralizedHeader';
```

**Note:** `Header.tsx` is deprecated but still functional for backward compatibility.

## Styling System

### CSS Custom Properties

All components now use CSS custom properties defined in `styles/unified-component-styles.css`:

```css
:root {
  /* Primary Colors */
  --unified-primary: #6ea058;
  --unified-primary-hover: #5a8a47;
  --unified-primary-contrast: #ffffff;
  
  /* Background Colors */
  --unified-bg-primary: #f4eeed;
  --unified-bg-secondary: #ede6e5;
  --unified-bg-surface: #ffffff;
  
  /* Text Colors */
  --unified-text-primary: #383838;
  --unified-text-secondary: #666666;
  
  /* Spacing */
  --unified-spacing-xs: 0.25rem;
  --unified-spacing-sm: 0.5rem;
  --unified-spacing-md: 0.75rem;
  --unified-spacing-lg: 1rem;
  --unified-spacing-xl: 1.5rem;
  
  /* Border Radius */
  --unified-radius-sm: 0.375rem;
  --unified-radius-md: 0.5rem;
  --unified-radius-lg: 0.75rem;
}
```

### Unified Classes

Use these classes instead of inline styles or one-off CSS:

**Buttons:**
```tsx
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
```

**Forms:**
```tsx
<input className="unified-form-input" />
<select className="unified-form-select" />
<textarea className="unified-form-textarea" />
```

**Cards:**
```tsx
<div className="unified-card">
  <div className="unified-card__header">
    <h3 className="unified-card__title">Title</h3>
  </div>
  <div className="unified-card__content">
    Content
  </div>
</div>
```

**Layout:**
```tsx
<div className="unified-container">
  <div className="unified-flex unified-items-center unified-justify-between">
    <div>Left content</div>
    <div>Right content</div>
  </div>
</div>
```

## Migration Steps

### 1. Update Imports

Replace deprecated component imports:
```bash
# Find and replace
s/import.*Header.*from.*['\"]\.\/Header['\"]/import { CentralizedHeader } from '.\/CentralizedHeader'/g
```

### 2. Update Form Components

1. Install zod if not already installed:
```bash
npm install zod
```

2. Replace form components with `UnifiedForm`:
   - Define validation schemas using zod
   - Use `FormField` and `FormSection` for consistent layout
   - Apply unified CSS classes

### 3. Update Booking Flows

Replace multiple booking components with `MasterBookingFlow`:
```tsx
// Before: Multiple components
<BookingSection />
<CalendlyBookingFlow />
<PackagesBookingFlow />

// After: Single component
<MasterBookingFlow onCheckoutComplete={handleComplete} />
```

### 4. Apply Unified Styling

1. Replace inline styles with CSS custom properties:
```tsx
// Before
<div style={{ backgroundColor: '#6ea058', padding: '10px' }}>

// After
<div className="unified-bg-primary unified-p-md">
```

2. Use unified classes for common patterns:
```tsx
// Before
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">

// After
<div className="unified-flex unified-items-center unified-justify-between unified-p-lg unified-bg-surface unified-rounded unified-shadow">
```

## Benefits

1. **Consistency**: All components follow the same design patterns
2. **Maintainability**: Single source of truth for styling and behavior
3. **Performance**: Reduced bundle size through component consolidation
4. **Developer Experience**: Predictable APIs and comprehensive TypeScript support
5. **Mobile-First**: Built-in responsive design and mobile optimizations

## Testing

After migration, test the following:

1. **Visual Consistency**: All forms and components look consistent
2. **Responsive Design**: Components work properly on mobile and desktop
3. **Form Validation**: All forms validate correctly using zod schemas
4. **Booking Flow**: Complete booking process works end-to-end
5. **Cart Functionality**: Cart operations work correctly
6. **Payment Processing**: Payment flow completes successfully

## Support

For questions or issues during migration:

1. Check the component documentation in the source files
2. Review the unified stylesheet for available classes
3. Test components in isolation before integrating
4. Use TypeScript for better error detection

## Deprecated Components

The following components are deprecated but still functional:

- `Header.tsx` → Use `CentralizedHeader.tsx`
- `BookingSection.tsx` → Use `MasterBookingFlow.tsx`
- `CalendlyBookingFlow.tsx` → Use `MasterBookingFlow.tsx`
- `PackagesBookingFlow.tsx` → Use `MasterBookingFlow.tsx`
- `ScheduleBookingFlow.tsx` → Use `MasterBookingFlow.tsx`
- `CustomerBookingFlow.tsx` → Use `MasterBookingFlow.tsx`
- `PackagePurchaseFlow.tsx` → Use `MasterBookingFlow.tsx`

These components will be removed in a future version, so migration is recommended.
