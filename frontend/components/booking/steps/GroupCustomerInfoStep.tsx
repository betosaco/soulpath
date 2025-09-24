'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/appStore';
import { ArrowLeft, ArrowRight, User, Mail, Phone, MapPin } from 'lucide-react';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
}

/**
 * GroupCustomerInfoStep Component
 * 
 * This step collects customer information for each package in a group booking.
 * Each package gets assigned to a different person.
 */
export function GroupCustomerInfoStep() {
  const router = useRouter();
  const { items: cartItems } = useCart();

  // Get package items from cart
  const packageItems = cartItems.filter(item => item.type === 'package');
  
  // Initialize customer info for each package
  const [customerInfos, setCustomerInfos] = useState<Record<string, CustomerInfo>>(() => {
    const initialInfos: Record<string, CustomerInfo> = {};
    packageItems.forEach(pkg => {
      initialInfos[pkg.id] = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: ''
      };
    });
    return initialInfos;
  });

  const [currentPackageIndex, setCurrentPackageIndex] = useState(0);
  const currentPackage = packageItems[currentPackageIndex];
  const currentCustomerInfo = customerInfos[currentPackage.id];

  const updateCustomerInfo = (packageId: string, field: keyof CustomerInfo, value: string) => {
    setCustomerInfos(prev => ({
      ...prev,
      [packageId]: {
        ...prev[packageId],
        [field]: value
      }
    }));
  };

  const isCurrentFormValid = () => {
    const info = currentCustomerInfo;
    return info.firstName.trim() !== '' && 
           info.lastName.trim() !== '' && 
           info.email.trim() !== '' && 
           info.phone.trim() !== '';
  };

  const isAllFormsValid = () => {
    return packageItems.every(pkg => {
      const info = customerInfos[pkg.id];
      return info.firstName.trim() !== '' && 
             info.lastName.trim() !== '' && 
             info.email.trim() !== '' && 
             info.phone.trim() !== '';
    });
  };

  const handleNext = () => {
    if (currentPackageIndex < packageItems.length - 1) {
      setCurrentPackageIndex(prev => prev + 1);
    } else {
      // All forms completed, proceed to next step
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentPackageIndex > 0) {
      setCurrentPackageIndex(prev => prev - 1);
    } else {
      // Go back to group selection
      router.push('/booking/group-selection');
    }
  };

  const handleSubmit = () => {
    console.log('👥 Group customer info submitted:', customerInfos);
    // TODO: Save customer info to store/API
    
    // Check if cart contains physical products (requires shipping)
    const hasPhysicalProducts = cartItems.some(item => item.type === 'product');
    
    // Navigate to next step (shipping or payment)
    if (hasPhysicalProducts) {
      router.push('/booking/shipping');
    } else {
      router.push('/booking/payment');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Customer Information
        </h1>
        <p className="text-lg text-gray-600">
          Package {currentPackageIndex + 1} of {packageItems.length}: {currentPackage.name}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {packageItems.map((pkg, index) => (
            <div key={pkg.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < currentPackageIndex 
                  ? 'bg-green-500 text-white' 
                  : index === currentPackageIndex 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {index < currentPackageIndex ? '✓' : index + 1}
              </div>
              {index < packageItems.length - 1 && (
                <div className={`w-12 h-1 mx-2 ${
                  index < currentPackageIndex ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          {packageItems.map((pkg, index) => (
            <span key={pkg.id} className="text-center max-w-20 truncate">
              {pkg.name}
            </span>
          ))}
        </div>
      </div>

      {/* Current Package Info */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <User className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-900">{currentPackage.name}</h3>
            <p className="text-sm text-blue-700">
              {currentPackage.bookingDetails?.length || 0} sessions booked • {currentPackage.currency} {currentPackage.price?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Information Form */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Contact Information for {currentPackage.name}
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              value={currentCustomerInfo.firstName}
              onChange={(e) => updateCustomerInfo(currentPackage.id, 'firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter first name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              value={currentCustomerInfo.lastName}
              onChange={(e) => updateCustomerInfo(currentPackage.id, 'lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter last name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={currentCustomerInfo.email}
              onChange={(e) => updateCustomerInfo(currentPackage.id, 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              value={currentCustomerInfo.phone}
              onChange={(e) => updateCustomerInfo(currentPackage.id, 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address (Optional)
            </label>
            <input
              type="text"
              value={currentCustomerInfo.address || ''}
              onChange={(e) => updateCustomerInfo(currentPackage.id, 'address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter address"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City (Optional)
            </label>
            <input
              type="text"
              value={currentCustomerInfo.city || ''}
              onChange={(e) => updateCustomerInfo(currentPackage.id, 'city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter city"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country (Optional)
            </label>
            <input
              type="text"
              value={currentCustomerInfo.country || ''}
              onChange={(e) => updateCustomerInfo(currentPackage.id, 'country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter country"
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{currentPackageIndex === 0 ? 'Back to Selection' : 'Previous'}</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!isCurrentFormValid()}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white transition-colors ${
            isCurrentFormValid()
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <span>
            {currentPackageIndex === packageItems.length - 1 ? 'Complete' : 'Next Package'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Summary */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          {packageItems.length - currentPackageIndex - 1} package{packageItems.length - currentPackageIndex - 1 !== 1 ? 's' : ''} remaining
        </p>
      </div>
    </div>
  );
}
