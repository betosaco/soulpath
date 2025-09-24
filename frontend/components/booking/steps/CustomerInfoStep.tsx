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
 * - Provide form fields for name, email, phone, birth date, and birth place
 * - Handle form validation with enhanced rules
 * - Persist data for use in checkout
 *
 * VALIDATION RULES:
 * - Name: Required, non-empty
 * - Email: Required, valid email format
 * - Phone: Optional
 * - Birth Date: Required, must be in the past, user must be 13+ years old
 * - Birth Place: Required, non-empty
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
import { toast } from 'sonner';
import { useBookingFlow } from '../hooks/useBookingFlow';

/**
 * CUSTOMER FORM DATA INTERFACE
 * ----------------------------
 * Defines the structure of customer information collected
 */
interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  birthPlace: string;
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
   * FORM STATE MANAGEMENT
   * ---------------------
   * Local state for form data - in a real app, this might be persisted
   * in a store or sent to an API
   */
  const [formData, setFormData] = React.useState<CustomerFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    birthDate: initialData?.birthDate || '',
    birthPlace: initialData?.birthPlace || ''
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

    // Phone validation (optional but if provided, basic format check)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    // Birth date validation
    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();

      if (birthDate >= today) {
        newErrors.birthDate = 'Birth date must be in the past';
      } else {
        // Age validation - must be at least 13 years old
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          if (age - 1 < 13) {
            newErrors.birthDate = 'You must be at least 13 years old to make a purchase';
          }
        } else {
          if (age < 13) {
            newErrors.birthDate = 'You must be at least 13 years old to make a purchase';
          }
        }
      }
    }

    // Birth place validation
    if (!formData.birthPlace.trim()) {
      newErrors.birthPlace = 'Birth place is required';
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

    // Save data (in a real app, this might save to a store or API)
    onDataSaved?.(formData);

    console.log('✅ Customer information validated and saved:', formData);

    // Navigate to next step
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
  }) => {
    const { name, label, type, required, placeholder } = field;
    const hasError = !!errors[name];
    const errorMessage = errors[name];

    return (
      <div className="unified-form-group">
        <Label htmlFor={name} className="unified-form-label">
          {label} {required && '*'}
        </Label>
        <Input
          id={name}
          type={type}
          value={formData[name]}
          onChange={(e) => handleInputChange(name, e.target.value)}
          className={`unified-form-input ${hasError ? 'border-red-500 focus:border-red-500' : ''}`}
          required={required}
          placeholder={placeholder}
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Customer Information
        </h2>
        <p className="text-gray-600">
          Provide your details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Phone Field */}
        {renderFormField({
          name: 'phone',
          label: 'Phone',
          type: 'tel',
          required: false,
          placeholder: 'Enter your phone number'
        })}

        {/* Birth Date Field */}
        {renderFormField({
          name: 'birthDate',
          label: 'Birth Date',
          type: 'date',
          required: true
        })}

        {/* Birth Place Field */}
        {renderFormField({
          name: 'birthPlace',
          label: 'Birth Place',
          type: 'text',
          required: true,
          placeholder: 'Enter your birth place'
        })}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
            isFormValid
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-md'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Next Step
        </button>
      </div>

      {/* Debug Information (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-8 p-4 bg-gray-50 rounded-lg">
          <summary className="cursor-pointer font-medium text-gray-700">
            Debug Information
          </summary>
          <pre className="mt-2 text-xs text-gray-600 overflow-auto">
            {JSON.stringify({ formData, errors, isFormValid }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
