# Frontend Codebase Export Scripts

This directory contains scripts to export the MatMax Yoga Studio frontend codebase for analysis.

## Export Scripts

### 1. `export-essential-codebase.js`
**Full comprehensive export** - Includes all essential frontend code
- **Output**: `frontend-essential-codebase.txt` (4.18 MB)
- **Includes**: All app directories, components, lib, hooks, types, utils, styles, prisma, public, and config files
- **Use case**: Complete codebase analysis, full documentation

### 2. `export-ultra-essential.js`
**Ultra-essential export** - Most critical files for analysis
- **Output**: `frontend-ultra-essential.txt` (0.29 MB)
- **Includes**: Core pages, API routes, cart system, booking flows, essential components
- **Use case**: Focused analysis of core functionality

### 3. `export-core-codebase.js`
**Focused core export** - Includes only the most essential files
- **Output**: `frontend-core-codebase.txt` (0.29 MB)
- **Includes**: Core app pages, API routes, essential components, cart system, booking flows
- **Use case**: Quick analysis, core functionality review

### 4. `export-minimal-essential.js`
**Minimal essential export** - Absolute core files only
- **Output**: `frontend-minimal-essential.txt` (0.15 MB)
- **Includes**: Core pages, cart system, essential components, database schema
- **Use case**: Ultra-quick analysis, core business logic only

## Usage

```bash
# Full comprehensive export
node export-essential-codebase.js

# Ultra-essential export (recommended for analysis)
node export-ultra-essential.js

# Core export
node export-core-codebase.js

# Minimal essential export (ultra-quick)
node export-minimal-essential.js
```

## What's Included

### Core Features Exported
- ✅ **Cart System** with currency support (PEN)
- ✅ **Product E-commerce** functionality
- ✅ **Package Booking** system
- ✅ **Schedule Booking** system
- ✅ **Smart Checkout** flow (address only when mixed)
- ✅ **Database Integration** with Prisma
- ✅ **Next.js 14 App Router** structure
- ✅ **TypeScript + React** components
- ✅ **Tailwind CSS** styling

### Key Files in Core Export
- `app/layout.tsx` - Root layout
- `app/products/page.tsx` - Products listing
- `app/product/[id]/page.tsx` - Individual product
- `app/packages/page.tsx` - Packages page
- `app/schedule/page.tsx` - Schedule booking
- `app/checkout/page.tsx` - Checkout flow
- `lib/cart-context.tsx` - Global cart state
- `components/CartSidebar.tsx` - Cart UI
- `components/PackagesBookingFlow.tsx` - Package booking
- `components/ProductCheckoutFlow.tsx` - Product checkout
- `prisma/schema.prisma` - Database schema

## File Structure

```
frontend/
├── export-essential-codebase.js    # Full export script
├── export-ultra-essential.js       # Ultra-essential export script
├── export-core-codebase.js         # Core export script
├── export-minimal-essential.js     # Minimal export script
├── frontend-essential-codebase.txt # Full export output (4.18 MB)
├── frontend-ultra-essential.txt    # Ultra-essential output (0.29 MB)
├── frontend-core-codebase.txt      # Core export output (0.29 MB)
├── frontend-minimal-essential.txt  # Minimal export output (0.15 MB)
└── EXPORT_README.md               # This file
```

## Analysis Ready

All exported files are formatted for easy analysis with:
- Clear file separators
- File path headers
- Project overview
- Feature summaries
- Clean, readable code structure

Choose the appropriate export based on your analysis needs:
- **Complete analysis**: Use `frontend-essential-codebase.txt` (4.18 MB)
- **Focused analysis**: Use `frontend-ultra-essential.txt` (0.29 MB) ⭐ **RECOMMENDED**
- **Quick review**: Use `frontend-core-codebase.txt` (0.29 MB)
- **Ultra-quick**: Use `frontend-minimal-essential.txt` (0.15 MB)
