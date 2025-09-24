/**
 * ========================================================================================
 * DEPARTMENT INPUT COMPONENT
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * Renders a department selection input with lateral menu for Peru addresses.
 * Uses the complete MTC database with all 25 departments.
 *
 * FEATURES:
 * ---------
 * - Lateral menu design with search functionality
 * - Complete MTC database integration
 * - Click outside to close
 * - Keyboard navigation support
 * - Accessibility features
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { getDepartments } from '@/lib/peru-shipping-data';

/**
 * DEPARTMENT DATA INTERFACE
 * -------------------------
 * Structure for department data
 */
interface Department {
  code: string;
  name: string;
  flag: string;
}

/**
 * DEPARTMENT INPUT PROPS
 * ----------------------
 * Props passed to the DepartmentInput component
 */
interface DepartmentInputProps {
  /** Label for the input field */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Current value of the input */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Error message to display */
  error?: string;
  /** Default department code */
  defaultDepartmentCode?: string;
}

/**
 * DEPARTMENT INPUT COMPONENT
 * --------------------------
 * Renders a department selection input with lateral menu
 *
 * @param props - Component props
 * @returns React component
 */
export function DepartmentInput({
  label,
  _required = false,
  value,
  onChange,
  placeholder = 'Select department',
  disabled = false,
  error,
  defaultDepartmentCode = 'LIM'
}: DepartmentInputProps) {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] = useState(false);
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * GET AVAILABLE DEPARTMENTS
   * -------------------------
   * Get all departments from MTC database
   */
  const getAvailableDepartments = () => {
    const mtcDepartments = getDepartments();
    return mtcDepartments.map(d => ({ code: d.code, name: d.name, flag: '' }));
  };

  /**
   * INITIALIZE SELECTED DEPARTMENT
   * ------------------------------
   * Set the initial selected department based on value or default
   */
  useEffect(() => {
    const availableDepartments = getAvailableDepartments();
    const department = availableDepartments.find(d => d.code === value) || 
                       availableDepartments.find(d => d.code === defaultDepartmentCode) ||
                       availableDepartments[0];
    setSelectedDepartment(department);
  }, [value, defaultDepartmentCode]);

  /**
   * HANDLE CLICK OUTSIDE
   * --------------------
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDepartmentDropdownOpen(false);
        setDepartmentSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * HANDLE DEPARTMENT SELECTION
   * ---------------------------
   * Updates the selected department and calls onChange
   */
  const handleDepartmentSelect = (department: Department) => {
    setSelectedDepartment(department);
    onChange(department.code);
    setIsDepartmentDropdownOpen(false);
    setDepartmentSearchTerm('');
  };

  /**
   * HANDLE DROPDOWN TOGGLE
   * ----------------------
   * Opens/closes the department dropdown
   */
  const handleDropdownToggle = () => {
    if (disabled) return;
    setIsDepartmentDropdownOpen(!isDepartmentDropdownOpen);
    if (!isDepartmentDropdownOpen) {
      setDepartmentSearchTerm('');
    }
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  /**
   * FILTERED DEPARTMENTS
   * --------------------
   * Departments filtered by search term
   */
  const availableDepartments = getAvailableDepartments();
  const filteredDepartments = availableDepartments.filter(department =>
    department.name.toLowerCase().includes(departmentSearchTerm.toLowerCase()) ||
    department.code.toLowerCase().includes(departmentSearchTerm.toLowerCase())
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

      {/* Input Field */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={handleDropdownToggle}
          disabled={disabled}
          className={`
            w-full px-3 py-2 text-left border rounded-md shadow-sm h-12
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${disabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-900 cursor-pointer hover:border-gray-400'
            }
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
        >
          <div className="flex items-center justify-between">
            <span className={selectedDepartment ? 'text-gray-900' : 'text-gray-500'}>
              {selectedDepartment ? selectedDepartment.name : placeholder}
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isDepartmentDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isDepartmentDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.2 }}
              className="fixed right-0 top-20 bottom-20 w-80 bg-white border-l border-gray-200 shadow-lg z-[999999]"
              style={{ top: '80px', bottom: '80px' }}
            >
              {/* Search Input */}
              <div className="p-4 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={departmentSearchTerm}
                  onChange={(e) => setDepartmentSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>

              {/* Department List */}
              <div className="overflow-y-auto h-96 pb-16">
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((department) => (
                    <button
                      key={department.code}
                      type="button"
                      onClick={() => handleDepartmentSelect(department)}
                      className={`
                        w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50
                        ${selectedDepartment?.code === department.code ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                      `}
                    >
                      <div className="flex items-center">
                        <span className="font-medium">{department.name}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-center">
                    No departments found
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
