/**
 * ========================================================================================
 * COUNTRY INPUT COMPONENT
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * A country selection component with flag dropdown and lateral menu.
 * Based on the PhoneInput component design pattern.
 *
 * FEATURES:
 * - Country dropdown with flags
 * - Mobile-optimized touch targets
 * - Search functionality for countries
 * - Responsive design
 * - Form validation support
 * - Accessibility features
 *
 * DESIGN PATTERN:
 * - Follows the same styling classes and mobile optimizations as PhoneInput
 * - Uses the same countries data from lib/countries.ts
 * - Integrates with the existing design system
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
// import { Input } from '@/components/ui/input'; // Unused import
import { Label } from '@/components/ui/label';
import { countries, Country } from '@/lib/countries';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * COUNTRY INPUT PROPS
 * -------------------
 * Props passed to the CountryInput component
 */
interface CountryInputProps {
  /** Label for the country input field */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Current country code value (e.g., 'PE', 'US') */
  value: string;
  /** Callback when country changes */
  onChange: (countryCode: string) => void;
  /** Placeholder text for the country input */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Error message to display */
  error?: string;
  /** Default country code */
  defaultCountryCode?: string;
}

/**
 * COUNTRY INPUT COMPONENT
 * -----------------------
 * Renders a country selection input with flag dropdown
 *
 * @param props - Component props
 * @returns React component
 */
export function CountryInput({
  label,
  required = false,
  value,
  onChange,
  _placeholder = 'Select country',
  disabled = false,
  error,
  defaultCountryCode = 'PE'
}: CountryInputProps) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * INITIALIZE SELECTED COUNTRY
   * ---------------------------
   * Set the initial selected country based on value or default
   */
  useEffect(() => {
    const country = countries.find(c => c.country === value) || 
                   countries.find(c => c.country === defaultCountryCode) ||
                   countries[0];
    setSelectedCountry(country);
  }, [value, defaultCountryCode]);

  /**
   * HANDLE CLICK OUTSIDE
   * --------------------
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
        setCountrySearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * HANDLE COUNTRY SELECTION
   * ------------------------
   * Updates the selected country and calls onChange
   */
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    onChange(country.country);
    setIsCountryDropdownOpen(false);
    setCountrySearchTerm('');
  };

  /**
   * HANDLE DROPDOWN TOGGLE
   * ----------------------
   * Opens/closes the country dropdown
   */
  const handleDropdownToggle = () => {
    if (disabled) return;
    setIsCountryDropdownOpen(!isCountryDropdownOpen);
    if (!isCountryDropdownOpen) {
      setCountrySearchTerm('');
    }
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  /**
   * FILTERED COUNTRIES
   * ------------------
   * Countries filtered by search term
   */
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
    country.country.toLowerCase().includes(countrySearchTerm.toLowerCase())
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

      {/* Country Input Container */}
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
            <div className="flex items-center space-x-3">
              {selectedCountry && (
                <>
                  <span className="text-xl">{selectedCountry.flag}</span>
                  <span className="font-medium">{selectedCountry.name}</span>
                </>
              )}
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isCountryDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Country Dropdown */}
        <AnimatePresence>
          {isCountryDropdownOpen && (
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
                  <h3 className="text-lg font-semibold text-gray-900">Select Country</h3>
                  <button
                    onClick={() => setIsCountryDropdownOpen(false)}
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
                    placeholder="Search countries..."
                    value={countrySearchTerm}
                    onChange={(e) => setCountrySearchTerm(e.target.value)}
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

              {/* Countries List */}
              <div className="overflow-y-auto h-96 pb-16">
                {filteredCountries.map((country) => (
                  <button
                    key={`${country.country}-${country.name}`}
                    onClick={() => handleCountrySelect(country)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                      selectedCountry?.country === country.country ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{country.flag}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{country.name}</div>
                        <div className="text-sm text-gray-500">{country.country}</div>
                      </div>
                      {selectedCountry?.country === country.country && (
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
