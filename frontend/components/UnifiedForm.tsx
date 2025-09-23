'use client';

import React, { useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface UnifiedFormProps<T> {
  schema: z.ZodSchema<T>;
  initialValues: T;
  onSubmit: (data: T) => Promise<void> | void;
  children: (props: {
    values: T;
    errors: Record<string, string>;
    setValue: (field: keyof T, value: any) => void;
    setError: (field: keyof T, error: string) => void;
    clearError: (field: keyof T) => void;
    isSubmitting: boolean;
    isValid: boolean;
  }) => ReactNode;
  className?: string;
  showSubmitButton?: boolean;
  submitButtonText?: string;
  submitButtonIcon?: React.ComponentType<any>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

/**
 * UnifiedForm - A standardized form wrapper component
 * 
 * This component provides:
 * - Zod schema validation
 * - Unified error handling and display
 * - Consistent form state management
 * - Loading states and submission handling
 * - Mobile-first responsive design
 * - Integration with the unified design system
 * 
 * Usage:
 * ```tsx
 * <UnifiedForm
 *   schema={mySchema}
 *   initialValues={initialData}
 *   onSubmit={handleSubmit}
 * >
 *   {({ values, errors, setValue, setError, isSubmitting, isValid }) => (
 *     <div>
 *       <input
 *         value={values.name}
 *         onChange={(e) => setValue('name', e.target.value)}
 *         onBlur={() => validateField('name')}
 *       />
 *       {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
 *     </div>
 *   )}
 * </UnifiedForm>
 * ```
 */
export function UnifiedForm<T extends Record<string, any>>({
  schema,
  initialValues,
  onSubmit,
  children,
  className = '',
  showSubmitButton = true,
  submitButtonText = 'Submit',
  submitButtonIcon: SubmitIcon,
  validateOnChange = true,
  validateOnBlur = true
}: UnifiedFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Validate a single field
  const validateField = useCallback((field: keyof T) => {
    try {
      const fieldSchema = schema.shape[field as string];
      if (fieldSchema) {
        fieldSchema.parse(values[field]);
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [field as string]: error.errors[0]?.message || 'Invalid value'
        }));
      }
    }
  }, [schema, values]);

  // Validate entire form
  const validateForm = useCallback(() => {
    try {
      schema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [schema, values]);

  // Set a field value
  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    if (validateOnChange) {
      // Debounce validation to avoid excessive calls
      setTimeout(() => validateField(field), 100);
    }
  }, [validateField, validateOnChange]);

  // Set a field error
  const setError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field as string]: error }));
  }, []);

  // Clear a field error
  const clearError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await onSubmit(values);
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0 && 
                  Object.values(values).every(value => 
                    value !== null && value !== undefined && value !== ''
                  );

  return (
    <form onSubmit={handleSubmit} className={`unified-form ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children({
          values,
          errors,
          setValue,
          setError,
          clearError,
          isSubmitting,
          isValid
        })}
      </motion.div>

      {showSubmitButton && (
        <div className="unified-form-actions">
          <motion.button
            type="submit"
            disabled={isSubmitting || !isValid}
            className={`btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={!isSubmitting && isValid ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting && isValid ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {SubmitIcon && <SubmitIcon className="w-4 h-4 mr-2" />}
                {submitButtonText}
              </>
            )}
          </motion.button>
        </div>
      )}

      {/* Submit Status Messages */}
      <AnimatePresence>
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="unified-form-status unified-form-status--success"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Form submitted successfully!</span>
          </motion.div>
        )}
        
        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="unified-form-status unified-form-status--error"
          >
            <AlertCircle className="w-5 h-5" />
            <span>There was an error submitting the form. Please try again.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

/**
 * FormField - A standardized form field wrapper
 */
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({ 
  label, 
  error, 
  required = false, 
  children, 
  className = '' 
}: FormFieldProps) {
  return (
    <div className={`unified-form-group ${className}`}>
      <label className="unified-form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="unified-form-error"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
}

/**
 * FormSection - A section wrapper for grouping related form fields
 */
interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({ 
  title, 
  description, 
  children, 
  className = '' 
}: FormSectionProps) {
  return (
    <div className={`unified-form-section ${className}`}>
      <div className="unified-form-section__header">
        <h3 className="unified-form-section__title">{title}</h3>
        {description && (
          <p className="unified-form-section__description">{description}</p>
        )}
      </div>
      <div className="unified-form-section__content">
        {children}
      </div>
    </div>
  );
}
