/**
 * ========================================================================================
 * PHONE INPUT COMPONENT
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * A comprehensive phone input component with country code dropdown and flag selection.
 * Based on the existing design pattern used throughout the codebase.
 *
 * FEATURES:
 * - Country code dropdown with flags
 * - Mobile-optimized touch targets
 * - Search functionality for countries
 * - Responsive design
 * - Form validation support
 * - Accessibility features
 *
 * DESIGN PATTERN:
 * - Follows the existing country dropdown pattern from PhoneVerificationModal
 * - Uses the same styling classes and mobile optimizations
 * - Integrates with the existing countries data from lib/countries.ts
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { countries, Country } from '@/lib/countries';

/**
 * PHONE INPUT PROPS
 * -----------------
 * Props passed to the PhoneInput component
 */
interface PhoneInputProps {
  /** Label for the phone input field */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Current phone number value */
  value: string;
  /** Callback when phone number changes */
  onChange: (phoneNumber: string, countryCode: string) => void;
  /** Placeholder text for the phone input */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Error message to display */
  error?: string;
  /** CSS class name for styling */
  className?: string;
  /** Default country code to select */
  defaultCountryCode?: string;
}

/**
 * PHONE INPUT COMPONENT
 * ---------------------
 * Renders a phone input with country code dropdown
 *
 * @param props - Component props
 * @returns React component
 */
export function PhoneInput({
  label = 'Phone Number',
  required = false,
  value,
  onChange,
  placeholder = 'Enter phone number',
  disabled = false,
  error,
  className = '',
  defaultCountryCode = '+51' // Default to Peru
}: PhoneInputProps) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * COUNTRY SELECTION STATE
   * -----------------------
   * Manages the selected country and dropdown visibility
   */
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    // Find default country or fallback to Peru
    return countries.find(country => country.code === defaultCountryCode) || countries[0];
  });

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');

  /**
   * REFS
   * -----
   * For handling click outside and focus management
   */
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * CLICK OUTSIDE HANDLER
   * ---------------------
   * Closes dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCountryDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
        setCountrySearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCountryDropdownOpen]);

  /**
   * FOCUS SEARCH INPUT
   * ------------------
   * Focuses search input when dropdown opens
   */
  useEffect(() => {
    if (isCountryDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isCountryDropdownOpen]);

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
    country.code.includes(countrySearchTerm) ||
    country.country.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * HANDLE COUNTRY SELECTION
   * ------------------------
   * Updates selected country and closes dropdown
   */
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsCountryDropdownOpen(false);
    setCountrySearchTerm('');
    
    // Notify parent component of the change
    onChange(value, country.code);
  };

  /**
   * HANDLE PHONE NUMBER CHANGE
   * --------------------------
   * Updates phone number and notifies parent
   */
  const handlePhoneChange = (phoneNumber: string) => {
    onChange(phoneNumber, selectedCountry.code);
  };

  /**
   * TOGGLE DROPDOWN
   * ---------------
   * Opens/closes the country dropdown
   */
  const toggleDropdown = () => {
    if (!disabled) {
      setIsCountryDropdownOpen(!isCountryDropdownOpen);
      if (!isCountryDropdownOpen) {
        setCountrySearchTerm('');
      }
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <Label className="text-gray-700 text-sm font-medium">
          {label} {required && '*'}
        </Label>
      )}

      {/* Phone Input Container */}
      <div className="flex gap-2 mobile-input-group">
        {/* Country Code Dropdown */}
        <div ref={dropdownRef} className="relative country-dropdown mobile-country-dropdown">
          <button
            type="button"
            onClick={toggleDropdown}
            disabled={disabled}
            className={`h-12 w-36 px-3 flex items-center space-x-2 border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mobile-touch-target rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm text-gray-700 font-medium">{selectedCountry.code}</span>
            <svg 
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isCountryDropdownOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-20 z-40 animate-[fadeIn_0.2s_ease-out_forwards]"
                onClick={() => {
                  setIsCountryDropdownOpen(false);
                  setCountrySearchTerm('');
                }}
              />
              
              {/* Dropdown Content */}
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-hidden">
                {/* Header */}
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">Select Country</h3>
                    <button
                      onClick={() => {
                        setIsCountryDropdownOpen(false);
                        setCountrySearchTerm('');
                      }}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-150"
                    >
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Search Input */}
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search countries..."
                    value={countrySearchTerm}
                    onChange={(e) => setCountrySearchTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Countries List */}
                <div className="max-h-48 overflow-y-auto mobile-scroll">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country, index) => (
                      <button
                        key={`${country.code}-${country.country}`}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-all duration-200 border-b border-gray-100 last:border-b-0 ${
                          selectedCountry.code === country.code 
                            ? 'bg-primary/10 text-primary border-primary/20' 
                            : 'text-gray-700'
                        }`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <span className="text-lg">{country.flag}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{country.name}</div>
                          <div className="text-xs text-gray-500">{country.code}</div>
                        </div>
                        {selectedCountry.code === country.code && (
                          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No countries found
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Phone Number Input */}
        <Input
          type="tel"
          value={value}
          onChange={(e) => handlePhoneChange(e.target.value)}
          className={`flex-1 h-12 px-4 text-base border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200 ${
            error ? 'border-red-500 focus:border-red-500' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
