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
import { CountryInput } from '@/components/ui/CountryInput';
import { CityInput } from '@/components/ui/CityInput';
import { ProvinceInput } from '@/components/ui/ProvinceInput';
import { DistrictInput } from '@/components/ui/DistrictInput';
import { DepartmentInput } from '@/components/ui/DepartmentInput';
import { PostalCodeInput } from '@/components/ui/PostalCodeInput';
import { toast } from 'sonner';
import { useBookingFlow } from '../hooks/useBookingFlow';
import { useCart, useShipping } from '@/store/appStore';
import { getDefaultPeruValues } from '@/lib/peru-shipping-data';

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
  // Peru-specific fields
  peruDepartment?: string;
  peruProvince?: string;
  peruDistrict?: string;
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
  const { goToNextStep, currentStep, canGoNext } = useBookingFlow();
  

  /**
   * CART STATE
   * ----------
   * Check if shipping is required for current cart
   */
  const { items: cartItems } = useCart();

  /**
   * SHIPPING STATE
   * --------------
   * Access to global shipping data storage
   */
  const { shippingData, setShippingData } = useShipping();

  /**
   * FORM STATE MANAGEMENT
   * ---------------------
   * Local state for shipping form data
   */
  // Get default Peru values
  const defaultValues = getDefaultPeruValues();
  
  const [formData, setFormData] = React.useState<ShippingFormData>({
    address: initialData?.address || shippingData?.address || '', // No default address
    city: initialData?.city || shippingData?.city || 'Lima Metropolitana',
    state: initialData?.state || shippingData?.state || '',
    postalCode: initialData?.postalCode || shippingData?.postalCode || defaultValues.postalCode,
    country: initialData?.country || shippingData?.country || 'PE', // Default to Peru
    peruDepartment: initialData?.peruDepartment || shippingData?.peruDepartment || defaultValues.department,
    peruProvince: initialData?.peruProvince || shippingData?.peruProvince || defaultValues.province,
    peruDistrict: initialData?.peruDistrict || shippingData?.peruDistrict || defaultValues.district
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

    // Check if all required fields have values (but don't show error messages)
    const hasAddress = formData.address.trim().length > 0;
    const hasCountry = formData.country.length > 0;
    
    // For Peru, check Peru-specific fields; for other countries, check main city field
    const hasCity = formData.country === 'PE' 
      ? formData.peruDepartment && formData.peruDepartment.length > 0 && formData.peruProvince && formData.peruProvince.length > 0 && formData.peruDistrict && formData.peruDistrict.length > 0
      : formData.city.trim().length > 0;

    // Address validation - only check minimum length if provided
    if (formData.address.trim() && formData.address.trim().length < 10) {
      newErrors.address = 'Please provide a complete address (at least 10 characters)';
    }

    // Form is valid only if all required fields have values and no format errors
    const isValid = hasAddress && hasCity && hasCountry && Object.keys(newErrors).length === 0;
    
    
    return { isValid: !!isValid, errors: newErrors };
  }, [formData]);

  /**
   * UPDATE FORM VALIDITY
   * --------------------
   * Updates the overall form validity state based on current validation
   * Form is valid only when all required fields have values
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
   * Use client-side only to prevent hydration mismatch
   */
  const [isShippingRequired, setIsShippingRequired] = React.useState<boolean | null>(null);

  // Check shipping requirement on client side only
  React.useEffect(() => {
    const required = cartItems.some(item => item.type === 'product');
    setIsShippingRequired(required);

    if (!required) {
      console.log('🚚 Shipping not required, auto-advancing to next step');
      // In a real implementation, you might want to delay this slightly
      // or show a message that shipping is being skipped
      setTimeout(() => {
        goToNextStep();
      }, 100);
    }
  }, [cartItems, goToNextStep]);

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

  /**
   * HANDLE FORM SUBMISSION
   * ----------------------
   * Validates and processes the shipping form data
   */
  const handleSubmit = () => {
    const { isValid, errors: validationErrors } = validateForm();

    if (!isValid) {
      // Show first validation error as toast (only for format issues, not required fields)
      const firstError = Object.values(validationErrors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    // Save data to global store
    setShippingData(formData);
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
          {label}
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

  // Show loading state while determining if shipping is required
  if (isShippingRequired === null) {
    return (
      <div className="max-w-2xl mx-auto h-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Shipping Address
          </h2>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Auto-skip if shipping is not required
  if (!isShippingRequired) {
    return (
      <div className="max-w-2xl mx-auto h-full space-y-6">
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
    <div className="max-w-2xl mx-auto h-full space-y-6">
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

        {/* Department Field - Only for Peru (First Field) */}
        {formData.country === 'PE' && (
          <DepartmentInput
            label="Department"
            required={true}
            value={formData.peruDepartment || defaultValues.department}
            onChange={(departmentCode) => setFormData(prev => ({ 
              ...prev, 
              peruDepartment: departmentCode,
              peruProvince: '', // Clear province when department changes
              city: '', // Clear city when department changes
              peruDistrict: '', // Clear district when department changes
              postalCode: '' // Clear postal code when department changes
            }))}
            placeholder="Select department"
            error={errors.peruDepartment}
            defaultDepartmentCode={defaultValues.department}
          />
        )}

        {/* Province Field - Only for Peru (Second Field) */}
        {formData.country === 'PE' && (
          <ProvinceInput
            label="Province"
            required={true}
            value={formData.peruProvince || defaultValues.province}
            onChange={(provinceCode) => setFormData(prev => ({ 
              ...prev, 
              peruProvince: provinceCode,
              city: '', // Clear city when province changes
              peruDistrict: '', // Clear district when province changes
              postalCode: '' // Clear postal code when province changes
            }))}
            placeholder="Select province"
            error={errors.peruProvince}
            defaultProvinceCode={defaultValues.province}
            departmentCode={formData.peruDepartment}
          />
        )}

        {/* City Field - Changes based on country */}
        {formData.country === 'PE' ? (
          <CityInput
            label="City"
            required={true}
            value={formData.city || 'Lima Metropolitana'}
            onChange={(cityCode) => setFormData(prev => ({ 
              ...prev, 
              city: cityCode,
              peruDistrict: '', // Clear district when city changes
              postalCode: '' // Clear postal code when city changes
            }))}
            placeholder="Select city"
            error={errors.city}
            defaultCityCode={defaultValues.city}
            departmentCode={formData.peruDepartment}
            provinceCode={formData.peruProvince}
          />
        ) : (
          renderFormField({
            name: 'city',
            label: 'City',
            type: 'text',
            required: true,
            placeholder: 'Enter your city'
          })
        )}

        {/* District Field - Only for Peru */}
        {formData.country === 'PE' && (
          <DistrictInput
            label="District"
            required={true}
            value={formData.peruDistrict || defaultValues.district}
            onChange={(districtCode, postalCode) => {
              setFormData(prev => ({ 
                ...prev, 
                peruDistrict: districtCode,
                postalCode: postalCode || '' // Clear postal code when district changes
              }));
            }}
            placeholder="Select district"
            error={errors.peruDistrict}
            defaultDistrictCode={defaultValues.district}
            departmentCode={formData.peruDepartment}
            provinceCode={formData.peruProvince}
          />
        )}

        {/* State Field - Only for non-Peru countries */}
        {formData.country !== 'PE' && (
          renderFormField({
            name: 'state',
            label: 'State',
            type: 'text',
            required: false,
            placeholder: 'Enter your state (optional)'
          })
        )}

        {/* Postal Code Field - Left Column */}
        {formData.country === 'PE' ? (
          <PostalCodeInput
            label="Postal Code"
            required={true}
            value={formData.postalCode || defaultValues.postalCode}
            onChange={(postalCode) => setFormData(prev => ({ ...prev, postalCode }))}
            placeholder="Select postal code"
            error={errors.postalCode}
            defaultPostalCode={defaultValues.postalCode}
            departmentCode={formData.peruDepartment}
            provinceCode={formData.peruProvince}
            districtCode={formData.peruDistrict}
          />
        ) : (
          renderFormField({
            name: 'postalCode',
            label: 'Postal Code',
            type: 'text',
            required: false,
            placeholder: 'Enter your postal code (optional)'
          })
        )}

        {/* Country Field - Right Column */}
        <CountryInput
          label="Country"
          required={true}
          value={formData.country}
          onChange={(countryCode) => setFormData(prev => ({ 
            ...prev, 
            country: countryCode,
            // Clear Peru-specific fields when country changes
            peruDepartment: countryCode === 'PE' ? prev.peruDepartment : '',
            peruProvince: countryCode === 'PE' ? prev.peruProvince : '',
            city: countryCode === 'PE' ? prev.city : '',
            peruDistrict: countryCode === 'PE' ? prev.peruDistrict : '',
            postalCode: countryCode === 'PE' ? prev.postalCode : ''
          }))}
          placeholder="Select your country"
          error={errors.country}
          defaultCountryCode="PE"
        />
      </div>


      {/* Form Actions */}
      <div className="pt-4">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`w-full px-6 py-3 rounded-md font-medium transition-all duration-200 ${
            isFormValid
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-md'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Payment
        </button>
      </div>

    </div>
  );
}
