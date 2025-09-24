'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/appStore';
import { Users, User, CheckCircle } from 'lucide-react';

/**
 * GroupBookingSelectionStep Component
 * 
 * This step asks the user if they want to make a group booking (multiple users)
 * or individual booking (single user for all packages).
 * 
 * Business Logic:
 * - If user selects "Group Booking": Navigate to multi-user forms
 * - If user selects "Individual Booking": Navigate to single user form
 * - Only shows when there are multiple packages in cart
 */
export function GroupBookingSelectionStep() {
  const router = useRouter();
  const { items: cartItems } = useCart();

  // Get package items from cart
  const packageItems = cartItems.filter(item => item.type === 'package');
  const packageCount = packageItems.length;

  const handleGroupBooking = () => {
    console.log('👥 User selected Group Booking');
    // Navigate to multi-user forms for each package
    router.push('/booking/group-customer-info');
  };

  const handleIndividualBooking = () => {
    console.log('👤 User selected Individual Booking');
    // Navigate to single user form
    router.push('/booking/customer-info?isDirectCheckout=true');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Booking Type Selection
        </h1>
        <p className="text-lg text-gray-600">
          You have {packageCount} package{packageCount > 1 ? 's' : ''} in your cart. 
          How would you like to proceed?
        </p>
      </div>

      {/* Package Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Packages:</h3>
        <div className="space-y-3">
          {packageItems.map((pkg, index) => (
            <div key={pkg.id} className="flex items-center justify-between bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{pkg.name}</h4>
                  <p className="text-sm text-gray-600">
                    {pkg.bookingDetails?.length || 0} / {pkg.sessions || 1} sessions booked
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {pkg.currency} {pkg.price?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Type Selection */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Group Booking Option */}
        <button
          onClick={handleGroupBooking}
          className="group p-8 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-800">
              Group Booking
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            Each package will be assigned to a different person. You'll provide contact information for each participant.
          </p>
          <div className="flex items-center text-green-600 font-medium">
            <CheckCircle className="w-5 h-5 mr-2" />
            Perfect for families, friends, or teams
          </div>
        </button>

        {/* Individual Booking Option */}
        <button
          onClick={handleIndividualBooking}
          className="group p-8 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-800">
              Individual Booking
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            All packages will be assigned to you. You'll provide your contact information once.
          </p>
          <div className="flex items-center text-blue-600 font-medium">
            <CheckCircle className="w-5 h-5 mr-2" />
            Perfect for personal use
          </div>
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          You can change this selection later if needed. The booking process will adapt based on your choice.
        </p>
      </div>
    </div>
  );
}
