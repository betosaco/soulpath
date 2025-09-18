# Package Update: 60 Minutes Class, 30 Days Validity

## Summary
Updated the wellness platform to show packages with 60-minute class duration and 30-day validity period.

## Database Changes

### 1. Session Duration Updated
- Updated session duration ID 1 to 60 minutes
- Name: "60-Minute Class"
- Description: "Standard 60-minute wellness class session"

### 2. Package Descriptions Updated
- All existing packages now show "60 minutes class, valid for 30 days" in descriptions
- Updated 5 packages: 01 MATPASS, 04 MATPASS, 08 MATPASS, 12 MATPASS, 24 MATPASS

### 3. User Package Validity
- Updated existing user packages to have 30-day validity from purchase date
- Updated 2 existing user packages with new expiration dates

## API Changes

### Purchase APIs Updated
Updated all purchase APIs to set 30-day validity for new packages:
- `/api/stripe/webhook/route.ts` - Stripe webhook handler
- `/api/admin/purchases/route.ts` - Admin purchase creation
- `/api/client/purchase/route.ts` - Client purchase creation

**Before:** `expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)` (1 year)
**After:** `expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)` (30 days)

## UI Changes

### 1. Main Packages Page (`/app/packages/page.tsx`)
- Added prominent 30-day validity notice with calendar icon
- Updated package cards to show "Valid for 30 days" feature
- Added Calendar icon import

### 2. Client Packages Page (`/app/(client)/account/packages/page.tsx`)
- Updated package display to show both duration and validity
- Changed "About Our Packages" section to highlight 30-day validity
- Added Clock icon import

### 3. My Packages Page (`/app/(client)/account/my-packages/page.tsx`)
- Updated expiration display to show "Valid for 30 days - Expires: [date]"

### 4. Customer Dashboard (`/components/CustomerDashboard.tsx`)
- Updated package display to show "Valid for 30 days:" instead of just "Expires:"

### 5. Customer Booking Flow (`/components/CustomerBookingFlow.tsx`)
- Updated package selection to show "Valid for 30 days:" for expiration

## Scripts Created

### 1. `update-packages-60min-30days.js`
- Updates session duration to 60 minutes
- Updates package descriptions
- Sets 30-day validity for existing packages without expiration

### 2. `update-existing-packages-30days.js`
- Updates existing packages with long validity periods to 30 days
- Ensures packages don't expire immediately by using the later of purchase date + 30 days or current date + 30 days

## Files Modified

### Database Scripts
- `frontend/scripts/update-packages-60min-30days.js` (new)
- `frontend/scripts/update-existing-packages-30days.js` (new)

### API Routes
- `frontend/app/api/stripe/webhook/route.ts`
- `frontend/app/api/admin/purchases/route.ts`
- `frontend/app/api/client/purchase/route.ts`
- `frontend/app/api/admin/purchases/route.ts.backup`

### UI Components
- `frontend/app/packages/page.tsx`
- `frontend/app/(client)/account/packages/page.tsx`
- `frontend/app/(client)/account/my-packages/page.tsx`
- `frontend/components/CustomerDashboard.tsx`
- `frontend/components/CustomerBookingFlow.tsx`

## Result
- All packages now clearly display 60-minute session duration
- All packages show 30-day validity period prominently in the UI
- New purchases automatically get 30-day validity
- Existing packages were updated to 30-day validity
- UI components consistently show the new duration and validity information
