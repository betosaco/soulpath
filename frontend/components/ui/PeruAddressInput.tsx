/**
 * ========================================================================================
 * PERU ADDRESS INPUT COMPONENT
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * A comprehensive address input component specifically for Peru addresses.
 * Shows department, province, and district fields with cascading selection.
 *
 * FEATURES:
 * - Department selection (Regions)
 * - Province selection (Cities within departments)
 * - District selection (Districts within provinces)
 * - Automatic postal code population
 * - Cascading dropdown behavior
 * - Default to Lima, Lima Metropolitana, Miraflores
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  peruAddresses, 
  getPeruProvinces, 
  getPeruDistricts, 
  getDefaultPeruAddress,
  _PeruDepartment,
  PeruProvince,
  PeruDistrict
} from '@/lib/peru-addresses';

/**
 * PERU ADDRESS DATA INTERFACE
 * ---------------------------
 * Structure for Peru address data
 */
interface PeruAddressData {
  department: string;
  province: string;
  district: string;
  postalCode: string;
}

/**
 * PERU ADDRESS INPUT PROPS
 * ------------------------
 * Props passed to the PeruAddressInput component
 */
interface PeruAddressInputProps {
  /** Current address data */
  value: PeruAddressData;
  /** Callback when address changes */
  onChange: (address: PeruAddressData) => void;
  /** Whether the fields are disabled */
  disabled?: boolean;
  /** Error messages for each field */
  errors?: {
    department?: string;
    province?: string;
    district?: string;
    postalCode?: string;
  };
}

/**
 * PERU ADDRESS INPUT COMPONENT
 * ----------------------------
 * Renders Peru-specific address fields with cascading selection
 *
 * @param props - Component props
 * @returns React component
 */
export function PeruAddressInput({
  value,
  onChange,
  disabled = false,
  errors = {}
}: PeruAddressInputProps) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [availableProvinces, setAvailableProvinces] = useState<PeruProvince[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<PeruDistrict[]>([]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * INITIALIZE DEFAULT VALUES
   * -------------------------
   * Set default values if not provided
   */
  useEffect(() => {
    if (!value.department) {
      const defaultAddress = getDefaultPeruAddress();
      onChange({
        department: defaultAddress.department,
        province: defaultAddress.province,
        district: defaultAddress.district,
        postalCode: defaultAddress.postalCode
      });
    }
  }, [value.department, onChange]);

  /**
   * UPDATE AVAILABLE PROVINCES
   * ---------------------------
   * Update provinces when department changes
   */
  useEffect(() => {
    if (value.department) {
      const provinces = getPeruProvinces(value.department);
      setAvailableProvinces(provinces);
      
      // Reset province and district if current selection is not available
      if (provinces.length > 0 && !provinces.find(p => p.code === value.province)) {
        const newProvince = provinces[0];
        const districts = getPeruDistricts(value.department, newProvince.code);
        const newDistrict = districts[0];
        
        onChange({
          department: value.department,
          province: newProvince.code,
          district: newDistrict.code,
          postalCode: newDistrict.postalCode || ''
        });
      }
    }
  }, [value.department, onChange]);

  /**
   * UPDATE AVAILABLE DISTRICTS
   * ---------------------------
   * Update districts when province changes
   */
  useEffect(() => {
    if (value.department && value.province) {
      const districts = getPeruDistricts(value.department, value.province);
      setAvailableDistricts(districts);
      
      // Reset district if current selection is not available
      if (districts.length > 0 && !districts.find(d => d.code === value.district)) {
        const newDistrict = districts[0];
        onChange({
          ...value,
          district: newDistrict.code,
          postalCode: newDistrict.postalCode || ''
        });
      }
    }
  }, [value.department, value.province, onChange]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * HANDLE DEPARTMENT CHANGE
   * ------------------------
   * Updates department and resets dependent fields
   */
  const handleDepartmentChange = (departmentCode: string) => {
    const provinces = getPeruProvinces(departmentCode);
    const firstProvince = provinces[0];
    const districts = firstProvince ? getPeruDistricts(departmentCode, firstProvince.code) : [];
    const firstDistrict = districts[0];

    onChange({
      department: departmentCode,
      province: firstProvince?.code || '',
      district: firstDistrict?.code || '',
      postalCode: firstDistrict?.postalCode || ''
    });
  };

  /**
   * HANDLE PROVINCE CHANGE
   * ----------------------
   * Updates province and resets district
   */
  const handleProvinceChange = (provinceCode: string) => {
    const districts = getPeruDistricts(value.department, provinceCode);
    const firstDistrict = districts[0];

    onChange({
      ...value,
      province: provinceCode,
      district: firstDistrict?.code || '',
      postalCode: firstDistrict?.postalCode || ''
    });
  };

  /**
   * HANDLE DISTRICT CHANGE
   * ----------------------
   * Updates district and postal code
   */
  const handleDistrictChange = (districtCode: string) => {
    const district = availableDistricts.find(d => d.code === districtCode);
    
    onChange({
      ...value,
      district: districtCode,
      postalCode: district?.postalCode || ''
    });
  };

  /**
   * HANDLE POSTAL CODE CHANGE
   * -------------------------
   * Updates postal code manually
   */
  const handlePostalCodeChange = (postalCode: string) => {
    onChange({
      ...value,
      postalCode
    });
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-4">
      {/* Department Field */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Department <span className="text-red-500">*</span>
        </Label>
        <Select
          value={value.department}
          onValueChange={handleDepartmentChange}
          disabled={disabled}
        >
          <SelectTrigger className={`w-full ${errors.department ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {peruAddresses.map((department) => (
              <SelectItem key={department.code} value={department.code}>
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.department && (
          <p className="text-sm text-red-600">{errors.department}</p>
        )}
      </div>

      {/* Province Field */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Province <span className="text-red-500">*</span>
        </Label>
        <Select
          value={value.province}
          onValueChange={handleProvinceChange}
          disabled={disabled || availableProvinces.length === 0}
        >
          <SelectTrigger className={`w-full ${errors.province ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Select province" />
          </SelectTrigger>
          <SelectContent>
            {availableProvinces.map((province) => (
              <SelectItem key={province.code} value={province.code}>
                {province.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.province && (
          <p className="text-sm text-red-600">{errors.province}</p>
        )}
      </div>

      {/* District Field */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          District <span className="text-red-500">*</span>
        </Label>
        <Select
          value={value.district}
          onValueChange={handleDistrictChange}
          disabled={disabled || availableDistricts.length === 0}
        >
          <SelectTrigger className={`w-full ${errors.district ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Select district" />
          </SelectTrigger>
          <SelectContent>
            {availableDistricts.map((district) => (
              <SelectItem key={district.code} value={district.code}>
                {district.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.district && (
          <p className="text-sm text-red-600">{errors.district}</p>
        )}
      </div>

      {/* Postal Code Field */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Postal Code
        </Label>
        <Input
          type="text"
          value={value.postalCode}
          onChange={(e) => handlePostalCodeChange(e.target.value)}
          placeholder="Enter postal code"
          disabled={disabled}
          className={errors.postalCode ? 'border-red-500' : ''}
        />
        {errors.postalCode && (
          <p className="text-sm text-red-600">{errors.postalCode}</p>
        )}
      </div>
    </div>
  );
}
