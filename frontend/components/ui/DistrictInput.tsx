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

/**
 * DISTRICT DATA INTERFACE
 * -----------------------
 * Structure for district data
 */
interface District {
  code: string;
  name: string;
  flag: string;
  postalCode?: string;
}

/**
 * DISTRICT DATA
 * -------------
 * Districts organized by city
 */
const districtsByCity: Record<string, District[]> = {
  'Lima': [
    { code: 'Lima_Centro', name: 'Lima Centro', flag: '', postalCode: '15001' },
    { code: 'Rimac', name: 'Rímac', flag: '', postalCode: '15025' },
    { code: 'Breña', name: 'Breña', flag: '', postalCode: '15082' },
    { code: 'La_Victoria', name: 'La Victoria', flag: '', postalCode: '15013' },
    { code: 'Lince', name: 'Lince', flag: '', postalCode: '15073' },
    { code: 'Jesus_Maria', name: 'Jesús María', flag: '', postalCode: '15072' },
    { code: 'Pueblo_Libre', name: 'Pueblo Libre', flag: '', postalCode: '15084' },
    { code: 'Magdalena', name: 'Magdalena', flag: '', postalCode: '15076' }
  ],
  'Miraflores': [
    { code: 'MIR', name: 'Miraflores', flag: '', postalCode: '15074' }
  ],
  'San_Isidro': [
    { code: 'SAN', name: 'San Isidro', flag: '', postalCode: '15036' }
  ],
  'Surco': [
    { code: 'SUR', name: 'Surco', flag: '', postalCode: '15023' },
    { code: 'SANTIAGO', name: 'Santiago de Surco', flag: '', postalCode: '15023' }
  ],
  'La_Molina': [
    { code: 'LAP', name: 'La Molina', flag: '', postalCode: '15026' }
  ],
  'Chorrillos': [
    { code: 'CHI', name: 'Chorrillos', flag: '', postalCode: '15063' },
    { code: 'LUR', name: 'Lurín', flag: '', postalCode: '15080' },
    { code: 'PUN', name: 'Punta Negra', flag: '', postalCode: '15065' },
    { code: 'PUC', name: 'Pucusana', flag: '', postalCode: '15066' }
  ],
  'Callao': [
    { code: 'Callao_Centro', name: 'Callao Centro', flag: '', postalCode: '07001' },
    { code: 'Bellavista', name: 'Bellavista', flag: '', postalCode: '07002' },
    { code: 'Carmen_de_la_Legua', name: 'Carmen de la Legua', flag: '', postalCode: '07003' },
    { code: 'La_Perla', name: 'La Perla', flag: '', postalCode: '07004' },
    { code: 'La_Punta', name: 'La Punta', flag: '', postalCode: '07005' },
    { code: 'Ventanilla', name: 'Ventanilla', flag: '', postalCode: '07006' }
  ]
};

// Get all districts for backward compatibility
const districts: District[] = Object.values(districtsByCity).flat();

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
  /** City code to filter districts */
  cityCode?: string;
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
  required = false,
  value,
  onChange,
  placeholder = 'Select district',
  disabled = false,
  error,
  defaultDistrictCode = 'MIR',
  cityCode
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
   * Get districts based on selected city
   */
  const getAvailableDistricts = () => {
    if (cityCode && districtsByCity[cityCode]) {
      return districtsByCity[cityCode];
    }
    return districts;
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
  }, [value, defaultDistrictCode, cityCode]);

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
    onChange(district.code, district.postalCode);
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
   * FILTERED DISTRICTS
   * ------------------
   * Districts filtered by search term and city
   */
  const filteredDistricts = getAvailableDistricts().filter(district =>
    district.name.toLowerCase().includes(districtSearchTerm.toLowerCase()) ||
    district.code.toLowerCase().includes(districtSearchTerm.toLowerCase())
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

      {/* District Input Container */}
      <div className="relative" ref={dropdownRef}>
        {/* Main Input Button */}
        <button
          type="button"
          onClick={handleDropdownToggle}
          disabled={disabled}
          className={`w-full px-4 py-3 border rounded-lg text-left transition-all duration-200 ${
            error
              ? 'border-red-300 bg-red-50 text-red-900'
              : disabled
              ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
              : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {selectedDistrict && (
                <span className="font-medium">{selectedDistrict.name}</span>
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

              {/* Districts List */}
              <div className="overflow-y-auto h-full pb-16">
                {filteredDistricts.map((district) => (
                  <button
                    key={`${district.code}-${district.name}`}
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
                        </div>
                      </div>
                      {selectedDistrict?.code === district.code && (
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
