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
import { toast } from 'sonner';
import { useBookingFlow } from '../hooks/useBookingFlow';
import { useCart } from '@/store/appStore';
import { StripeInlineForm } from '../../stripe/StripeInlineForm';

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
   * BOOKING FLOW STATE
   * ------------------
   * Access to flow navigation functions
   */
  const { goToNextStep } = useBookingFlow();

  /**
   * CART STATE
   * ----------
   * Access to cart items, pricing, and order operations
   */
  const { items: cartItems, getTotalPrice } = useCart();

  /**
   * PAYMENT STATE
   * -------------
   * Tracks payment processing status
   */
  const [paymentStatus, setPaymentStatus] = React.useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [orderData, setOrderData] = React.useState<OrderData | null>(null);

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


  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  /**
   * RENDER ORDER SUMMARY
   * --------------------
   * Displays the order summary with all items and total
   */
  const renderOrderSummary = () => (
    <Card className="unified-card">
      <CardHeader>
        <CardTitle className="unified-card__title">Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {cartItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>S/ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <div className="border-t pt-2 mt-4">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>S/ {getTotalPrice().toFixed(2)}</span>
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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment
        </h2>
        <p className="text-gray-600">
          Complete your purchase securely
        </p>
      </div>

      {/* Payment Status */}
      {renderPaymentStatus()}

      {/* Main Payment Interface */}
      {paymentStatus !== 'success' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div>
            {validation.isValid ? (
              <StripeInlineForm
                amount={totalPrice * 100} // Convert to cents
                currency="PEN"
                description="Wellness Package Purchase"
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
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

          {/* Order Summary */}
          <div>
            {renderOrderSummary()}
          </div>
        </div>
      )}

      {/* Post-Payment Success State */}
      {paymentStatus === 'success' && orderData && (
        <div className="text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              🎉 Payment Successful!
            </h3>
            <p className="text-green-700 mb-4">
              Your order has been processed successfully.
            </p>
            <div className="text-sm text-green-600">
              <p>Order #{orderData.orderNumber}</p>
              <p>Total: S/ {orderData.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Debug Information (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-8 p-4 bg-gray-50 rounded-lg">
          <summary className="cursor-pointer font-medium text-gray-700">
            Debug Information
          </summary>
          <pre className="mt-2 text-xs text-gray-600 overflow-auto">
            {JSON.stringify({
              paymentStatus,
              totalPrice,
              cartItemsCount: cartItems.length,
              validation,
              orderData
            }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
