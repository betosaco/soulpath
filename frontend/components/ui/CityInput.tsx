/**
 * ========================================================================================
 * CITY INPUT COMPONENT
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * A city selection component with lateral menu, similar to CountryInput.
 * Shows major Peru cities with search functionality.
 *
 * FEATURES:
 * - City dropdown with lateral menu
 * - Mobile-optimized touch targets
 * - Search functionality for cities
 * - Responsive design
 * - Form validation support
 * - Accessibility features
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CITY DATA INTERFACE
 * -------------------
 * Structure for city data
 */
interface City {
  code: string;
  name: string;
  flag: string;
}

/**
 * CITY DATA
 * ---------
 * Major cities in Peru
 */
const cities: City[] = [
  { code: 'Lima', name: 'Lima', flag: '' },
  { code: 'Callao', name: 'Callao', flag: '' },
  { code: 'Arequipa', name: 'Arequipa', flag: '' },
  { code: 'Cusco', name: 'Cusco', flag: '' },
  { code: 'Chiclayo', name: 'Chiclayo', flag: '' },
  { code: 'Piura', name: 'Piura', flag: '' },
  { code: 'Tacna', name: 'Tacna', flag: '' },
  { code: 'Ica', name: 'Ica', flag: '' },
  { code: 'Trujillo', name: 'Trujillo', flag: '' },
  { code: 'Huancayo', name: 'Huancayo', flag: '' },
  { code: 'Iquitos', name: 'Iquitos', flag: '' },
  { code: 'Chimbote', name: 'Chimbote', flag: '' },
  { code: 'Pucallpa', name: 'Pucallpa', flag: '' },
  { code: 'Cajamarca', name: 'Cajamarca', flag: '' },
  { code: 'Ayacucho', name: 'Ayacucho', flag: '' }
];

/**
 * CITY INPUT PROPS
 * ----------------
 * Props passed to the CityInput component
 */
interface CityInputProps {
  /** Label for the city input field */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Current city value */
  value: string;
  /** Callback when city changes */
  onChange: (cityCode: string) => void;
  /** Placeholder text for the city input */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Error message to display */
  error?: string;
  /** Default city code */
  defaultCityCode?: string;
}

/**
 * CITY INPUT COMPONENT
 * --------------------
 * Renders a city selection input with lateral menu
 *
 * @param props - Component props
 * @returns React component
 */
export function CityInput({
  label,
  required = false,
  value,
  onChange,
  placeholder = 'Select city',
  disabled = false,
  error,
  defaultCityCode = 'Lima'
}: CityInputProps) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * INITIALIZE SELECTED CITY
   * ------------------------
   * Set the initial selected city based on value or default
   */
  useEffect(() => {
    const city = cities.find(c => c.code === value) || 
                 cities.find(c => c.code === defaultCityCode) ||
                 cities[0];
    setSelectedCity(city);
  }, [value, defaultCityCode]);

  /**
   * HANDLE CLICK OUTSIDE
   * --------------------
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
        setCitySearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * HANDLE CITY SELECTION
   * ---------------------
   * Updates the selected city and calls onChange
   */
  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    onChange(city.code);
    setIsCityDropdownOpen(false);
    setCitySearchTerm('');
  };

  /**
   * HANDLE DROPDOWN TOGGLE
   * ----------------------
   * Opens/closes the city dropdown
   */
  const handleDropdownToggle = () => {
    if (disabled) return;
    setIsCityDropdownOpen(!isCityDropdownOpen);
    if (!isCityDropdownOpen) {
      setCitySearchTerm('');
    }
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  /**
   * FILTERED CITIES
   * ---------------
   * Cities filtered by search term
   */
  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(citySearchTerm.toLowerCase()) ||
    city.code.toLowerCase().includes(citySearchTerm.toLowerCase())
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
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      {/* City Input Container */}
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
              {selectedCity && (
                <span className="font-medium">{selectedCity.name}</span>
              )}
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isCityDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* City Dropdown */}
        <AnimatePresence>
          {isCityDropdownOpen && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 w-80 bg-white shadow-2xl border-l border-gray-200 z-50 overflow-hidden"
              style={{ top: '80px', bottom: 0 }}
            >
              {/* Dropdown Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Select City</h3>
                  <button
                    onClick={() => setIsCityDropdownOpen(false)}
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
                    placeholder="Search cities..."
                    value={citySearchTerm}
                    onChange={(e) => setCitySearchTerm(e.target.value)}
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

              {/* Cities List */}
              <div className="overflow-y-auto h-full pb-20">
                {filteredCities.map((city) => (
                  <button
                    key={`${city.code}-${city.name}`}
                    onClick={() => handleCitySelect(city)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                      selectedCity?.code === city.code ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{city.name}</div>
                        <div className="text-sm text-gray-500">{city.code}</div>
                      </div>
                      {selectedCity?.code === city.code && (
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
