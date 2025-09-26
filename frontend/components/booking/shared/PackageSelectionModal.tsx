/**
 * ========================================================================================
 * PACKAGE SELECTION MODAL COMPONENT
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * Modal component that allows users to select which package should be used for booking
 * when multiple packages are available for the same time slot.
 *
 * FEATURES:
 * - Shows all packages that can book the selected time slot
 * - Displays package details (name, sessions remaining, progress)
 * - Allows cross-package booking (different packages can book same slot)
 * - Prevents same package from booking duplicate slots
 *
 * BUSINESS RULES:
 * - Cross-package booking ALLOWED: Different packages can book same time slot
 * - Duplicate prevention: Same package cannot book same slot twice
 * - Session limits: Only packages with remaining sessions are shown
 */

'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { X, Package, Calendar, Clock } from 'lucide-react';

/**
 * PACKAGE SELECTION MODAL PROPS
 * -----------------------------
 * Props for the PackageSelectionModal component
 */
interface PackageSelectionModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Position coordinates for the modal */
  position?: {
    x: number;
    y: number;
  };
  /** The selected schedule data */
  scheduleData: {
    selectedDate: string;
    selectedTime: string;
    teacher: string;
    serviceType: string;
    venue: string;
    scheduleSlotId: number;
  };
  /** Available packages for booking */
  availablePackages: Array<{
    id: string;
    originalId?: string; // Original package ID for business logic
    name: string;
    sessions: number;
    bookingDetails?: Array<{
      selectedDate?: string;
      selectedTime?: string;
      teacher?: string;
      dayOfWeek?: string;
      serviceType?: string;
      venue?: string;
      scheduleSlotId?: number;
    }>;
  }>;
  /** Callback when a package is selected */
  onPackageSelected: (packageId: string, scheduleData: any) => void;
  /** Function to get remaining sessions for a package */
  getPackageRemainingSessions: (packageId: string) => number;
}

/**
 * PACKAGE SELECTION MODAL COMPONENT
 * ---------------------------------
 * Modal for selecting which package to use for booking
 *
 * @param props - Component props
 * @returns React component
 */
export function PackageSelectionModal({
  isOpen,
  onClose,
  position,
  scheduleData,
  availablePackages,
  onPackageSelected,
  getPackageRemainingSessions
}: PackageSelectionModalProps) {
  // Don't render if not open
  if (!isOpen) return null;

  // Calculate safe position coordinates
  const getSafePosition = () => {
    if (!position || typeof window === 'undefined') {
      return null;
    }
    
    const maxX = window.innerWidth - 420; // 400px modal width + 20px margin
    const maxY = window.innerHeight - 320; // 300px modal height + 20px margin
    
    return {
      x: Math.min(Math.max(position.x, 20), maxX),
      y: Math.min(Math.max(position.y, 20), maxY)
    };
  };

  const safePosition = getSafePosition();
  
  // Debug logging
  console.log('🎯 Modal position debug:', {
    originalPosition: position,
    safePosition: safePosition,
    hasWindow: typeof window !== 'undefined',
    windowSize: typeof window !== 'undefined' ? { width: window.innerWidth, height: window.innerHeight } : null
  });

  /**
   * HANDLE PACKAGE SELECTION
   * ------------------------
   * Handles when user selects a package for booking
   *
   * @param packageId - The selected package ID (unique key)
   * @param originalId - The original package ID for business logic
   */
  const handlePackageSelect = (packageId: string, originalId?: string) => {
    // Use originalId if available, otherwise fall back to packageId
    const actualPackageId = originalId || packageId;
    onPackageSelected(actualPackageId, scheduleData);
    onClose();
  };

  /**
   * RENDER PACKAGE CARD
   * -------------------
   * Renders an individual package option
   *
   * @param pkg - Package data
   * @returns Package card JSX
   */
  const renderPackageCard = (pkg: any) => {
    const actualPackageId = pkg.originalId || pkg.id;
    const remaining = getPackageRemainingSessions(actualPackageId);
    const booked = pkg.bookingDetails?.length || 0;
    const total = pkg.sessions || 1;
    const progressPercentage = (booked / total) * 100;

    // Check if this package has already booked this specific slot
    const hasBookedThisSlot = pkg.bookingDetails?.some((booking: any) =>
      booking.selectedDate === scheduleData.selectedDate &&
      booking.selectedTime === scheduleData.selectedTime
    ) || false;

    // Check if package can be selected (has remaining sessions and hasn't booked this slot)
    const canSelect = remaining > 0 && !hasBookedThisSlot;

    return (
      <button
        key={pkg.id}
        onClick={() => canSelect ? handlePackageSelect(pkg.id, pkg.originalId) : null}
        disabled={!canSelect}
        className={`w-full p-4 border rounded-lg transition-all duration-200 text-left group ${
          canSelect 
            ? 'border-gray-200 hover:border-green-500 hover:bg-green-50' 
            : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
        }`}
        title={canSelect ? `Select ${pkg.name} for this booking` : 
               hasBookedThisSlot ? `${pkg.name} has already booked this time slot` :
               `${pkg.name} has no remaining sessions`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className={`font-semibold mb-2 ${
              canSelect 
                ? 'text-gray-900 group-hover:text-green-800' 
                : 'text-gray-500'
            }`}>
              {pkg.name}
              {hasBookedThisSlot && (
                <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                  Already Booked
                </span>
              )}
            </h4>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{booked} / {total} sessions booked</span>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{remaining} sessions remaining</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {Math.round(progressPercentage)}% complete
              </p>
            </div>
          </div>

          <div className="text-right ml-4">
            <div className={`font-bold text-lg ${
              canSelect ? 'text-green-600' : 'text-gray-400'
            }`}>
              {remaining}
            </div>
            <div className={`text-xs ${
              canSelect ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {hasBookedThisSlot ? 'booked this slot' : 'available'}
            </div>
          </div>
        </div>
      </button>
    );
  };

  /**
   * RENDER PACKAGE TOKEN
   * --------------------
   * Renders an individual package as a compact token/chip to adhere to styles
   *
   * @param pkg - Package data
   * @returns Package token JSX
   */
  const renderPackageToken = (pkg: any) => {
    const actualPackageId = pkg.originalId || pkg.id;
    const remaining = getPackageRemainingSessions(actualPackageId);
    const hasBookedThisSlot = pkg.bookingDetails?.some((booking: any) =>
      booking.selectedDate === scheduleData.selectedDate &&
      booking.selectedTime === scheduleData.selectedTime
    ) || false;

    const canSelect = remaining > 0 && !hasBookedThisSlot;

    return (
      <button
        key={`token-${pkg.id}`}
        onClick={() => canSelect ? handlePackageSelect(pkg.id, pkg.originalId) : null}
        disabled={!canSelect}
        title={canSelect ? `Select ${pkg.name} for this booking` :
               hasBookedThisSlot ? `${pkg.name} has already booked this time slot` :
               `${pkg.name} has no remaining sessions`}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${
          canSelect
            ? 'bg-[var(--matmax-purple-50)] text-[var(--matmax-purple-800)] border-[var(--matmax-purple-200)] hover:bg-[var(--matmax-purple-100)] hover:border-[var(--matmax-purple-300)]'
            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-70'
        }`}
      >
        <span className="truncate max-w-[14rem]">{pkg.name}</span>
        {hasBookedThisSlot && (
          <span className="badge badge-warning">Booked</span>
        )}
        <span
          className={`ml-1 text-xs px-2 py-0.5 rounded-full border ${
            canSelect ? 'bg-white/70 text-[var(--matmax-purple-900)] border-[var(--matmax-purple-200)]' : 'bg-gray-50 text-gray-400 border-gray-200'
          }`}
          aria-label="remaining sessions"
        >
          {remaining}
        </span>
      </button>
    );
  };

  // Use portal to render modal at document body level
  const modalContent = (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[999999] flex items-start justify-center p-4 pt-20" style={{ zIndex: 999999 }}>
        {/* Modal positioned at top of page with maximum z-index */}
        <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto relative z-[999999]" style={{ zIndex: 999999 }}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Select Package for Booking
              </h3>
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {scheduleData.selectedDate} at {scheduleData.selectedTime}
                  </span>
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  {scheduleData.serviceType} with {scheduleData.teacher}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              You have multiple packages available. Which package would you like to use for this booking?
            </p>

            <div className="flex flex-wrap gap-2">
              {availablePackages.map(renderPackageToken)}

              {availablePackages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No packages available for this time slot.</p>
                  <p className="text-sm">All packages have either reached capacity or already booked this slot.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  // Render modal using portal to document body
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  
  return null;
}
