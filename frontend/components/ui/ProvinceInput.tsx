/**
 * ========================================================================================
 * PROVINCE INPUT COMPONENT
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * A province selection component with lateral menu, similar to CountryInput.
 * Shows Peru provinces with search functionality.
 *
 * FEATURES:
 * - Province dropdown with lateral menu
 * - Mobile-optimized touch targets
 * - Search functionality for provinces
 * - Responsive design
 * - Form validation support
 * - Accessibility features
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { getProvincesByDepartment } from '@/lib/peru-shipping-data';

/**
 * PROVINCE DATA INTERFACE
 * -----------------------
 * Structure for province data
 */
interface Province {
  code: string;
  name: string;
  flag: string;
}

/**
 * PROVINCE DATA
 * -------------
 * Provinces loaded from MTC database
 */

/**
 * PROVINCE INPUT PROPS
 * --------------------
 * Props passed to the ProvinceInput component
 */
interface ProvinceInputProps {
  /** Label for the province input field */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Current province value */
  value: string;
  /** Callback when province changes */
  onChange: (provinceCode: string) => void;
  /** Placeholder text for the province input */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Error message to display */
  error?: string;
  /** Default province code */
  defaultProvinceCode?: string;
  /** Department code to filter provinces */
  departmentCode?: string;
}

/**
 * PROVINCE INPUT COMPONENT
 * ------------------------
 * Renders a province selection input with lateral menu
 *
 * @param props - Component props
 * @returns React component
 */
export function ProvinceInput({
  label,
  _required = false,
  value,
  onChange,
  placeholder = 'Select province',
  disabled = false,
  error,
  defaultProvinceCode = 'LMA',
  departmentCode
}: ProvinceInputProps) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  const [provinceSearchTerm, setProvinceSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * GET AVAILABLE PROVINCES
   * -----------------------
   * Get provinces based on selected department
   */
  const getAvailableProvinces = () => {
    if (departmentCode) {
      const mtcProvinces = getProvincesByDepartment(departmentCode);
      return mtcProvinces.map(p => ({ code: p.code, name: p.name, flag: '' }));
    }
    return [];
  };

  /**
   * INITIALIZE SELECTED PROVINCE
   * ----------------------------
   * Set the initial selected province based on value or default
   */
  useEffect(() => {
    const availableProvinces = getAvailableProvinces();
    const province = availableProvinces.find(p => p.code === value) || 
                     availableProvinces.find(p => p.code === defaultProvinceCode) ||
                     availableProvinces[0];
    setSelectedProvince(province);
  }, [value, defaultProvinceCode, departmentCode]);

  /**
   * HANDLE CLICK OUTSIDE
   * --------------------
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProvinceDropdownOpen(false);
        setProvinceSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * HANDLE PROVINCE SELECTION
   * -------------------------
   * Updates the selected province and calls onChange
   */
  const handleProvinceSelect = (province: Province) => {
    setSelectedProvince(province);
    onChange(province.code);
    setIsProvinceDropdownOpen(false);
    setProvinceSearchTerm('');
  };

  /**
   * HANDLE DROPDOWN TOGGLE
   * ----------------------
   * Opens/closes the province dropdown
   */
  const handleDropdownToggle = () => {
    if (disabled) return;
    setIsProvinceDropdownOpen(!isProvinceDropdownOpen);
    if (!isProvinceDropdownOpen) {
      setProvinceSearchTerm('');
    }
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  /**
   * FILTERED PROVINCES
   * ------------------
   * Provinces filtered by search term
   */
  const availableProvinces = getAvailableProvinces();
  const filteredProvinces = availableProvinces.filter(province =>
    province.name.toLowerCase().includes(provinceSearchTerm.toLowerCase()) ||
    province.code.toLowerCase().includes(provinceSearchTerm.toLowerCase())
  );

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

      {/* Province Input Container */}
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
              <span className={selectedProvince ? 'font-medium text-gray-900' : 'text-gray-500'}>
                {selectedProvince ? selectedProvince.name : placeholder}
              </span>
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isProvinceDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Province Dropdown */}
        <AnimatePresence>
          {isProvinceDropdownOpen && (
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
                  <h3 className="text-lg font-semibold text-gray-900">Select Province</h3>
                  <button
                    onClick={() => setIsProvinceDropdownOpen(false)}
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
                    placeholder="Search provinces..."
                    value={provinceSearchTerm}
                    onChange={(e) => setProvinceSearchTerm(e.target.value)}
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

              {/* Provinces List */}
              <div className="overflow-y-auto h-96 pb-16">
                {filteredProvinces.map((province) => (
                  <button
                    key={`${province.code}-${province.name}`}
                    onClick={() => handleProvinceSelect(province)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                      selectedProvince?.code === province.code ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{province.name}</div>
                        <div className="text-sm text-gray-500">{province.code}</div>
                      </div>
                      {selectedProvince?.code === province.code && (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
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
