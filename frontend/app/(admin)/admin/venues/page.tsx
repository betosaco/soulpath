'use client';

import React from 'react';
import { VenueManagementEnhanced } from '@/components/admin/VenueManagementEnhanced';

/**
 * Venue Management Page
 * 
 * This page demonstrates the complete venue management functionality with:
 * - Admin access control (middleware protected)
 * - Full CRUD operations for venues
 * - Amenity management integration
 * - Advanced filtering and sorting
 * - Grid and table view modes
 * - Real-time status updates
 * - Comprehensive form validation
 */
export default function VenueManagementPage() {
  return (
    <div className="venue-management-page">
      <div className="venue-management-page__header">
        <h1 className="venue-management-page__title">Venue Management</h1>
        <p className="venue-management-page__description">
          Manage your wellness venues, amenities, and capacity settings. 
          Create, edit, and organize venues for your classes and sessions.
        </p>
      </div>
      
      <div className="venue-management-page__content">
        <VenueManagementEnhanced />
      </div>
    </div>
  );
}
