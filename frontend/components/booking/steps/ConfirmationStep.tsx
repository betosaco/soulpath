/**
 * ========================================================================================
 * CONFIRMATION STEP COMPONENT
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * Shows order confirmation and booking details after successful payment.
 * This component replaces the confirmation section from MasterBookingFlow.tsx.
 *
 * RESPONSIBILITIES:
 * - Display order confirmation with order number
 * - Show complete order details and pricing
 * - Display booking information for packages
 * - Provide next steps instructions
 * - Offer print/download options (future enhancement)
 * - Show customer support information
 *
 * FEATURES:
 * - Order summary with all items and bookings
 * - Customer information summary
 * - Shipping information (if applicable)
 * - Booking schedule details for packages
 * - Next steps and expectations
 *
 * INTEGRATIONS:
 * - Order data from payment step
 * - Customer and shipping information
 * - Cart state for booking details
 * - Email confirmation status (future)
 *
 * FLOW:
 * - Previous: /booking/payment (on successful payment)
 * - Next: None (final step - user can start new booking or return home)
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Mail, Phone, Calendar, Package, Truck, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/appStore';

/**
 * CONFIRMATION STEP PROPS
 * ------------------------
 * Props passed to the ConfirmationStep component
 */
interface ConfirmationStepProps {
  /** Order data from successful payment */
  orderData?: {
    orderNumber: string;
    total: number;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
  /** Customer information for display */
  customerData?: {
    name: string;
    email: string;
    phone?: string;
  };
  /** Shipping information (if applicable) */
  shippingData?: {
    address: string;
    city: string;
    country: string;
  };
}

/**
 * CONFIRMATION STEP COMPONENT
 * ---------------------------
 * Shows order confirmation and booking details
 *
 * @param props - Component props
 * @returns React component
 */
export function ConfirmationStep({
  orderData,
  customerData,
  shippingData
}: ConfirmationStepProps) {
  // ============================================================================
  // HOOKS AND STATE MANAGEMENT
  // ============================================================================

  /**
   * ROUTER FOR NAVIGATION
   * --------------------
   * Access to Next.js router for navigation
   */
  const router = useRouter();

  /**
   * CART STATE
   * ----------
   * Access to cart items for detailed booking information
   */
  const { items: cartItems } = useCart();

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * HANDLE START NEW BOOKING
   * ------------------------
   * Navigate back to packages page to start a new booking
   */
  const handleStartNewBooking = () => {
    router.push('/products');
  };

  /**
   * HANDLE VIEW BOOKINGS
   * --------------------
   * Navigate to account bookings page
   */
  const handleViewBookings = () => {
    router.push('/account/sessions');
  };

  /**
   * HANDLE PRINT CONFIRMATION
   * -------------------------
   * Print the confirmation page (future enhancement)
   */
  const handlePrintConfirmation = () => {
    window.print();
  };


  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  /**
   * RENDER ORDER SUMMARY
   * --------------------
   * Displays the complete order summary
   */
  const renderOrderSummary = () => {
    if (!orderData) return null;

    return (
      <Card className="unified-card">
        <CardHeader>
          <CardTitle className="unified-card__title flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong className="text-gray-700">Order Number:</strong>
                <p className="text-lg font-mono text-gray-900">{orderData.orderNumber}</p>
              </div>
              <div>
                <strong className="text-gray-700">Total Amount:</strong>
                <p className="text-lg font-bold text-green-600">S/ {orderData.total.toFixed(2)}</p>
              </div>
            </div>

            <div>
              <strong className="text-gray-700 mb-2 block">Items Purchased:</strong>
              <ul className="space-y-2">
                {orderData.items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{item.name} x {item.quantity}</span>
                    <span className="font-medium">S/ {(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  /**
   * RENDER BOOKING DETAILS
   * ----------------------
   * Shows detailed booking information for packages
   */
  const renderBookingDetails = () => {
    const packageItems = cartItems.filter(item => item.type === 'package' && item.bookingDetails);

    if (packageItems.length === 0) return null;

    return (
      <Card className="unified-card">
        <CardHeader>
          <CardTitle className="unified-card__title flex items-center">
            <Calendar className="w-5 h-5 text-blue-600 mr-2" />
            Your Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {packageItems.map((item, itemIndex) => (
              <div key={itemIndex} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  {item.name}
                </h4>

                <div className="space-y-2">
                  {item.bookingDetails?.map((booking, bookingIndex) => (
                    <div key={bookingIndex} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.selectedDate}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.selectedTime} - {booking.serviceType}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>{booking.teacher}</p>
                        <p>{booking.venue}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    {item.bookingDetails?.length || 0} of {item.sessions || 1} sessions scheduled
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  /**
   * RENDER CUSTOMER INFORMATION
   * ---------------------------
   * Shows customer details for confirmation
   */
  const renderCustomerInfo = () => {
    if (!customerData) return null;

    return (
      <Card className="unified-card">
        <CardHeader>
          <CardTitle className="unified-card__title flex items-center">
            <User className="w-5 h-5 text-purple-600 mr-2" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Name:</strong> {customerData.name}</p>
            <p><strong>Email:</strong> {customerData.email}</p>
            {customerData.phone && <p><strong>Phone:</strong> {customerData.phone}</p>}
          </div>
        </CardContent>
      </Card>
    );
  };

  /**
   * RENDER SHIPPING INFORMATION
   * ---------------------------
   * Shows shipping details if applicable
   */
  const renderShippingInfo = () => {
    if (!shippingData) return null;

    return (
      <Card className="unified-card">
        <CardHeader>
          <CardTitle className="unified-card__title flex items-center">
            <Truck className="w-5 h-5 text-orange-600 mr-2" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>{shippingData.address}</p>
            <p>{shippingData.city}, {shippingData.country}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  /**
   * RENDER NEXT STEPS
   * -----------------
   * Provides guidance on what happens next
   */
  const renderNextSteps = () => (
    <Card className="unified-card bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="unified-card__title text-blue-800">
          What&apos;s Next?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-blue-700">
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Email Confirmation</p>
              <p className="text-sm">You&apos;ll receive a confirmation email with your booking details and receipt.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Session Reminders</p>
              <p className="text-sm">We&apos;ll send you reminders 24 hours and 1 hour before each session.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Questions?</p>
              <p className="text-sm">Contact our support team if you need to make changes to your bookings.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  /**
   * RENDER ACTION BUTTONS
   * ---------------------
   * Provides buttons for next actions
   */
  const renderActionButtons = () => (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        onClick={handleViewBookings}
        variant="outline"
        className="flex items-center"
      >
        <Calendar className="w-4 h-4 mr-2" />
        View My Bookings
      </Button>

      <Button
        onClick={handleStartNewBooking}
        className="flex items-center bg-green-600 hover:bg-green-700"
      >
        <Package className="w-4 h-4 mr-2" />
        Book More Sessions
      </Button>

      <Button
        onClick={handlePrintConfirmation}
        variant="outline"
        className="flex items-center"
      >
        <Download className="w-4 h-4 mr-2" />
        Print Confirmation
      </Button>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h2>
        <p className="text-gray-600 text-lg">
          Thank you for your purchase. Your booking is confirmed.
        </p>
      </div>

      {/* Order Summary */}
      {renderOrderSummary()}

      {/* Booking Details */}
      {renderBookingDetails()}

      {/* Customer & Shipping Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderCustomerInfo()}
        {renderShippingInfo()}
      </div>

      {/* Next Steps */}
      {renderNextSteps()}

      {/* Action Buttons */}
      <div className="pt-6">
        {renderActionButtons()}
      </div>

      {/* Debug Information (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-8 p-4 bg-gray-50 rounded-lg">
          <summary className="cursor-pointer font-medium text-gray-700">
            Debug Information
          </summary>
          <pre className="mt-2 text-xs text-gray-600 overflow-auto">
            {JSON.stringify({
              orderData,
              customerData,
              shippingData,
              cartItemsCount: cartItems.length
            }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
