'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/appStore';
import { ArrowLeft, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { toast } from 'sonner';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
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
        name: '',
        email: '',
        phone: '',
        countryCode: 'PE'
      };
    });
    return initialInfos;
  });

  const [currentPackageIndex, setCurrentPackageIndex] = useState(0);
  const [showPackageModal, setShowPackageModal] = useState(false);
  
  // Add null checks and fallbacks for SSR safety
  const currentPackage = packageItems[currentPackageIndex] || null;
  const currentCustomerInfo = currentPackage ? customerInfos[currentPackage.id] : null;

  const updateCustomerInfo = (packageId: string, field: keyof CustomerInfo, value: string) => {
    setCustomerInfos(prev => ({
      ...prev,
      [packageId]: {
        ...prev[packageId],
        [field]: value
      }
    }));
  };

  const handlePackageSelection = (selectedPackageId: string) => {
    // Find the index of the selected package
    const selectedIndex = packageItems.findIndex(pkg => pkg.id === selectedPackageId);
    if (selectedIndex !== -1) {
      // Switch to the selected package
      setCurrentPackageIndex(selectedIndex);
    }
    setShowPackageModal(false);
  };

  const handleSidebarPackageClick = (packageIndex: number) => {
    setCurrentPackageIndex(packageIndex);
  };

  // Ensure currentPackageIndex is valid when packageItems changes
  React.useEffect(() => {
    if (packageItems.length > 0 && currentPackageIndex >= packageItems.length) {
      setCurrentPackageIndex(0);
    }
  }, [packageItems.length, currentPackageIndex]);

  // Early return if no packages or current package is not available
  if (packageItems.length === 0 || !currentPackage || !currentCustomerInfo) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Packages Found</h2>
          <p className="text-gray-600">Please add packages to your cart before proceeding.</p>
        </div>
      </div>
    );
  }

  const isCurrentFormValid = () => {
    const info = currentCustomerInfo;
    return info.name.trim() !== '' && 
           info.email.trim() !== '' && 
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email);
  };

  const _isAllFormsValid = () => {
    return packageItems.every(pkg => {
      const info = customerInfos[pkg.id];
      return info.name.trim() !== '' && 
             info.email.trim() !== '' && 
             /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email);
    });
  };

  const handlePrevious = () => {
    if (currentPackageIndex > 0) {
      setCurrentPackageIndex(prev => prev - 1);
    } else {
      // Go back to group selection
      router.push('/booking/group-selection');
    }
  };

  // Helper function to find the next unassigned package
  const findNextUnassignedPackage = () => {
    return packageItems.findIndex(pkg => {
      const customerInfo = customerInfos[pkg.id];
      return !customerInfo.name || !customerInfo.email;
    });
  };

  const handleSubmit = () => {
    console.log('👥 Group customer info submitted:', customerInfos);
    // TODO: Save customer info to store/API
    
    // Find the next unassigned package
    const nextUnassignedIndex = findNextUnassignedPackage();
    
    if (nextUnassignedIndex !== -1) {
      // Navigate to the next unassigned package
      setCurrentPackageIndex(nextUnassignedIndex);
    } else {
      // All packages are assigned, proceed to checkout
      const hasPhysicalProducts = cartItems.some(item => item.type === 'product');
      
      if (hasPhysicalProducts) {
        router.push('/booking/shipping');
      } else {
        router.push('/booking/payment');
      }
    }
  };

  // Check if all forms are completed
  const allFormsCompleted = _isAllFormsValid();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Group Booking
        </h1>
        <p className="text-lg text-gray-600">
          {allFormsCompleted ? 'Final Assignment Summary' : 'Enter details for each person'}
        </p>
      </div>

      {/* Show Final Assignment Summary when all forms are completed */}
      {allFormsCompleted ? (
        <div className="bg-white rounded-lg border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Package Assignments Complete
          </h2>
          <p className="text-center text-gray-600 mb-6">
            All packages have been assigned. Review the assignments below.
          </p>
          <div className="space-y-4">
            {packageItems.map((pkg, index) => {
              const customerInfo = customerInfos[pkg.id];
              return (
                <div key={`final-${index}`} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg cursor-default">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-lg">✓</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                      <p className="text-sm text-gray-600">
                        {pkg.currency} {pkg.price?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{customerInfo.name}</p>
                    <p className="text-sm text-gray-600">{customerInfo.email}</p>
                    <p className="text-sm text-gray-600">{customerInfo.phone}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Main Content - Forms */
        <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Side - Package List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Packages</h3>
            <div className="space-y-3">
              {packageItems.map((pkg, index) => {
                const customerInfo = customerInfos[pkg.id];
                const isCompleted = customerInfo.name && customerInfo.email;
                const isCurrent = index === currentPackageIndex;
                
                return (
                  <div 
                    key={`sidebar-${index}`} 
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isCurrent 
                        ? 'border-blue-500 bg-blue-50' 
                        : isCompleted 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      // Don't allow navigation if all forms are completed
                      if (!allFormsCompleted) {
                        handleSidebarPackageClick(index);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">{pkg.name}</h4>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isCurrent 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-300 text-gray-600'
                      }`}>
                        {isCompleted ? '✓' : '○'}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">
                      {isCompleted 
                        ? `${customerInfo.name}`
                        : isCurrent 
                          ? 'Filling out...'
                          : 'Not assigned'
                      }
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {currentPackage.name}
              </h2>
              <p className="text-gray-600">
                Enter contact information for the person who will use this package
              </p>
            </div>

            {/* Customer Information Form */}
            <div className="space-y-6">
              {/* Phone Field */}
              <div className="unified-form-group">
                <PhoneInput
                  label="Phone Number"
                  required={false}
                  value={currentCustomerInfo.phone}
                  onChange={(phone, countryCode) => {
                    updateCustomerInfo(currentPackage.id, 'phone', phone);
                    updateCustomerInfo(currentPackage.id, 'countryCode', countryCode);
                  }}
                  placeholder="Enter phone number"
                  defaultCountryCode={currentCustomerInfo.countryCode}
                />
              </div>

              {/* Name Field */}
              <div className="unified-form-group">
                <Label htmlFor="name" className="unified-form-label">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={currentCustomerInfo.name}
                  onChange={(e) => updateCustomerInfo(currentPackage.id, 'name', e.target.value)}
                  className="unified-form-input"
                  required={true}
                  placeholder="Enter full name"
                />
              </div>

              {/* Email Field */}
              <div className="unified-form-group">
                <Label htmlFor="email" className="unified-form-label">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={currentCustomerInfo.email}
                  onChange={(e) => updateCustomerInfo(currentPackage.id, 'email', e.target.value)}
                  className="unified-form-input"
                  required={true}
                  placeholder="Enter email address"
                />
              </div>

              {/* Package Selection Field */}
              <div className="unified-form-group">
                <Label className="unified-form-label">
                  Select Package *
                </Label>
                
                {/* Desktop: Dropdown */}
                <div className="hidden md:block">
                  <select
                    value={currentPackage.id}
                    onChange={(e) => handlePackageSelection(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {packageItems.map((pkg, index) => {
                      const customerInfo = customerInfos[pkg.id];
                      const isCompleted = customerInfo.name && customerInfo.email;
                      
                      return (
                        <option 
                          key={`option-${index}`} 
                          value={pkg.id}
                        >
                          {pkg.name} - {pkg.currency} {pkg.price?.toFixed(2)}
                          {isCompleted ? ` (${customerInfo.name})` : ' (Not assigned)'}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Mobile: Button that opens modal */}
                <button
                  type="button"
                  onClick={() => setShowPackageModal(true)}
                  className="md:hidden w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-900">
                    {currentPackage.name} - {currentPackage.currency} {currentPackage.price?.toFixed(2)}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      )}

      {/* Navigation */}
      <div className="flex justify-between pt-8 pb-8">
        <button
          onClick={handlePrevious}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{currentPackageIndex === 0 ? 'Back to Selection' : 'Previous Package'}</span>
        </button>

        {!allFormsCompleted && (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-md font-medium transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          >
            {findNextUnassignedPackage() !== -1 ? 'NEXT' : 'CONTINUE TO CHECKOUT'}
          </button>
        )}

        {allFormsCompleted && (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-md font-medium transition-all duration-200 bg-green-600 hover:bg-green-700 text-white shadow-md"
          >
            CONTINUE TO CHECKOUT
          </button>
        )}
      </div>

      {/* Package Selection Modal - Mobile Only */}
      {showPackageModal && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Package</h3>
                <button
                  onClick={() => setShowPackageModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">
                Select which package to edit:
              </p>
              
              <div className="space-y-3">
                {packageItems.map((pkg, index) => {
                  const isCurrent = index === currentPackageIndex;
                  const customerInfo = customerInfos[pkg.id];
                  const isCompleted = customerInfo.name && customerInfo.email;
                  
                  return (
                    <button
                      key={`modal-${index}`}
                      onClick={() => handlePackageSelection(pkg.id)}
                      className={`w-full p-4 rounded-lg border text-left transition-all ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{pkg.name}</h4>
                          <p className="text-sm text-gray-600">
                            {pkg.currency} {pkg.price?.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {isCompleted ? `Assigned to: ${customerInfo.name}` : 'Not assigned yet'}
                          </p>
                        </div>
                        {isCurrent && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
