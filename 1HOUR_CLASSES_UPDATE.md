# 1-Hour Classes Update

## Overview
This update changes the wellness platform from 30-minute sessions to 1-hour classes throughout the entire system.

## Changes Made

### Database Schema Updates
- **Session Duration ID 1**: Changed from "30 Minutes" to "1 Hour" (60 minutes)
- **Session Duration ID 2**: Changed from "60 Minutes" to "90 Minutes" 
- **Session Duration ID 3**: Changed from "90 Minutes" to "120 Minutes"
- **Session Duration ID 4**: Changed from "120 Minutes" to "150 Minutes"

### Package Definitions
All MATPASS packages now use sessionDurationId: 1 (1 hour) and updated descriptions:
- **01 MATPASS**: "1 session of 1 hour"
- **04 MATPASS**: "4 sessions of 1 hour each"
- **08 MATPASS**: "8 sessions of 1 hour each"
- **12 MATPASS**: "12 sessions of 1 hour each"
- **24 MATPASS**: "24 sessions of 1 hour each"

### UI Components Updated
- **Packages Page**: Displays "1 hour per session" instead of "60 minutes per session"
- **Enhanced Packages Flow**: Shows "1 hour each" for 60-minute sessions
- **Schedule Booking Flow**: Displays "1 hour each" for 60-minute sessions
- **Translation Files**: Updated to "1-hour sessions with 30-day validity"
- **About Page**: Updated flexible scheduling description

### Telegram Bot Service
- **Package Information**: Updated to show "1-hour session" instead of "60/hour"
- **Session Duration**: Updated to use 1-hour classes
- **Package Descriptions**: All packages now reflect 1-hour duration

### Migration Scripts
Created migration scripts to update existing databases:
- `frontend/scripts/update-to-1hour-classes.js`
- `telegram-bot-service/scripts/update-to-1hour-classes.js`

## Running the Migration

### For Frontend Database
```bash
cd frontend
node scripts/update-to-1hour-classes.js
```

### For Telegram Bot Service Database
```bash
cd telegram-bot-service
node scripts/update-to-1hour-classes.js
```

## Key Features

### Smart Display Logic
The UI components now intelligently display:
- "1 hour" for 60-minute sessions
- "X minutes" for other durations (90, 120, 150 minutes)

### Backward Compatibility
- Maintains support for other session durations
- Existing data is preserved and updated appropriately
- All references are consistently updated

### Professional Presentation
- User-friendly "1 hour" display instead of "60 minutes"
- Consistent messaging across all touchpoints
- Updated both English and Spanish translations

## Files Modified

### Frontend
- `prisma/seed.ts` - Updated session durations and package definitions
- `app/(client)/account/packages/page.tsx` - Updated UI display
- `components/EnhancedPackagesFlow.tsx` - Updated package display
- `components/ScheduleBookingFlow.tsx` - Updated booking flow
- `lib/data/translations.ts` - Updated translations
- `app/about/page.tsx` - Updated about page

### Telegram Bot Service
- `prisma/seed.ts` - Updated session durations and package definitions
- `services/telegram-bot-service.js` - Updated package information

### Migration Scripts
- `frontend/scripts/update-to-1hour-classes.js` - Frontend migration
- `telegram-bot-service/scripts/update-to-1hour-classes.js` - Telegram bot migration

## Testing

After running the migration, verify:
1. Package descriptions show "1 hour" instead of "60 minutes"
2. UI components display "1 hour per session"
3. Telegram bot shows "1-hour session" in package information
4. All existing user packages have 30-day validity
5. Schedule templates use 1-hour sessions

## Notes

- The system maintains support for multiple session durations
- All changes are backward compatible
- Existing user data is preserved and updated appropriately
- The migration scripts can be run safely multiple times
