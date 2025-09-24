/**
 * ========================================================================================
 * SHIPPING STEP COMPONENT
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * Collects shipping address information for physical products that require delivery.
 * This component replaces the shipping section from MasterBookingFlow.tsx.
 *
 * CONDITIONAL RENDERING:
 * - Only shown when cart contains physical products requiring shipping
 * - Automatically skipped if no shipping is needed
 *
 * RESPONSIBILITIES:
 * - Collect and validate shipping address details
 * - Provide form fields for complete address information
 * - Handle country selection with predefined options
 * - Integrate with cart state to determine if shipping is required
 *
 * VALIDATION RULES:
 * - Address: Required, minimum 10 characters
 * - City: Required
 * - State: Optional
 * - Postal Code: Optional
 * - Country: Required (defaults to Peru)
 * 
 * NOTE: First Name and Last Name are not collected here as they are
 * already collected in the customer information step.
 *
 * INTEGRATIONS:
 * - useCart hook to check if shipping is required
 * - useBookingFlow hook for navigation
 * - Form validation with enhanced rules
 */

'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useBookingFlow } from '../hooks/useBookingFlow';
import { useCart } from '@/store/appStore';

/**
 * SHIPPING FORM DATA INTERFACE
 * ----------------------------
 * Defines the structure of shipping address information collected
 */
interface ShippingFormData {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * SHIPPING STEP PROPS
 * --------------------
 * Props passed to the ShippingStep component
 */
interface ShippingStepProps {
  /** Optional initial data to pre-populate the form */
  initialData?: Partial<ShippingFormData>;
  /** Callback when form data is successfully validated and saved */
  onDataSaved?: (data: ShippingFormData) => void;
}

/**
 * SHIPPING STEP COMPONENT
 * -----------------------
 * Handles shipping address collection and validation
 *
 * @param props - Component props
 * @returns React component
 */
export function ShippingStep({ initialData, onDataSaved }: ShippingStepProps) {
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
   * CART STATE
   * ----------
   * Check if shipping is required for current cart
   */
  const { requiresAddress } = useCart();

  /**
   * FORM STATE MANAGEMENT
   * ---------------------
   * Local state for shipping form data
   */
  const [formData, setFormData] = React.useState<ShippingFormData>({
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    postalCode: initialData?.postalCode || '',
    country: initialData?.country || 'PE' // Default to Peru
  });

  /**
   * VALIDATION STATE
   * ----------------
   * Tracks validation errors for each field
   */
  const [errors, setErrors] = React.useState<Partial<ShippingFormData>>({});

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
   * Comprehensive validation for shipping address fields
   *
   * @returns Object containing validation results and errors
   */
  const validateForm = React.useCallback((): { isValid: boolean; errors: Partial<ShippingFormData> } => {
    const newErrors: Partial<ShippingFormData> = {};


    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please provide a complete address (at least 10 characters)';
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    // Country validation
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    // Optional field validations (state and postal code can be empty)
    // Add any specific validation rules here if needed

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
  // CONDITIONAL RENDERING CHECK
  // ============================================================================

  /**
   * CHECK IF SHIPPING IS REQUIRED
   * -----------------------------
   * Determines if this step should be shown based on cart contents
   */
  const isShippingRequired = requiresAddress();

  // If shipping is not required, auto-advance to next step
  React.useEffect(() => {
    if (!isShippingRequired) {
      console.log('🚚 Shipping not required, auto-advancing to next step');
      // In a real implementation, you might want to delay this slightly
      // or show a message that shipping is being skipped
      setTimeout(() => {
        goToNextStep();
      }, 100);
    }
  }, [isShippingRequired, goToNextStep]);

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
  const handleInputChange = (field: keyof ShippingFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * HANDLE COUNTRY SELECTION
   * ------------------------
   * Updates country field when selection changes
   *
   * @param value - The selected country value
   */
  const handleCountryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      country: value
    }));
  };

  /**
   * HANDLE FORM SUBMISSION
   * ----------------------
   * Validates and processes the shipping form data
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

    console.log('✅ Shipping information validated and saved:', formData);

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
    name: keyof ShippingFormData;
    label: string;
    type: string;
    required?: boolean;
    placeholder?: string;
    fullWidth?: boolean;
  }) => {
    const { name, label, type, required, placeholder, fullWidth } = field;
    const hasError = !!errors[name];
    const errorMessage = errors[name];

    return (
      <div className={`unified-form-group ${fullWidth ? 'md:col-span-2' : ''}`}>
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

  /**
   * RENDER COUNTRY SELECT
   * ---------------------
   * Renders the country selection dropdown
   *
   * @returns Country select JSX
   */
  const renderCountrySelect = () => {
    const hasError = !!errors.country;
    const errorMessage = errors.country;

    return (
      <div className="unified-form-group">
        <Label htmlFor="country" className="unified-form-label">
          Country *
        </Label>
        <Select value={formData.country} onValueChange={handleCountryChange}>
          <SelectTrigger className={`unified-form-input ${hasError ? 'border-red-500 focus:border-red-500' : ''}`}>
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PE">Peru</SelectItem>
            <SelectItem value="US">United States</SelectItem>
            <SelectItem value="CA">Canada</SelectItem>
          </SelectContent>
        </Select>
        {hasError && (
          <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
        )}
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  // Auto-skip if shipping is not required
  if (!isShippingRequired) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Shipping Address
          </h2>
          <p className="text-gray-600">
            No shipping required for your order
          </p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Continuing to payment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Shipping Address
        </h2>
        <p className="text-gray-600">
          Provide shipping address details for your physical products
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Address Field */}
        {renderFormField({
          name: 'address',
          label: 'Address',
          type: 'text',
          required: true,
          placeholder: 'Enter your complete address',
          fullWidth: true
        })}

        {/* City Field */}
        {renderFormField({
          name: 'city',
          label: 'City',
          type: 'text',
          required: true,
          placeholder: 'Enter your city'
        })}

        {/* State Field */}
        {renderFormField({
          name: 'state',
          label: 'State',
          type: 'text',
          required: false,
          placeholder: 'Enter your state (optional)'
        })}

        {/* Postal Code Field */}
        {renderFormField({
          name: 'postalCode',
          label: 'Postal Code',
          type: 'text',
          required: false,
          placeholder: 'Enter your postal code (optional)'
        })}

        {/* Country Select */}
        {renderCountrySelect()}
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
          Continue to Payment
        </button>
      </div>

      {/* Debug Information (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-8 p-4 bg-gray-50 rounded-lg">
          <summary className="cursor-pointer font-medium text-gray-700">
            Debug Information
          </summary>
          <pre className="mt-2 text-xs text-gray-600 overflow-auto">
            {JSON.stringify({ formData, errors, isFormValid, isShippingRequired }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
