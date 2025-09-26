/**
 * ========================================================================================
 * CUSTOMER INFO STEP COMPONENT
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * Collects customer information required for booking and checkout.
 * This component replaces the customer section from MasterBookingFlow.tsx.
 *
 * RESPONSIBILITIES:
 * - Collect and validate customer details
 * - Provide form fields for name, email, and phone
 * - Handle form validation with enhanced rules
 * - Persist data for use in checkout
 *
 * VALIDATION RULES:
 * - Name: Required, non-empty
 * - Email: Required, valid email format
 * - Phone: Optional, valid format if provided
 *
 * INTEGRATIONS:
 * - useBookingFlow hook for navigation
 * - Form validation logic
 * - Data persistence for checkout
 */

'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInputWithLookup } from '@/components/ui/PhoneInputWithLookup';
import { CustomerData } from '@/hooks/usePhoneLookup';
import { maskEmailForDisplay } from '@/lib/utils/email-mask';
import { toast } from 'sonner';
import { useBookingFlow } from '../hooks/useBookingFlow';
import { useAppStore } from '@/store/appStore';

/**
 * CUSTOMER FORM DATA INTERFACE
 * ----------------------------
 * Defines the structure of customer information collected
 */
interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
}

/**
 * CUSTOMER INFO STEP PROPS
 * -------------------------
 * Props passed to the CustomerInfoStep component
 */
interface CustomerInfoStepProps {
  /** Optional initial data to pre-populate the form */
  initialData?: Partial<CustomerFormData>;
  /** Callback when form data is successfully validated and saved */
  onDataSaved?: (data: CustomerFormData) => void;
}

/**
 * CUSTOMER INFO STEP COMPONENT
 * ----------------------------
 * Handles customer information collection and validation
 *
 * @param props - Component props
 * @returns React component
 */
export function CustomerInfoStep({ initialData, onDataSaved }: CustomerInfoStepProps) {
  // ============================================================================
  // HOOKS AND STATE MANAGEMENT
  // ============================================================================

  /**
   * BOOKING FLOW STATE
   * ------------------
   * Access to flow navigation functions
   */
  const { goToNextStep } = useBookingFlow();

  /**
   * CUSTOMER DATA STATE
   * -------------------
   * Access to stored customer data from previous steps
   */
  const { customerData, setCustomerData } = useAppStore();

  /**
   * FORM STATE MANAGEMENT
   * ---------------------
   * Local state for form data - prioritizes stored data, then initial data, then defaults
   */
  const [formData, setFormData] = React.useState<CustomerFormData>({
    name: customerData?.name || initialData?.name || '',
    email: customerData?.email || initialData?.email || '',
    phone: customerData?.phone || initialData?.phone || '',
    countryCode: customerData?.countryCode || initialData?.countryCode || '+51'
  });

  /**
   * VALIDATION STATE
   * ----------------
   * Tracks validation errors for each field
   */
  const [errors, setErrors] = React.useState<Partial<CustomerFormData>>({});

  /**
   * FORM VALIDATION STATE
   * ---------------------
   * Tracks overall form validity
   */
  const [isFormValid, setIsFormValid] = React.useState(false);

  /**
   * CUSTOMER LOOKUP STATE
   * ---------------------
   * Tracks when an existing customer is found via phone lookup
   */
  const [existingCustomer, setExistingCustomer] = React.useState<CustomerData | null>(null);
  const [isExistingCustomer, setIsExistingCustomer] = React.useState(false);

  // ============================================================================
  // VALIDATION LOGIC
  // ============================================================================

  /**
   * VALIDATE FORM DATA
   * ------------------
   * Comprehensive validation for all form fields
   *
   * @returns Object containing validation results and errors
   */
  const validateForm = React.useCallback((): { isValid: boolean; errors: Partial<CustomerFormData> } => {
    const newErrors: Partial<CustomerFormData> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Phone validation (optional but if provided, validate based on country)
    if (formData.phone && formData.phone.trim()) {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      
      // Peru mobile validation: must be 9 digits starting with 9
      if (formData.countryCode === '+51' || formData.countryCode === 'PE') {
        if (!/^9\d{8}$/.test(cleanPhone)) {
          newErrors.phone = 'Peru mobile numbers must be 9 digits starting with 9 (e.g., 912345678)';
        }
      } else {
        // General validation for other countries
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,}$/;
        if (!phoneRegex.test(formData.phone)) {
          newErrors.phone = 'Please enter a valid phone number';
        }
      }
    }

    const isValid = Object.keys(newErrors).length === 0;
    return { isValid, errors: newErrors };
  }, [formData]);

  /**
   * UPDATE FORM VALIDITY
   * --------------------
   * Updates the overall form validity state based on current validation
   */
  React.useEffect(() => {
    const { isValid, errors: validationErrors } = validateForm();
    setIsFormValid(isValid);
    setErrors(validationErrors);
  }, [validateForm]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * HANDLE INPUT CHANGE
   * -------------------
   * Updates form data when input values change
   *
   * @param field - The field name to update
   * @param value - The new value
   */
  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * HANDLE PHONE CHANGE
   * -------------------
   * Updates phone number and country code
   *
   * @param phoneNumber - The phone number
   * @param countryCode - The country code
   */
  const handlePhoneChange = (phoneNumber: string, countryCode: string) => {
    setFormData(prev => ({
      ...prev,
      phone: phoneNumber,
      countryCode: countryCode
    }));

    // Reset existing customer state when phone number changes significantly
    if (isExistingCustomer && phoneNumber !== existingCustomer?.phone?.replace(/\D/g, '')) {
      setIsExistingCustomer(false);
      setExistingCustomer(null);
    }
  };

  /**
   * HANDLE RESET CUSTOMER
   * ---------------------
   * Allows user to reset and enter new customer information
   */
  const handleResetCustomer = () => {
    setIsExistingCustomer(false);
    setExistingCustomer(null);
    setFormData(prev => ({
      ...prev,
      name: '',
      email: ''
    }));
    toast.info('Customer information reset. You can now enter new details.');
  };

  /**
   * HANDLE CUSTOMER FOUND
   * ---------------------
   * Auto-fills form fields when customer data is found via phone lookup
   *
   * @param customerData - The customer data found in the database
   */
  const handleCustomerFound = (customerData: CustomerData) => {
    // Set existing customer state
    setExistingCustomer(customerData);
    setIsExistingCustomer(true);

    setFormData(prev => ({
      ...prev,
      name: customerData.fullName || customerData.customerProfile?.firstName + ' ' + customerData.customerProfile?.lastName || prev.name,
      email: customerData.email || prev.email,
      // Keep the phone number as entered by user
      phone: prev.phone,
      countryCode: prev.countryCode
    }));

    // Show success message
    toast.success(`Existing customer found: ${customerData.fullName || (customerData.emailMasked || maskEmailForDisplay(customerData.email))}`);
  };

  /**
   * HANDLE FORM SUBMISSION
   * ----------------------
   * Validates and processes the form data
   */
  const handleSubmit = () => {
    const { isValid, errors: validationErrors } = validateForm();

    if (!isValid) {
      // Show first validation error as toast
      const firstError = Object.values(validationErrors)[0];
      toast.error(firstError);
      return;
    }

    // Save data to store for persistence across steps
    setCustomerData(formData);
    
    // Call optional callback
    onDataSaved?.(formData);

    console.log('✅ Customer information validated and saved:', formData);

    // Navigate to next step
    console.log('🔄 Attempting to navigate to next step...');
    goToNextStep();
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  /**
   * RENDER FORM FIELD
   * -----------------
   * Renders a form field with label, input, and error message
   *
   * @param field - Field configuration
   * @returns Form field JSX
   */
  const renderFormField = (field: {
    name: keyof CustomerFormData;
    label: string;
    type: string;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
  }) => {
    const { name, label, type, required, placeholder, disabled = false } = field;
    const hasError = !!errors[name];
    const errorMessage = errors[name];
    
    // Disable name and email fields for existing customers
    const isFieldDisabled = disabled || (isExistingCustomer && (name === 'name' || name === 'email'));

    return (
      <div className="unified-form-group">
        <Label htmlFor={name} className="unified-form-label">
          {label} {required && '*'}
          {isExistingCustomer && (name === 'name' || name === 'email') && (
            <span className="ml-2 text-xs text-blue-600 font-medium">(Existing Customer)</span>
          )}
        </Label>
        <Input
          id={name}
          type={type}
          value={formData[name]}
          onChange={(e) => handleInputChange(name, e.target.value)}
          className={`unified-form-input ${hasError ? 'border-red-500 focus:border-red-500' : ''} ${
            isFieldDisabled ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : ''
          }`}
          required={required}
          placeholder={placeholder}
          disabled={isFieldDisabled}
        />
        {hasError && (
          <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
        )}
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Customer Information
        </h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {isExistingCustomer ? 'Existing customer information' : 'Provide your details'}
        </p>
        
        {/* Existing Customer Indicator */}
        {isExistingCustomer && existingCustomer && (
          <div className="mt-4 p-3 rounded-lg" style={{ background: 'color-mix(in srgb, var(--color-status-success) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--color-status-success) 25%, transparent)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--color-status-success)' }}>
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              <span className="font-medium" style={{ color: 'color-mix(in srgb, var(--color-status-success) 80%, black)' }}>
                Existing Customer: {existingCustomer.fullName || (existingCustomer.emailMasked || maskEmailForDisplay(existingCustomer.email))}
              </span>
              </div>
              <button
                onClick={handleResetCustomer}
                className="text-xs underline"
                style={{ color: 'var(--color-status-success)' }}
                type="button"
              >
                Use different info
              </button>
            </div>
            <p className="text-sm mt-1" style={{ color: 'color-mix(in srgb, var(--color-status-success) 70%, black)' }}>
              Name and email are locked. You can only modify other details.
            </p>
          </div>
        )}
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Phone Field with Lookup */}
        <div className="unified-form-group">
          <PhoneInputWithLookup
            label="Phone Number"
            required={false}
            value={formData.phone}
            onChange={handlePhoneChange}
            onCustomerFound={handleCustomerFound}
            placeholder="Enter your phone number"
            defaultCountryCode={formData.countryCode}
            error={errors.phone}
            autoLookup={true}
            lookupDelay={1500}
          />
        </div>

        {/* Name Field */}
        {renderFormField({
          name: 'name',
          label: 'Full Name',
          type: 'text',
          required: true,
          placeholder: 'Enter your full name'
        })}

        {/* Email Field */}
        {renderFormField({
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          placeholder: 'Enter your email address'
        })}

        {/* Continue Button */}
        <div className="pt-4 pb-8">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`w-full px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              isFormValid
                ? 'text-[var(--primary-foreground)] shadow-md'
                : 'cursor-not-allowed'
            }`}
            style={{ backgroundColor: isFormValid ? 'var(--color-primary-500)' : 'var(--color-border-500)', color: isFormValid ? 'var(--primary-foreground)' : 'var(--color-text-tertiary)' }}
          >
            Continue to Next Step
          </button>
        </div>
      </div>

    </div>
  );
}
