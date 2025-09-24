# 🏗️ Booking Flow Architecture

## Overview

This document describes the new modular, route-driven booking system architecture that replaces the monolithic `MasterBookingFlow.tsx` component. The new architecture emphasizes maintainability, scalability, and developer experience.

## 🏛️ Architecture Principles

### 1. **URL-Driven State Management**
- The URL is the single source of truth for the user's position in the booking flow
- No more fragile sessionStorage-based state management
- Bookmarks and browser navigation work seamlessly

### 2. **Modular Component Design**
- Each step is a focused, single-responsibility component
- Easy to test, debug, and extend individual steps
- Clear separation between UI and business logic

### 3. **Centralized Flow Logic**
- `useBookingFlow` hook manages all flow transitions and validation
- Scenario-specific logic is encapsulated and documented
- Pure functions for business rules

### 4. **Explicit Scenario Mapping**
- All user journeys are explicitly defined and documented
- No implicit state transitions or side effects
- Easy to add new scenarios or modify existing ones

## 📁 File Structure

```
frontend/
├── app/booking/                    # Route handlers
│   ├── packages/page.tsx          # /booking/packages
│   ├── schedule/page.tsx          # /booking/schedule
│   ├── multi-package/page.tsx     # /booking/schedule/multi-package
│   ├── customer-info/page.tsx     # /booking/customer-info
│   ├── shipping/page.tsx          # /booking/shipping
│   ├── payment/page.tsx           # /booking/payment
│   └── confirmation/page.tsx      # /booking/confirmation
├── components/booking/
│   ├── layout/
│   │   └── BookingLayout.tsx      # Shared navigation & progress
│   ├── steps/
│   │   ├── PackageSelectionStep.tsx
│   │   ├── ScheduleSelectionStep.tsx
│   │   ├── CustomerInfoStep.tsx
│   │   ├── ShippingStep.tsx
│   │   ├── PaymentStep.tsx
│   │   └── ConfirmationStep.tsx
│   ├── hooks/
│   │   └── useBookingFlow.ts      # Central flow management
│   └── shared/
│       └── PackageCard.tsx        # Reusable components
```

## 🔄 User Scenarios

| Scenario | Entry Point | Initial Route | Key URL Params | Logic Handler |
|----------|-------------|---------------|----------------|---------------|
| **Schedule-First** | Click "Book" on schedule slot | `/booking/packages` | `slotId=[ID]` | `handleScheduleFirst()` |
| **Package-First** | Add package to cart | `/booking/schedule` | `packageId=[ID]` | `handlePackageFirst()` |
| **Add More** | Click "Book Now" in cart | `/booking/schedule` | `packageId=[ID]`, `flowType=add-more` | `handleAddMore()` |
| **Multi-Package** | Cart with >1 package | `/booking/schedule/multi-package` | `multiPackage=true` | `handleMultiPackage()` |
| **Direct Checkout** | Cart ready for payment | `/booking/customer-info` | `isDirectCheckout=true` | `handleDirectCheckout()` |

## 🪝 useBookingFlow Hook

### Purpose
Centralizes all booking flow logic, replacing the complex state management in `MasterBookingFlow.tsx`.

### Key Features
- **Scenario Detection**: Automatically determines user journey from URL parameters
- **Navigation**: Provides `goToNextStep()`, `goToPreviousStep()`, and `goToStep()` functions
- **Validation**: Ensures transitions follow business rules
- **URL State**: Manages URL parameters for bookmarkable state

### Usage Example
```typescript
function ScheduleSelectionStep() {
  const {
    scenario,
    currentStep,
    canGoNext,
    goToNextStep,
    isScheduleFirst,
    isPackageFirst
  } = useBookingFlow();

  // Component logic based on scenario
  if (isScheduleFirst) {
    // Handle schedule-first flow
  }
}
```

## 🧩 Component Decomposition

### Before (Monolithic)
- Single 2441-line component handling all scenarios
- Complex conditional rendering based on implicit state
- Difficult to test and maintain

### After (Modular)
- 6 focused step components (~200-400 lines each)
- Clear props interfaces and JSDoc documentation
- Easy to unit test individual steps

### Shared Components
- `BookingLayout`: Progress stepper and navigation
- `PackageCard`: Reusable package display
- `CartSummary`: Booking details display

## 🔗 Route Structure

```
/products                    # Main product listing
  ↓ (Add to Cart)
/booking/schedule?packageId=X  # Package-first flow
  ↓ (Select slots)
/booking/customer-info       # Customer details
  ↓
/booking/shipping            # Shipping (conditional)
  ↓
/booking/payment            # Payment processing
  ↓
/booking/confirmation       # Success page

/schedule                    # Main schedule view
  ↓ (Click "Book")
/booking/packages?slotId=X   # Schedule-first flow
  ↓ (Select package)
/booking/schedule           # Schedule selection
  ↓ ...continues to checkout
```

## 🧪 Testing Strategy

### Unit Tests
- Test each step component in isolation
- Mock `useBookingFlow` hook for controlled testing
- Test validation logic separately

### Integration Tests
- Test complete user journeys end-to-end
- Verify URL state management
- Test cart integration

### Scenario Testing
- Test all 5 user scenarios independently
- Verify cross-package booking rules
- Test error states and recovery

## 🔧 Migration Strategy

### Phase 1: Infrastructure
1. Create new folder structure
2. Implement `useBookingFlow` hook
3. Create `BookingLayout` component

### Phase 2: Step Components
1. Extract `ScheduleSelectionStep` (most complex)
2. Extract `PackageSelectionStep`
3. Extract remaining steps (CustomerInfo, Shipping, Payment, Confirmation)

### Phase 3: Route Migration
1. Create new route handlers
2. Update navigation links
3. Test all scenarios

### Phase 4: Cleanup
1. Remove `MasterBookingFlow.tsx`
2. Update imports and references
3. Remove sessionStorage dependencies

## 📊 Benefits

### Developer Experience
- **Easier Debugging**: Isolated components with clear responsibilities
- **Better Testing**: Unit testable components and pure functions
- **Faster Development**: Reusable components and clear patterns

### User Experience
- **Reliable Navigation**: Browser back/forward works correctly
- **Bookmarkable Flows**: Users can save and share booking progress
- **Mobile Friendly**: Responsive components optimized for all devices

### Maintainability
- **Clear Documentation**: JSDoc comments explain purpose and usage
- **Explicit Logic**: No hidden state transitions or side effects
- **Scalable Architecture**: Easy to add new scenarios or modify existing ones

## 🚨 Cross-Package Booking Rules

The system maintains the existing business logic for cross-package booking:

### ✅ ALLOWED
- Package A books Slot X at 10:00 AM
- Package B books Slot X at 10:00 AM (same time slot)

### ❌ NOT ALLOWED
- Package A books Slot X at 10:00 AM twice (duplicate prevention)

### Implementation
```typescript
// In useBookingFlow.ts
const isTimeSlotLocked = (date: string, time: string, packageId?: string) => {
  return lockedTimeSlots.some(slot =>
    slot.selectedDate === date &&
    slot.selectedTime === time &&
    (!packageId || slot.packageId === packageId)
  );
};
```

This allows multiple packages to share popular time slots while preventing duplicate bookings within the same package.
