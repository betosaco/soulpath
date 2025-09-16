import React from 'react';
import { motion } from 'framer-motion';
import '@/styles/unified-component-styles.css';

interface CMSInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'url';
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  rows?: number;
  multiline?: boolean;
}

export const CMSInput: React.FC<CMSInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  error,
  className = '',
  rows = 3,
  multiline = false
}) => {
  const baseClasses = 'unified-form-input';
  const errorClasses = error ? 'border-[var(--unified-error)] focus:border-[var(--unified-error)]' : '';
  const classes = `${baseClasses} ${errorClasses} ${className}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      {label && (
        <label className="unified-form-label">
          {label}
          {required && <span className="text-[var(--unified-error)] ml-1">*</span>}
        </label>
      )}
      
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={classes}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={classes}
        />
      )}
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-[var(--unified-error)]"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};
