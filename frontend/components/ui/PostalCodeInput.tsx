/**
 * ========================================================================================
 * POSTAL CODE INPUT COMPONENT
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * Renders a postal code selection input with lateral menu for Peru addresses.
 * Shows all available postal codes for the selected district.
 *
 * FEATURES:
 * ---------
 * - Lateral menu design with search functionality
 * - Shows all postal codes for selected district
 * - Click outside to close
 * - Keyboard navigation support
 * - Accessibility features
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { getPostalCodesForDistrict } from '@/lib/peru-shipping-data';
import { VirtualizedList } from '@/components/ui/VirtualizedList';

/**
 * POSTAL CODE DATA INTERFACE
 * --------------------------
 * Structure for postal code data
 */
interface PostalCode {
  code: string;
  name: string;
  flag: string;
}

/**
 * POSTAL CODE INPUT PROPS
 * -----------------------
 * Props passed to the PostalCodeInput component
 */
interface PostalCodeInputProps {
  /** Label for the input field */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Internal required flag */
  _required?: boolean;
  /** Current value of the input */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Error message to display */
  error?: string;
  /** Default postal code */
  defaultPostalCode?: string;
  /** Department code to filter postal codes */
  departmentCode?: string;
  /** Province code to filter postal codes */
  provinceCode?: string;
  /** District code to filter postal codes */
  districtCode?: string;
}

/**
 * POSTAL CODE INPUT COMPONENT
 * ---------------------------
 * Renders a postal code selection input with lateral menu
 *
 * @param props - Component props
 * @returns React component
 */
export function PostalCodeInput({
  label,
  _required = false,
  value,
  onChange,
  placeholder = 'Select postal code',
  disabled = false,
  error,
  defaultPostalCode = '',
  departmentCode,
  provinceCode,
  districtCode
}: PostalCodeInputProps) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [selectedPostalCode, setSelectedPostalCode] = useState<PostalCode | null>(null);
  const [isPostalCodeDropdownOpen, setIsPostalCodeDropdownOpen] = useState(false);
  const [postalCodeSearchTerm, setPostalCodeSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * GET AVAILABLE POSTAL CODES
   * --------------------------
   * Get postal codes for the selected district
   */
  const getAvailablePostalCodes = () => {
    if (districtCode) {
      const postalCodes = getPostalCodesForDistrict(districtCode);
      
      if (postalCodes && postalCodes.length > 0) {
        return postalCodes.map(postalCode => ({
          code: postalCode,
          name: postalCode,
          flag: ''
        }));
      }
    }
    return [];
  };

  /**
   * INITIALIZE SELECTED POSTAL CODE
   * -------------------------------
   * Set the initial selected postal code based on value or default
   */
  useEffect(() => {
    const availablePostalCodes = getAvailablePostalCodes();
    const postalCode = availablePostalCodes.find(pc => pc.code === value) || 
                       availablePostalCodes.find(pc => pc.code === defaultPostalCode) ||
                       availablePostalCodes[0];
    setSelectedPostalCode(postalCode);
  }, [value, defaultPostalCode, departmentCode, provinceCode, districtCode]);

  /**
   * HANDLE CLICK OUTSIDE
   * --------------------
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPostalCodeDropdownOpen(false);
        setPostalCodeSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * HANDLE POSTAL CODE SELECTION
   * ----------------------------
   * Updates the selected postal code and calls onChange
   */
  const handlePostalCodeSelect = (postalCode: PostalCode) => {
    setSelectedPostalCode(postalCode);
    onChange(postalCode.code);
    setIsPostalCodeDropdownOpen(false);
    setPostalCodeSearchTerm('');
  };

  /**
   * HANDLE DROPDOWN TOGGLE
   * ----------------------
   * Opens/closes the postal code dropdown
   */
  const handleDropdownToggle = () => {
    if (disabled) return;
    setIsPostalCodeDropdownOpen(!isPostalCodeDropdownOpen);
    if (!isPostalCodeDropdownOpen) {
      setPostalCodeSearchTerm('');
    }
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  /**
   * AVAILABLE POSTAL CODES
   * ----------------------
   * Get all available postal codes for the selected district
   */
  const [isLoading, setIsLoading] = useState(false);
  const [availablePostalCodes, setAvailablePostalCodes] = useState<PostalCode[]>([]);

  // Load postal codes with loading state
  useEffect(() => {
    if (departmentCode && provinceCode && districtCode) {
      setIsLoading(true);
      // Simulate async loading for better UX
      setTimeout(() => {
        const postalCodes = getAvailablePostalCodes();
        setAvailablePostalCodes(postalCodes);
        setIsLoading(false);
      }, 100);
    } else {
      setAvailablePostalCodes([]);
    }
  }, [departmentCode, provinceCode, districtCode]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label}
        </Label>
      )}

      {/* Input Field */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={handleDropdownToggle}
          disabled={disabled}
          className={`
            w-full px-3 py-2 text-left border rounded-md shadow-sm h-12
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${disabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-900 cursor-pointer hover:border-gray-400'
            }
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
        >
          <div className="flex items-center justify-between">
            <span className={selectedPostalCode ? 'text-gray-900' : 'text-gray-500'}>
              {selectedPostalCode ? selectedPostalCode.name : placeholder}
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isPostalCodeDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isPostalCodeDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.2 }}
              className="fixed right-0 top-20 bottom-20 w-80 bg-white border-l border-gray-200 shadow-lg z-[999999]"
              style={{ top: '80px', bottom: '80px' }}
            >
              {/* Search Input */}
              <div className="p-4 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search postal codes..."
                  value={postalCodeSearchTerm}
                  onChange={(e) => setPostalCodeSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>

              {/* Postal Code List - Virtualized for Performance */}
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading postal codes...</span>
                </div>
              ) : availablePostalCodes.length > 0 ? (
                <VirtualizedList
                  items={availablePostalCodes}
                  itemHeight={48}
                  containerHeight={500}
                  searchTerm={postalCodeSearchTerm}
                  searchFields={['name', 'code']}
                  className="pb-16"
                  renderItem={(postalCode, index) => (
                    <button
                      key={`${postalCode.code}-${index}`}
                      type="button"
                      onClick={() => handlePostalCodeSelect(postalCode)}
                      className={`
                        w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50
                        ${selectedPostalCode?.code === postalCode.code ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                      `}
                    >
                      <div className="flex items-center">
                        <span className="font-medium">{postalCode.name}</span>
                      </div>
                    </button>
                  )}
                />
              ) : (
                <div className="px-4 py-3 text-gray-500 text-center">
                  {!departmentCode || !provinceCode || !districtCode
                    ? 'Select department, province, and district first' 
                    : 'No postal codes found'
                  }
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
