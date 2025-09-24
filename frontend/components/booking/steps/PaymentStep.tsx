/**
 * ========================================================================================
 * PAYMENT STEP COMPONENT
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * Handles payment processing and order completion for the booking flow.
 * This component replaces the payment section from MasterBookingFlow.tsx.
 *
 * RESPONSIBILITIES:
 * - Display Stripe payment form for secure payment processing
 * - Show order summary with all cart items and pricing
 * - Handle payment success and error states
 * - Process final order validation before payment
 * - Trigger order completion and navigation to confirmation
 *
 * INTEGRATIONS:
 * - StripeInlineForm component for payment processing
 * - useCart hook for order data and pricing
 * - useBookingFlow hook for navigation
 * - Order creation and confirmation logic
 *
 * VALIDATION REQUIREMENTS:
 * - All packages must have at least one scheduled session
 * - No duplicate time slots within packages
 * - Valid customer and shipping information
 * - Non-zero total price
 *
 * FLOW:
 * - Previous: /booking/customer-info or /booking/shipping
 * - Next: /booking/confirmation (on successful payment)
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useBookingFlow } from '../hooks/useBookingFlow';
import { useCart, useAppStore } from '@/store/appStore';
import { TermsAndConditionsModal } from '../../TermsAndConditionsModal';
import { CreditCard, Clock, User, MapPin, Calendar, CheckCircle, AlertCircle, Mail, Phone, Edit } from 'lucide-react';

/**
 * PAYMENT STEP PROPS
 * -------------------
 * Props passed to the PaymentStep component
 */
interface PaymentStepProps {
  /** Callback when payment is successfully completed */
  onPaymentSuccess?: (paymentIntentId: string, orderData: any) => void;
  /** Callback when payment fails */
  onPaymentError?: (error: any) => void;
}

/**
 * ORDER DATA INTERFACE
 * --------------------
 * Defines the structure of order data for confirmation
 */
interface OrderData {
  orderNumber: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

/**
 * PAYMENT STEP COMPONENT
 * ----------------------
 * Handles payment processing and order completion
 *
 * @param props - Component props
 * @returns React component
 */
export function PaymentStep({ onPaymentSuccess, onPaymentError }: PaymentStepProps) {
  // ============================================================================
  // HOOKS AND STATE MANAGEMENT
  // ============================================================================

  /**
   * ROUTER
   * ------
   * For navigation to customer info page
   */
  const router = useRouter();

  /**
   * BOOKING FLOW STATE
   * ------------------
   * Access to flow navigation functions
   */
  const { goToNextStep, hasPhysicalProducts } = useBookingFlow();

  /**
   * CART STATE
   * ----------
   * Access to cart items, pricing, and order operations
   */
  const { items: cartItems, getTotalPrice } = useCart();

  /**
   * CUSTOMER DATA STATE
   * -------------------
   * Access to stored customer data from previous steps
   */
  const { customerData } = useAppStore();

  /**
   * PAYMENT STATE
   * -------------
   * Tracks payment processing status
   */
  const [paymentStatus, setPaymentStatus] = React.useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [orderData, setOrderData] = React.useState<OrderData | null>(null);
  const [showTermsModal, setShowTermsModal] = React.useState(false);
  const [termsAccepted, setTermsAccepted] = React.useState(false);

  // ============================================================================
  // BUSINESS LOGIC - ORDER VALIDATION
  // ============================================================================

  /**
   * VALIDATE ORDER BEFORE PAYMENT
   * -----------------------------
   * Performs final validation checks before allowing payment
   *
   * @returns Validation result with error message if invalid
   */
  const validateOrder = (): { isValid: boolean; error?: string } => {
    // Check if cart has items
    if (!cartItems || cartItems.length === 0) {
      return { isValid: false, error: 'Your cart is empty' };
    }

    // Check if total price is valid
    const totalPrice = getTotalPrice();
    if (totalPrice <= 0) {
      return { isValid: false, error: 'Invalid total price' };
    }

    // For packages, ensure they have at least one scheduled session
    const packageItems = cartItems.filter(item => item.type === 'package');
    if (packageItems.length > 0) {
      const packagesWithoutBookings = packageItems.filter(pkg =>
        !pkg.bookingDetails || pkg.bookingDetails.length === 0
      );

      if (packagesWithoutBookings.length > 0) {
        return {
          isValid: false,
          error: 'All packages must have at least one scheduled session before checkout'
        };
      }

      // Check for duplicate time slots within packages
      const allBookings = packageItems.flatMap(pkg => pkg.bookingDetails || []);
      const timeSlots = allBookings.map(booking =>
        `${booking.selectedDate}-${booking.selectedTime}`
      );
      const uniqueTimeSlots = new Set(timeSlots);

      if (timeSlots.length !== uniqueTimeSlots.size) {
        return {
          isValid: false,
          error: 'Duplicate time slots detected. Please remove duplicates before checkout.'
        };
      }
    }

    return { isValid: true };
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * HANDLE PAYMENT SUCCESS
   * ----------------------
   * Processes successful payment completion
   *
   * @param paymentIntentId - Stripe payment intent ID
   */
  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log('💳 Payment successful:', paymentIntentId);

    setPaymentStatus('success');

    // Create order data for confirmation
    const orderInfo: OrderData = {
      orderNumber: `ORD-${Date.now()}`,
      total: getTotalPrice(),
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    };

    setOrderData(orderInfo);

    // Call success callback
    onPaymentSuccess?.(paymentIntentId, orderInfo);

    // Show success message
    toast.success('Payment successful! Processing your order...');

    // Navigate to confirmation after a brief delay
    setTimeout(() => {
      goToNextStep();
    }, 2000);
  };

  /**
   * HANDLE PAYMENT ERROR
   * --------------------
   * Processes payment failure
   *
   * @param error - Payment error details
   */
  const handlePaymentError = (error: any) => {
    console.error('❌ Payment failed:', error);

    setPaymentStatus('error');

    // Call error callback
    onPaymentError?.(error);

    // Show error message
    toast.error('Payment failed. Please try again.');
  };

  /**
   * HANDLE PAY LATER
   * ----------------
   * Processes pay later option
   */
  const handlePayLater = () => {
    if (!termsAccepted) {
      setShowTermsModal(true);
      return;
    }

    console.log('💳 Pay Later selected');
    setPaymentStatus('processing');

    // Create order data for confirmation
    const orderInfo: OrderData = {
      orderNumber: `ORD-${Date.now()}`,
      total: getTotalPrice(),
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    };

    setOrderData(orderInfo);

    // Show success message
    toast.success('Order confirmed! You will be contacted for payment.');

    // Navigate to confirmation after a brief delay
    setTimeout(() => {
      goToNextStep();
    }, 2000);
  };

  /**
   * HANDLE TERMS ACCEPTANCE
   * -----------------------
   * Processes terms and conditions acceptance
   */
  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setShowTermsModal(false);
    toast.success('Terms and conditions accepted');
  };

  /**
   * HANDLE EDIT CUSTOMER INFO
   * -------------------------
   * Navigates back to customer info page for editing
   */
  const handleEditCustomerInfo = () => {
    // Get current URL parameters to preserve the flow state
    const currentParams = new URLSearchParams(window.location.search);
    
    // Navigate to customer info with preserved parameters
    const customerInfoUrl = `/booking/customer-info?${currentParams.toString()}`;
    router.push(customerInfoUrl);
  };


  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  /**
   * RENDER ORDER SUMMARY
   * --------------------
   * Displays the complete order summary with customer info, packages, and bookings
   */
  const renderOrderSummary = () => (
    <Card className="unified-card">
      <CardHeader>
        <CardTitle className="unified-card__title">Complete Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Price Details */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Price Details
            </h4>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">
                    {cartItems.length > 0 && cartItems[0].currency} {(getTotalPrice() / 1.18).toFixed(2)}
                  </span>
                </div>
                
                {/* IGV (18%) */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">IGV (18%):</span>
                  <span className="font-medium text-gray-900">
                    {cartItems.length > 0 && cartItems[0].currency} {(getTotalPrice() - (getTotalPrice() / 1.18)).toFixed(2)}
                  </span>
                </div>
                
                {/* Total */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-green-600">
                    {cartItems.length > 0 && cartItems[0].currency} {getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information (if applicable) */}
          {hasPhysicalProducts && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Shipping Address
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Shipping address will be collected in the previous step
                </p>
              </div>
            </div>
          )}

          {/* Packages and Bookings */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Packages & Bookings
            </h4>
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{item.name}</h5>
                    <span className="font-semibold text-green-600">
                      {item.currency} {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  
                  {item.type === 'package' && item.bookingDetails && item.bookingDetails.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-3">
                        Booked Sessions ({item.bookingDetails.length}):
                      </p>
                      <div className="space-y-2">
                        {item.bookingDetails.map((booking, bookingIndex) => (
                          <div key={bookingIndex} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            {/* Compact Session Header */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-semibold text-blue-900">
                                  Session {bookingIndex + 1}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span className="text-xs text-green-600 font-medium">Ready</span>
                              </div>
                            </div>

                            {/* Compact Session Details - Two Column Layout */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {/* Date & Time */}
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-gray-500" />
                                <span className="text-gray-600">Date:</span>
                                <span className="font-medium text-gray-900">{booking.selectedDate}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-gray-500" />
                                <span className="text-gray-600">Time:</span>
                                <span className="font-medium text-gray-900">{booking.selectedTime}</span>
                              </div>

                              {/* Teacher & Service */}
                              {booking.teacher && (
                                <div className="flex items-center space-x-1">
                                  <User className="w-3 h-3 text-gray-500" />
                                  <span className="text-gray-600">Teacher:</span>
                                  <span className="font-medium text-gray-900 truncate">{booking.teacher}</span>
                                </div>
                              )}
                              {booking.serviceType && (
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3 text-gray-500" />
                                  <span className="text-gray-600">Service:</span>
                                  <span className="font-medium text-gray-900 truncate">{booking.serviceType}</span>
                                </div>
                              )}

                              {/* Day & Venue */}
                              {booking.dayOfWeek && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3 text-gray-500" />
                                  <span className="text-gray-600">Day:</span>
                                  <span className="font-medium text-gray-900">{booking.dayOfWeek}</span>
                                </div>
                              )}
                              {booking.venue && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3 text-gray-500" />
                                  <span className="text-gray-600">Location:</span>
                                  <span className="font-medium text-gray-900 truncate">{booking.venue}</span>
                                </div>
                              )}

                              {/* Slot ID (if available) */}
                              {booking.scheduleSlotId && (
                                <div className="flex items-center space-x-1 col-span-2">
                                  <div className="w-3 h-3 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-gray-600">#</span>
                                  </div>
                                  <span className="text-gray-600">Slot ID:</span>
                                  <span className="font-mono text-xs text-gray-700">{booking.scheduleSlotId}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );

  /**
   * RENDER PAYMENT STATUS
   * ---------------------
   * Shows payment processing status
   */
  const renderPaymentStatus = () => {
    if (paymentStatus === 'idle') return null;

    const statusConfig = {
      processing: {
        message: 'Processing payment...',
        color: 'text-blue-600',
        icon: '⏳'
      },
      success: {
        message: 'Payment successful! Redirecting...',
        color: 'text-green-600',
        icon: '✅'
      },
      error: {
        message: 'Payment failed. Please try again.',
        color: 'text-red-600',
        icon: '❌'
      }
    };

    const config = statusConfig[paymentStatus];

    return (
      <div className={`text-center p-4 rounded-lg bg-gray-50 border ${config.color}`}>
        <div className="text-2xl mb-2">{config.icon}</div>
        <p className="font-medium">{config.message}</p>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  const totalPrice = getTotalPrice();
  const validation = validateOrder();

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment
        </h2>
        <p className="text-gray-600">
          Review your order and complete your purchase
        </p>
      </div>

      {/* Payment Status */}
      {renderPaymentStatus()}

      {/* Main Payment Interface */}
      {paymentStatus !== 'success' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Column 1: User Info and Payment Options */}
          <div className="space-y-6">
            {/* Customer Information Section */}
            {customerData && (
              <Card className="unified-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="unified-card__title flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Customer Information
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditCustomerInfo}
                      className="flex items-center space-x-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium text-gray-900">
                          {customerData.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-gray-900">
                          {customerData.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium text-gray-900">
                          {customerData.phone ? `${customerData.countryCode} ${customerData.phone}` : 'Not provided'}
                        </span>
                      </div>
                      {/* Address Information - when available */}
                      {(customerData as any)?.address && (
                        <div className="flex items-start space-x-2 md:col-span-2">
                          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                          <div className="flex-1">
                            <span className="text-gray-600">Address:</span>
                            <div className="font-medium text-gray-900">
                              {(customerData as any).address}
                              {(customerData as any)?.city && `, ${(customerData as any).city}`}
                              {(customerData as any)?.country && `, ${(customerData as any).country}`}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Options */}
            <div>
            {validation.isValid ? (
              <Card className="unified-card">
                <CardHeader>
                  <CardTitle className="unified-card__title">Payment Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Disabled Payment Forms */}
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg opacity-60">
                        <div className="flex items-center space-x-3 mb-3">
                          <CreditCard className="w-6 h-6 text-gray-500" />
                          <h4 className="font-medium text-gray-700">Credit/Debit Card</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Payment forms are temporarily disabled
                        </p>
                      </div>

                      <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg opacity-60">
                        <div className="flex items-center space-x-3 mb-3">
                          <CreditCard className="w-6 h-6 text-gray-500" />
                          <h4 className="font-medium text-gray-700">Bank Transfer</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Bank transfer option is temporarily disabled
                        </p>
                      </div>
                    </div>

                    {/* Pay Later Option */}
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <Clock className="w-6 h-6 text-orange-500" />
                        <h4 className="font-medium text-gray-900">Pay Later</h4>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">
                        Complete your order now and pay later. We will contact you to arrange payment.
                      </p>

                      {/* Terms Acceptance */}
                      <div className="mb-4">
                        <label className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">
                            I agree to the{' '}
                            <button
                              onClick={() => setShowTermsModal(true)}
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              Terms and Conditions
                            </button>
                          </span>
                        </label>
                      </div>

                      <button
                        onClick={handlePayLater}
                        disabled={!termsAccepted}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                          termsAccepted
                            ? 'bg-orange-600 text-white hover:bg-orange-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Clock className="w-5 h-5" />
                        <span>Pay Later</span>
                      </button>

                      {!termsAccepted && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Please accept the Terms and Conditions to proceed
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-800 font-medium">
                  ⚠️ Cannot proceed with payment
                </p>
                <p className="text-red-600 text-sm mt-1">
                  {validation.error}
                </p>
              </div>
            )}

            {/* Validation Error Display */}
            {!validation.isValid && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  ⚠️ {validation.error}
                </p>
              </div>
            )}
            </div>
          </div>

          {/* Column 2: Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div>
              {renderOrderSummary()}
            </div>
          </div>
        </div>
      )}

      {/* Post-Payment Success State */}
      {paymentStatus === 'success' && orderData && (
        <div className="text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              🎉 Order Confirmed!
            </h3>
            <p className="text-green-700 mb-4">
              Your order has been confirmed. We will contact you to arrange payment.
            </p>
            <div className="text-sm text-green-600">
              <p>Order #{orderData.orderNumber}</p>
              <p>Total: {cartItems.length > 0 && cartItems[0].currency} {orderData.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Terms and Conditions Modal */}
      <TermsAndConditionsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleTermsAccept}
        language="en"
      />
    </div>
  );
}
