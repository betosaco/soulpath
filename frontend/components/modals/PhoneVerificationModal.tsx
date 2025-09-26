'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '../cms/Toast';
import '../ui/mobile-booking.css';

interface Country {
  code: string;
  name: string;
  flag: string;
  prefix: string;
  example: string;
}

interface UserData {
  id?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  language?: string;
  status?: string;
}

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationSuccess: (userData: UserData, isExistingCustomer: boolean) => void;
}

const countries: Country[] = [
  { code: 'PE', name: 'Peru', flag: '🇵🇪', prefix: '+51', example: '912345678' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', prefix: '+57', example: '3001234567' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', prefix: '+52', example: '5512345678' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', prefix: '+34', example: '612345678' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', prefix: '+54', example: '91123456789' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', prefix: '+56', example: '912345678' },
  { code: 'US', name: 'United States', flag: '🇺🇸', prefix: '+1', example: '5551234567' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', prefix: '+1', example: '5551234567' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', prefix: '+55', example: '11987654321' },
];

export function PhoneVerificationModal({ 
  isOpen, 
  onClose, 
  onVerificationSuccess 
}: PhoneVerificationModalProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setOtpSent] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const toast = useToast();

  // Timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeRemaining]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCountryDropdownOpen && !(event.target as Element).closest('.country-dropdown')) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCountryDropdownOpen]);

  const handleSendOtp = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    // Validate phone number format based on country
    const cleanNumber = phoneNumber.trim().replace(/\D/g, '');
    
    // Peru mobile validation: must be 9 digits starting with 9
    if (selectedCountry.code === '+51' || selectedCountry.code === 'PE') {
      if (!/^9\d{8}$/.test(cleanNumber)) {
        setError('Peru mobile numbers must be 9 digits starting with 9 (e.g., 912345678)');
        return;
      }
    } else {
      // General validation for other countries
      if (cleanNumber.length < 7 || cleanNumber.length > 15) {
        setError('Phone number must be between 7 and 15 digits');
        return;
      }
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          countryCode: selectedCountry.code,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setStep('otp');
        setTimeRemaining(60); // 60 seconds cooldown
        toast.showSuccess(
          'OTP Sent',
          `Verification code sent to ${selectedCountry.prefix} ${phoneNumber}`
        );
      } else {
        // Provide more specific error messages
        if (data.error && data.error.includes('Invalid phone number format')) {
          setError(`Invalid phone number format for ${selectedCountry.name}. Expected format: ${selectedCountry.example} (${selectedCountry.example.length} digits)`);
        } else {
          setError(data.error || 'Failed to send OTP');
        }
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode.trim() || otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const fullPhoneNumber = `${selectedCountry.prefix}${phoneNumber}`;
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: fullPhoneNumber,
          otpCode: otpCode.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.showSuccess(
          'Verification Successful',
          data.isExistingCustomer 
            ? 'Welcome back! Your information has been loaded.'
            : 'Phone number verified successfully.'
        );
        
        onVerificationSuccess(data.user, data.isExistingCustomer);
        onClose();
      } else {
        setError(data.error || 'Invalid OTP code');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timeRemaining > 0) return;
    
    setOtpCode('');
    setError('');
    await handleSendOtp();
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtpCode('');
    setError('');
    setOtpSent(false);
    setTimeRemaining(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          style={{ background: 'var(--color-surface-primary)', border: '1px solid var(--color-border-500)', color: 'var(--color-text-primary)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--color-border-500)' }}>
            <div className="flex items-center gap-3">
              {step === 'otp' && (
                <button
                  onClick={handleBackToPhone}
                  className="p-1 rounded-full transition-colors hover:opacity-90"
                >
                  <ArrowLeft size={20} style={{ color: 'var(--color-text-secondary)' }} />
                </button>
              )}
              <div className="flex items-center gap-2">
                <Phone size={20} style={{ color: 'var(--color-accent-500)' }} />
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {step === 'phone' ? 'Verify Phone Number' : 'Enter Verification Code'}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full transition-colors hover:opacity-90"
            >
              <X size={20} style={{ color: 'var(--color-text-secondary)' }} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'phone' ? (
              <div className="space-y-6">
                <div className="text-center">
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    Enter your phone number to receive a verification code
                  </p>
                </div>

                {/* Country Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    Country
                  </label>
                  <div className="relative country-dropdown">
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="w-full p-3 rounded-lg focus:ring-2 flex items-center justify-between mobile-touch-target"
                      style={{ background: 'var(--color-surface-secondary)', border: '1px solid var(--color-border-500)', color: 'var(--color-text-primary)' }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span className="text-sm">{selectedCountry.name}</span>
                        <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>({selectedCountry.prefix})</span>
                      </div>
                      <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isCountryDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto mobile-scroll" style={{ background: 'var(--color-surface-primary)', border: '1px solid var(--color-border-500)' }}>
                        {countries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(country);
                              setIsCountryDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left transition-colors duration-200 flex items-center space-x-3 mobile-touch-target ${
                              selectedCountry.code === country.code ? 'bg-[var(--color-accent-500)]/15 text-[var(--color-accent-500)]' : ''
                            }`}
                            style={{ color: selectedCountry.code === country.code ? 'var(--color-accent-500)' : 'var(--color-text-primary)' }}
                          >
                            <span className="text-lg">{country.flag}</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium">{country.name}</div>
                              <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{country.prefix}</div>
                            </div>
                            {selectedCountry.code === country.code && (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--color-accent-500)' }}>
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone Number Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 py-3 rounded-lg" style={{ background: 'var(--color-surface-secondary)', border: '1px solid var(--color-border-500)' }}>
                      <span style={{ color: 'var(--color-text-primary)' }}>{selectedCountry.prefix}</span>
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder={selectedCountry.example}
                      className="flex-1 p-3 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ background: 'var(--color-surface-secondary)', border: '1px solid var(--color-border-500)', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                  <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                    Example: {selectedCountry.example} (without country code)
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-accent-500)' }}>
                    💡 Enter only the local number, the country code {selectedCountry.prefix} will be added automatically
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'color-mix(in srgb, var(--color-status-error) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--color-status-error) 20%, transparent)' }}>
                    <AlertCircle size={16} style={{ color: 'var(--color-status-error)' }} />
                    <span className="text-sm" style={{ color: 'color-mix(in srgb, var(--color-status-error) 85%, black)' }}>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleSendOtp}
                  disabled={isLoading || !phoneNumber.trim()}
                  className="w-full py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  style={{ background: 'var(--color-primary-500)', color: 'var(--primary-foreground)' }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Verification Code'
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <CheckCircle size={48} className="mx-auto mb-3" style={{ color: 'var(--color-accent-500)' }} />
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    We sent a 6-digit code to
                  </p>
                  <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {selectedCountry.prefix} {phoneNumber}
                  </p>
                </div>

                {/* OTP Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full p-3 text-center text-2xl font-mono rounded-lg focus:ring-2 focus:border-transparent tracking-widest"
                    style={{ background: 'var(--color-surface-secondary)', border: '1px solid var(--color-border-500)', color: 'var(--color-text-primary)' }}
                    maxLength={6}
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'color-mix(in srgb, var(--color-status-error) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--color-status-error) 20%, transparent)' }}>
                    <AlertCircle size={16} style={{ color: 'var(--color-status-error)' }} />
                    <span className="text-sm" style={{ color: 'color-mix(in srgb, var(--color-status-error) 85%, black)' }}>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleVerifyOtp}
                  disabled={isLoading || otpCode.length !== 6}
                  className="w-full py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  style={{ background: 'var(--color-primary-500)', color: 'var(--primary-foreground)' }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </button>

                {/* Resend OTP */}
                <div className="text-center">
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Didn&apos;t receive the code?{' '}
                    <button
                      onClick={handleResendOtp}
                      disabled={timeRemaining > 0}
                      className="font-medium disabled:cursor-not-allowed"
                      style={{ color: timeRemaining > 0 ? 'var(--color-text-tertiary)' : 'var(--color-accent-500)' }}
                    >
                      {timeRemaining > 0 ? `Resend in ${formatTime(timeRemaining)}` : 'Resend Code'}
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
