/**
 * ========================================================================================
 * PHONE INPUT WITH LOOKUP COMPONENT
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * An enhanced phone input component that automatically looks up customer information
 * when a phone number is entered and fills in other form fields.
 *
 * FEATURES:
 * - Country code dropdown with flags
 * - Automatic customer lookup by phone number
 * - Auto-fill customer information
 * - Loading states and error handling
 * - Mobile-optimized touch targets
 * - Search functionality for countries
 * - Responsive design
 * - Form validation support
 * - Accessibility features
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { countries, Country } from '@/lib/countries';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhoneLookup, CustomerData } from '@/hooks/usePhoneLookup';
import { maskEmailForDisplay } from '@/lib/utils/email-mask';
import { toast } from 'sonner';

/**
 * PHONE INPUT WITH LOOKUP PROPS
 * -----------------------------
 * Props passed to the PhoneInputWithLookup component
 */
interface PhoneInputWithLookupProps {
  /** Label for the phone input field */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Current phone number value */
  value: string;
  /** Callback when phone number changes */
  onChange: (phoneNumber: string, countryCode: string) => void;
  /** Callback when customer data is found and should be filled */
  onCustomerFound?: (customerData: CustomerData) => void;
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
  /** Whether to show lookup button or auto-lookup */
  autoLookup?: boolean;
  /** Debounce delay for auto-lookup in milliseconds */
  lookupDelay?: number;
}

/**
 * PHONE INPUT WITH LOOKUP COMPONENT
 * ---------------------------------
 * Renders a phone input with country code dropdown and customer lookup functionality
 *
 * @param props - Component props
 * @returns React component
 */
export function PhoneInputWithLookup({
  label = 'Phone Number',
  required = false,
  value,
  onChange,
  onCustomerFound,
  placeholder = 'Enter phone number',
  disabled = false,
  error,
  className = '',
  defaultCountryCode = '+51', // Default to Peru
  autoLookup = true,
  lookupDelay = 1000 // 1 second delay
}: PhoneInputWithLookupProps) {
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
   * LOOKUP STATE
   * ------------
   * Manages customer lookup functionality
   */
  const [hasLookedUp, setHasLookedUp] = useState(false);
  const [lastLookupValue, setLastLookupValue] = useState('');

  /**
   * REFS
   * -----
   * For handling click outside, focus management, and debouncing
   */
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const lookupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * HOOKS
   * -----
   * Custom hook for phone lookup functionality
   */
  const { lookupByPhone, isLoading: isLookupLoading, error: lookupError } = usePhoneLookup();

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

  /**
   * AUTO LOOKUP EFFECT
   * ------------------
   * Automatically looks up customer when phone number changes
   */
  useEffect(() => {
    if (!autoLookup || !value.trim() || value === lastLookupValue) {
      return;
    }

    // Clear existing timeout
    if (lookupTimeoutRef.current) {
      clearTimeout(lookupTimeoutRef.current);
    }

    // Set new timeout for debounced lookup
    lookupTimeoutRef.current = setTimeout(async () => {
      await performLookup(value, selectedCountry.code);
    }, lookupDelay);

    // Cleanup timeout on unmount
    return () => {
      if (lookupTimeoutRef.current) {
        clearTimeout(lookupTimeoutRef.current);
      }
    };
  }, [value, selectedCountry.code, autoLookup, lookupDelay, lastLookupValue]);

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
   * VALIDATE PHONE NUMBER
   * ---------------------
   * Validates phone number format based on country
   */
  const validatePhoneNumber = useCallback((phoneNumber: string, countryCode: string): boolean => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Peru mobile validation: must be 9 digits starting with 9
    if (countryCode === '+51' || countryCode === 'PE') {
      return /^9\d{8}$/.test(cleanPhone);
    }
    
    // General validation for other countries
    return cleanPhone.length >= 7 && cleanPhone.length <= 15;
  }, []);

  /**
   * PERFORM LOOKUP
   * --------------
   * Performs customer lookup by phone number
   */
  const performLookup = useCallback(async (phoneNumber: string, countryCode: string) => {
    if (!phoneNumber.trim()) {
      return;
    }

    // Validate phone number format before lookup
    if (!validatePhoneNumber(phoneNumber, countryCode)) {
      if (countryCode === '+51' || countryCode === 'PE') {
        toast.error('Peru mobile numbers must be 9 digits starting with 9 (e.g., 912345678)');
      } else {
        toast.error('Please enter a valid phone number');
      }
      return;
    }

    try {
      const result = await lookupByPhone(phoneNumber, countryCode);
      
      if (result.success && result.found && result.data) {
        setLastLookupValue(phoneNumber);
        setHasLookedUp(true);
        
        // Notify parent component with customer data
        onCustomerFound?.(result.data);
        
        // Show success toast
        toast.success(`Existing customer found: ${result.data.fullName || (result.data.emailMasked || maskEmailForDisplay(result.data.email))}`);
      } else if (result.success && !result.found) {
        setLastLookupValue(phoneNumber);
        setHasLookedUp(true);
        
        // Show info toast for new customer
        toast.info('New customer - please fill in the details');
      }
    } catch (error) {
      console.error('Lookup error:', error);
      toast.error('Failed to lookup customer information');
    }
  }, [lookupByPhone, onCustomerFound]);

  /**
   * HANDLE MANUAL LOOKUP
   * --------------------
   * Triggers manual lookup when button is clicked
   */
  const handleManualLookup = async () => {
    if (!value.trim()) {
      toast.error('Please enter a phone number first');
      return;
    }

    // Validate phone number format before lookup
    if (!validatePhoneNumber(value, selectedCountry.code)) {
      if (selectedCountry.code === '+51' || selectedCountry.code === 'PE') {
        toast.error('Peru mobile numbers must be 9 digits starting with 9 (e.g., 912345678)');
      } else {
        toast.error('Please enter a valid phone number');
      }
      return;
    }
    
    await performLookup(value, selectedCountry.code);
  };

  /**
   * HANDLE COUNTRY SELECTION
   * ------------------------
   * Updates selected country and closes dropdown
   */
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsCountryDropdownOpen(false);
    setCountrySearchTerm('');
    
    // Reset lookup state when country changes
    setHasLookedUp(false);
    setLastLookupValue('');
    
    // Notify parent component of the change
    onChange(value, country.code);
  };

  /**
   * HANDLE PHONE NUMBER CHANGE
   * --------------------------
   * Updates phone number and notifies parent
   */
  const handlePhoneChange = (phoneNumber: string) => {
    // Reset lookup state when phone number changes
    if (phoneNumber !== lastLookupValue) {
      setHasLookedUp(false);
    }
    
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

          {/* Right Sidebar Menu - Same pattern as CartSidebar */}
          <AnimatePresence>
            {isCountryDropdownOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black bg-opacity-50 z-50"
                  onClick={() => {
                    setIsCountryDropdownOpen(false);
                    setCountrySearchTerm('');
                  }}
                />
                
                {/* Sidebar */}
                <motion.div
                  initial={{ x: '100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: '100%', opacity: 0 }}
                  transition={{ 
                    type: 'spring', 
                    damping: 25, 
                    stiffness: 200,
                    duration: 0.3 
                  }}
                  className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50"
                >
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                      <h3 className="text-lg font-semibold text-gray-900">Select Country</h3>
                      <button
                        onClick={() => {
                          setIsCountryDropdownOpen(false);
                          setCountrySearchTerm('');
                        }}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-150"
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Search Form */}
                    <div className="p-4 border-b border-gray-200 bg-white">
                      <div className="relative">
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search countries..."
                          value={countrySearchTerm}
                          onChange={(e) => setCountrySearchTerm(e.target.value)}
                          className="w-full px-4 py-3 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>

                    {/* Countries List */}
                    <div className="flex-1 overflow-y-auto mobile-scroll">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country, index) => (
                          <motion.button
                            key={`${country.code}-${country.country}`}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`w-full px-4 py-4 text-left hover:bg-gray-50 flex items-center space-x-4 transition-all duration-200 border-b border-gray-100 ${
                              selectedCountry.code === country.code 
                                ? 'bg-primary/10 text-primary border-primary/20' 
                                : 'text-gray-700'
                            }`}
                          >
                            <span className="text-2xl">{country.flag}</span>
                            <div className="flex-1">
                              <div className="text-base font-medium">{country.name}</div>
                              <div className="text-sm text-gray-500">{country.code}</div>
                            </div>
                            {selectedCountry.code === country.code && (
                              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </motion.button>
                        ))
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="px-4 py-8 text-sm text-gray-500 text-center"
                        >
                          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          No countries found
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Phone Number Input */}
        <div className="flex-1 relative">
          <Input
            type="tel"
            value={value}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className={`h-12 px-4 text-base border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200 ${
              error ? 'border-red-500 focus:border-red-500' : ''
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
          />
          
          {/* Loading indicator */}
          {isLookupLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
            </div>
          )}
          
          {/* Lookup success indicator */}
          {hasLookedUp && !isLookupLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Manual Lookup Button (when auto-lookup is disabled) */}
        {!autoLookup && (
          <button
            type="button"
            onClick={handleManualLookup}
            disabled={disabled || !value.trim() || isLookupLoading}
            className="h-12 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {isLookupLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}
      
      {/* Lookup Error Message */}
      {lookupError && (
        <p className="text-orange-600 text-sm mt-1">{lookupError}</p>
      )}
    </div>
  );
}
