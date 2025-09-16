# Venue Management System

## Overview

The Venue Management System provides comprehensive functionality for managing wellness venues with full admin access control. This system allows administrators to create, edit, delete, and organize venues with amenities, capacity settings, and scheduling information.

## Features

### 🔐 Admin Access Control
- **Middleware Protection**: All venue management routes are protected by Next.js middleware
- **Role-Based Access**: Only users with `ADMIN` role can access venue management
- **Authentication Headers**: All API calls include proper JWT authentication
- **Access Denied UI**: Clear messaging for unauthorized users

### 🏢 Venue Management
- **Create Venues**: Add new venues with comprehensive details
- **Edit Venues**: Update existing venue information
- **Delete Venues**: Remove venues with confirmation
- **Status Toggle**: Activate/deactivate venues in real-time
- **Featured Venues**: Mark venues as featured for prominence

### 📊 Advanced Features
- **Dual View Modes**: Grid and table views for different preferences
- **Search & Filter**: Find venues by name, city, country, or status
- **Sorting**: Sort by name, city, capacity, teachers, schedules, or status
- **Real-time Updates**: Immediate UI updates after operations
- **Error Handling**: Comprehensive error messages and loading states

### 🎯 Venue Properties
- **Basic Info**: Name, description, address, city, country
- **Capacity Settings**: Maximum capacity and group size limits
- **Display Settings**: Display order and featured status
- **Amenities**: Multi-select amenity management
- **Status Control**: Active/inactive state management

## Components

### VenueManagement.tsx
Basic venue management component with essential CRUD operations.

### VenueManagementEnhanced.tsx
Advanced venue management with:
- Grid and table view modes
- Advanced sorting and filtering
- Real-time status toggles
- Comprehensive form validation
- Enhanced UI/UX

## API Endpoints

### GET /api/admin/venues
- **Purpose**: Fetch all venues with optional filtering
- **Authentication**: Required (Admin only)
- **Query Parameters**:
  - `include`: 'teachers', 'schedules', or 'all'
  - `isActive`: 'true' or 'false'
  - `featured`: 'true' or 'false'
  - `city`: Filter by city name
  - `page`: Pagination page number
  - `limit`: Results per page

### POST /api/admin/venues
- **Purpose**: Create a new venue
- **Authentication**: Required (Admin only)
- **Body**: Venue data including name, description, capacity, amenities, etc.

### PUT /api/admin/venues
- **Purpose**: Update an existing venue
- **Authentication**: Required (Admin only)
- **Body**: Updated venue data with ID

### DELETE /api/admin/venues
- **Purpose**: Delete a venue
- **Authentication**: Required (Admin only)
- **Query Parameters**: `id` - Venue ID to delete

## Database Schema

### Venue Model
```prisma
model Venue {
  id                Int             @id @default(autoincrement())
  name              String          @db.VarChar(255)
  description       String?
  address           String?         @db.Text
  city              String?         @db.VarChar(100)
  country           String?         @db.VarChar(100)
  capacity          Int             @default(10)
  maxGroupSize      Int?            @map("max_group_size")
  isActive          Boolean?        @default(true) @map("is_active")
  displayOrder      Int?            @default(0) @map("display_order")
  featured          Boolean?        @default(false) @map("featured")
  createdAt         DateTime?       @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt         DateTime?       @default(now()) @updatedAt @map("updated_at") @db.Timestamptz(6)
  
  // Relations
  scheduleTemplates ScheduleTemplate[]
  teachers          Teacher[]
  teacherSchedules  TeacherSchedule[]
  bookings          Booking[]
  amenities         VenueAmenity[]
  servicePrices     ServicePrice[]
}
```

### VenueAmenity Model
```prisma
model VenueAmenity {
  id        Int     @id @default(autoincrement())
  venueId   Int     @map("venue_id")
  amenityId Int     @map("amenity_id")
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  venue     Venue   @relation(fields: [venueId], references: [id], onDelete: Cascade)
  amenity   Amenity @relation(fields: [amenityId], references: [id], onDelete: Cascade)

  @@unique([venueId, amenityId])
}
```

## Usage

### Accessing Venue Management
1. **Admin Dashboard**: Navigate to the admin dashboard
2. **Sidebar Menu**: Click on "Venue Management" in the "Venues & Teachers" section
3. **Direct URL**: `/admin/venues` (protected by middleware)

### Creating a Venue
1. Click "Add Venue" button
2. Fill in required fields (name, capacity)
3. Add optional details (description, address, city, country)
4. Select amenities from available options
5. Set display order and featured status
6. Click "Create Venue"

### Editing a Venue
1. Click "Edit" button on any venue card
2. Modify the venue information
3. Update amenities selection
4. Click "Update Venue"

### Managing Venue Status
- **Toggle Active/Inactive**: Use the status toggle button
- **Featured Venues**: Check the "Featured" checkbox in the form
- **Display Order**: Set numerical order for venue listing

## Security Features

### Authentication
- All API endpoints require valid JWT tokens
- Middleware validates tokens and user roles
- Automatic token refresh handling

### Authorization
- Only users with `ADMIN` role can access venue management
- Role checking happens at both middleware and component levels
- Clear access denied messaging for unauthorized users

### Data Validation
- Server-side validation using Zod schemas
- Client-side form validation
- Duplicate name prevention
- Required field validation

## Error Handling

### API Errors
- Network error handling
- Authentication error handling
- Validation error display
- Server error fallbacks

### User Experience
- Loading states during operations
- Success/error toast notifications
- Form validation feedback
- Confirmation dialogs for destructive actions

## Integration

### Admin Dashboard
- Integrated into main admin sidebar
- Consistent UI/UX with other admin components
- Shared authentication and error handling

### Teacher Management
- Venues linked to teachers
- Teacher-venue relationship management
- Schedule template integration

### Booking System
- Venue capacity validation
- Booking availability checking
- Venue-specific pricing

## Future Enhancements

### Planned Features
- **Image Management**: Upload and manage venue photos
- **Location Services**: Google Maps integration
- **Analytics**: Venue usage statistics
- **Bulk Operations**: Mass venue updates
- **Import/Export**: CSV venue data management
- **Advanced Filtering**: More filter options
- **Venue Templates**: Pre-configured venue setups

### Technical Improvements
- **Caching**: Redis caching for venue data
- **Search**: Full-text search capabilities
- **Pagination**: Server-side pagination
- **Real-time Updates**: WebSocket integration
- **Mobile Optimization**: Responsive design improvements

## Troubleshooting

### Common Issues
1. **Authentication Errors**: Ensure user has admin role
2. **API Failures**: Check network connection and token validity
3. **Form Validation**: Verify all required fields are filled
4. **Permission Denied**: Confirm admin access rights

### Debug Information
- Check browser console for error details
- Verify API endpoint responses
- Confirm database connectivity
- Validate user authentication status

## Support

For technical support or feature requests, please refer to the main project documentation or contact the development team.
