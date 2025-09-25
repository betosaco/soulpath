/**
 * ========================================================================================
 * DISTRICT INPUT COMPONENT
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * A district selection component with lateral menu, similar to CountryInput.
 * Shows Peru districts with search functionality.
 *
 * FEATURES:
 * - District dropdown with lateral menu
 * - Mobile-optimized touch targets
 * - Search functionality for districts
 * - Responsive design
 * - Form validation support
 * - Accessibility features
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { getDistrictsByProvince } from '@/lib/peru-shipping-data';
import { VirtualizedList } from '@/components/ui/VirtualizedList';

/**
 * DISTRICT DATA INTERFACE
 * -----------------------
 * Structure for district data
 */
interface District {
  code: string;
  name: string;
  postalCodes: string[];
  flag: string;
}

/**
 * DISTRICT DATA
 * -------------
 * Districts are now loaded dynamically from the geographic data file
 */

/**
 * DISTRICT INPUT PROPS
 * --------------------
 * Props passed to the DistrictInput component
 */
interface DistrictInputProps {
  /** Label for the district input field */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Internal required flag */
  _required?: boolean;
  /** Current district value */
  value: string;
  /** Callback when district changes */
  onChange: (districtCode: string, postalCode?: string) => void;
  /** Placeholder text for the district input */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Error message to display */
  error?: string;
  /** Default district code */
  defaultDistrictCode?: string;
  /** Department code to filter districts */
  departmentCode?: string;
  /** Province code to filter districts */
  provinceCode?: string;
}

/**
 * DISTRICT INPUT COMPONENT
 * ------------------------
 * Renders a district selection input with lateral menu
 *
 * @param props - Component props
 * @returns React component
 */
export function DistrictInput({
  label,
  _required = false,
  value,
  onChange,
  placeholder = 'Select district',
  disabled = false,
  error,
  defaultDistrictCode = 'MIR',
  departmentCode,
  provinceCode,
}: DistrictInputProps) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [districtSearchTerm, setDistrictSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * GET AVAILABLE DISTRICTS
   * -----------------------
   * Get districts based on selected department and province
   */
  const getAvailableDistricts = () => {
    if (provinceCode) {
      const mtcDistricts = getDistrictsByProvince(provinceCode);
      return mtcDistricts.map(d => ({
        code: d.code,
        name: d.name,
        postalCodes: d.postalCodes,
        flag: ''
      }));
    }
    return [];
  };

  /**
   * INITIALIZE SELECTED DISTRICT
   * ----------------------------
   * Set the initial selected district based on value or default
   */
  useEffect(() => {
    const availableDistricts = getAvailableDistricts();
    const district = availableDistricts.find(d => d.code === value) || 
                     availableDistricts.find(d => d.code === defaultDistrictCode) ||
                     availableDistricts[0];
    setSelectedDistrict(district);
  }, [value, defaultDistrictCode, departmentCode, provinceCode]);

  /**
   * HANDLE CLICK OUTSIDE
   * --------------------
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDistrictDropdownOpen(false);
        setDistrictSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * HANDLE DISTRICT SELECTION
   * -------------------------
   * Updates the selected district and calls onChange
   */
  const handleDistrictSelect = (district: District) => {
    setSelectedDistrict(district);
    // Use the primary postal code (first one in the array)
    const primaryPostalCode = district.postalCodes && district.postalCodes.length > 0 ? district.postalCodes[0] : '';
    onChange(district.code, primaryPostalCode);
    setIsDistrictDropdownOpen(false);
    setDistrictSearchTerm('');
  };

  /**
   * HANDLE DROPDOWN TOGGLE
   * ----------------------
   * Opens/closes the district dropdown
   */
  const handleDropdownToggle = () => {
    if (disabled) return;
    setIsDistrictDropdownOpen(!isDistrictDropdownOpen);
    if (!isDistrictDropdownOpen) {
      setDistrictSearchTerm('');
    }
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  /**
   * AVAILABLE DISTRICTS
   * -------------------
   * Get all available districts for the selected department and province
   */
  const [isLoading, setIsLoading] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);

  // Load districts with loading state
  useEffect(() => {
    if (departmentCode && provinceCode) {
      setIsLoading(true);
      // Simulate async loading for better UX
      setTimeout(() => {
        const districts = getAvailableDistricts();
        setAvailableDistricts(districts);
        setIsLoading(false);
      }, 100);
    } else {
      setAvailableDistricts([]);
    }
  }, [departmentCode, provinceCode]);

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

      {/* District Input Container */}
      <div className="relative" ref={dropdownRef}>
        {/* Main Input Button */}
        <button
          type="button"
          onClick={handleDropdownToggle}
          disabled={disabled}
          className={`w-full px-4 py-3 border rounded-lg text-left transition-all duration-200 h-12 ${
            error
              ? 'border-red-300 bg-red-50 text-red-900'
              : disabled
              ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
              : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {selectedDistrict ? (
                <div className="flex flex-col">
                  <span className="font-medium">{selectedDistrict.name}</span>
                </div>
              ) : (
                <span className="text-gray-500">{placeholder}</span>
              )}
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isDistrictDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* District Dropdown */}
        <AnimatePresence>
          {isDistrictDropdownOpen && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 w-80 bg-white shadow-2xl border-l border-gray-200 z-50 overflow-hidden"
              style={{ top: '80px', bottom: '80px' }}
            >
              {/* Dropdown Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Select District</h3>
                  <button
                    onClick={() => setIsDistrictDropdownOpen(false)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search districts..."
                    value={districtSearchTerm}
                    onChange={(e) => setDistrictSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <svg
                    className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Districts List - Virtualized for Performance */}
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading districts...</span>
                </div>
              ) : availableDistricts.length > 0 ? (
                <VirtualizedList
                  items={availableDistricts}
                  itemHeight={60}
                  containerHeight={600}
                  searchTerm={districtSearchTerm}
                  searchFields={['name', 'code']}
                  className="pb-16"
                  renderItem={(district, index) => (
                    <button
                      key={`${district.code}-${district.name}-${index}`}
                      onClick={() => handleDistrictSelect(district)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                        selectedDistrict?.code === district.code ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{district.name}</div>
                          <div className="text-sm text-gray-500">
                            {district.code} {district.postalCode && `• ${district.postalCode}`}
                            {district.allPostalCodes && district.allPostalCodes.length > 1 && (
                              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                +{district.allPostalCodes.length - 1} more codes
                              </span>
                            )}
                          </div>
                        </div>
                        {selectedDistrict?.code === district.code && (
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  )}
                />
              ) : (
                <div className="px-4 py-3 text-gray-500 text-center">
                  {!departmentCode || !provinceCode 
                    ? 'Select department and province first' 
                    : 'No districts found'
                  }
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}
