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
import { useCart, useAppStore, useShipping, useOrder, useTermsUI } from '@/store/appStore';
import { CreditCard, Clock, User, MapPin, Calendar, CheckCircle, AlertCircle, Mail, Phone, Edit } from 'lucide-react';
import { LyraEmbeddedForm } from '@/components/payment/LyraEmbeddedForm';

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
  const { items: cartItems, getTotalPrice, clearCart } = useCart();

  /**
   * CUSTOMER DATA STATE
   * -------------------
   * Access to stored customer data from previous steps
   */
  const { customerData } = useAppStore();

  /**
   * SHIPPING DATA STATE
   * -------------------
   * Access to stored shipping data from previous steps
   */
  const { shippingData } = useShipping();

  /**
   * PAYMENT STATE
   * -------------
   * Tracks payment processing status
   */
  const [paymentStatus, setPaymentStatus] = React.useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const { orderData, setOrderData } = useOrder();
  const [termsAccepted, setTermsAccepted] = React.useState(true);
  const { openTerms, closeTerms } = useTermsUI();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<'lyra' | 'paylater' | null>(null);

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

    // Check for duplicate time slots within each package individually
    const packageItems = cartItems.filter(item => item.type === 'package');
    if (packageItems.length > 0) {
      for (const pkg of packageItems) {
        const packageBookings = pkg.bookingDetails || [];
        
        // Only check for duplicates if this package has bookings
        if (packageBookings.length > 0) {
          const timeSlots = packageBookings.map(booking =>
            `${booking.selectedDate}-${booking.selectedTime}`
          );
          const uniqueTimeSlots = new Set(timeSlots);

          // Check for duplicates within this specific package
          if (timeSlots.length !== uniqueTimeSlots.size) {
            return {
              isValid: false,
              error: `Duplicate time slots detected in package "${pkg.name}". Please remove duplicates before checkout.`
            };
          }
        }
      }
    }

    return { isValid: true };
  };

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * EXTRACT SCHEDULE DETAILS FROM CART ITEMS
   * ----------------------------------------
   * Converts bookingDetails from cart items to scheduleDetails format
   * expected by the order creation API
   */
  const extractScheduleDetails = () => {
    const scheduleDetails: any[] = [];
    
    console.log('🔍 Extracting schedule details from cart items:', cartItems);
    console.log('🔍 Cart items structure:', cartItems.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      hasBookingDetails: !!item.bookingDetails,
      bookingDetailsCount: item.bookingDetails?.length || 0,
      bookingDetails: item.bookingDetails
    })));
    
    cartItems.forEach(item => {
      console.log('🔍 Processing cart item:', item.name, 'type:', item.type);
      if (item.type === 'package' && item.bookingDetails && Array.isArray(item.bookingDetails)) {
        console.log('🔍 Item has bookingDetails:', item.bookingDetails);
        item.bookingDetails.forEach((booking, index) => {
          console.log(`🔍 Processing booking ${index}:`, booking);
          if (booking.scheduleSlotId) {
            const scheduleDetail = {
              selectedDate: booking.selectedDate,
              selectedTime: booking.selectedTime,
              teacher: booking.teacher,
              serviceType: booking.serviceType,
              venue: booking.venue,
              dayOfWeek: booking.dayOfWeek,
              scheduleSlotId: booking.scheduleSlotId
            };
            console.log('✅ Adding schedule detail:', scheduleDetail);
            scheduleDetails.push(scheduleDetail);
          } else {
            console.log('❌ Booking missing scheduleSlotId:', booking);
          }
        });
      } else {
        console.log('❌ Item not a package or no bookingDetails:', {
          isPackage: item.type === 'package',
          hasBookingDetails: item.bookingDetails && Array.isArray(item.bookingDetails),
          bookingDetails: item.bookingDetails
        });
      }
    });
    
    console.log('📅 Final extracted schedule details:', scheduleDetails);
    return scheduleDetails;
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
  const _handlePaymentSuccess = async (paymentIntentId: string) => {
    console.log('💳 Payment successful:', paymentIntentId);

    setPaymentStatus('success');

    try {
      // Extract schedule details from cart items
      const scheduleDetails = extractScheduleDetails();
      
      // Debug: Log cart items to verify they contain bookingDetails
      console.log('🔍 Cart items being sent to API:', JSON.stringify(cartItems, null, 2));
      console.log('🔍 Extracted schedule details:', scheduleDetails);
      
      // If no schedule details were extracted, log a warning
      if (scheduleDetails.length === 0) {
        console.warn('⚠️ No schedule details extracted from cart items!');
        console.warn('⚠️ This means bookings will not be created in the database.');
        console.warn('⚠️ Cart items structure:', cartItems.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type,
          hasBookingDetails: !!item.bookingDetails,
          bookingDetailsCount: item.bookingDetails?.length || 0
        })));
      }
      
      // Create order in the database
      const orderResponse = await fetch('/api/orders/create-unified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerInfo: customerData || {
            name: 'Customer',
            email: 'customer@example.com',
            phone: '+51999999999',
            countryCode: 'PE',
            language: 'en'
          },
          shippingAddress: shippingData ? {
            address: shippingData.address,
            city: shippingData.city,
            state: shippingData.state || '',
            zipCode: shippingData.postalCode,
            country: shippingData.country
          } : null,
          items: cartItems,
          totalAmount: getTotalPrice(),
          currency: 'S/.',
          paymentMethod: 'stripe',
          paymentIntentId: paymentIntentId,
          scheduleDetails: scheduleDetails.length > 0 ? scheduleDetails : undefined
        })
      });

      if (!orderResponse.ok) {
        // Get more detailed error information
        let errorMessage = 'Failed to create order';
        try {
          // Check if response has content before trying to parse JSON
          const responseText = await orderResponse.text();
          console.error('❌ Raw error response:', responseText);
          
          if (responseText && responseText.trim()) {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorData.message || errorMessage;
            const errorDetails = errorData.details || errorData.errorType;
            console.error('❌ Order creation error details:', errorData);
            
            // Provide more specific error message based on status code
            if (orderResponse.status === 500) {
              errorMessage = errorDetails ? 
                `Server error: ${errorDetails}` : 
                'Server error occurred while creating order. Please try again or contact support.';
            }
          } else {
            console.error('❌ Empty error response body');
            errorMessage = `Failed to create order (HTTP ${orderResponse.status}: ${orderResponse.statusText})`;
          }
        } catch (parseError) {
          console.error('❌ Could not parse error response:', parseError);
          errorMessage = `Failed to create order (HTTP ${orderResponse.status}: ${orderResponse.statusText})`;
        }
        throw new Error(errorMessage);
      }

      const orderResult = await orderResponse.json();
      console.log('✅ Order created:', orderResult);

      // Create order data for confirmation with real order number
      const orderInfo: OrderData = {
        orderNumber: orderResult.orderNumber,
        total: getTotalPrice(),
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      setOrderData(orderInfo);

      // Clear cart immediately after successful payment
      console.log('🧹 Clearing cart immediately after successful payment');
      clearCart();

      // Call success callback
      onPaymentSuccess?.(paymentIntentId, orderInfo);

      // Show success message
      toast.success('Payment successful! Processing your order...');

      // Navigate to confirmation after a brief delay
      setTimeout(() => {
        goToNextStep();
      }, 1000);

    } catch (error) {
      console.error('❌ Error creating order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Payment successful but failed to create order: ${errorMessage}. Please contact support.`);
      
      // Still set order data with pending status
      const orderInfo: OrderData = {
        orderNumber: 'PENDING',
        total: getTotalPrice(),
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      setOrderData(orderInfo);
      
      // Navigate to confirmation anyway
      setTimeout(() => {
        goToNextStep();
      }, 1000);
    }
  };

  /**
   * HANDLE PAYMENT ERROR
   * --------------------
   * Processes payment failure
   *
   * @param error - Payment error details
   */
  const _handlePaymentError = (error: any) => {
    console.error('❌ Payment failed:', error);

    setPaymentStatus('error');

    // Call error callback
    onPaymentError?.(error);

    // Show error message
    toast.error('Payment failed. Please try again.');
  };

  /**
   * HANDLE LYRA PAYMENT SUCCESS
   * ---------------------------
   * Process successful Lyra payment and create order
   */
  const handleLyraPaymentSuccess = async (paymentData: any) => {
    try {
      setPaymentStatus('processing');
      console.log('✅ Lyra payment successful:', paymentData);

      // Extract schedule details from cart items
      const scheduleDetails = extractScheduleDetails();

      // Create order with Lyra payment details
      const orderResponse = await fetch('/api/orders/create-unified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerInfo: customerData,
          shippingAddress: shippingData,
          items: cartItems,
          totalAmount: getTotalPrice(),
          currency: cartItems.length > 0 ? cartItems[0].currency : 'PEN',
          paymentMethod: 'lyra',
          lyraTransactionId: paymentData.transactionUuid,
          scheduleDetails: scheduleDetails.length > 0 ? scheduleDetails : undefined
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order after payment');
      }

      const orderResult = await orderResponse.json();
      
      const orderInfo: OrderData = {
        orderNumber: orderResult.orderNumber,
        total: getTotalPrice(),
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      setOrderData(orderInfo);
      setPaymentStatus('success');
      clearCart();

      toast.success('Payment successful! Order confirmed.');

      setTimeout(() => {
        goToNextStep();
      }, 1500);

    } catch (err) {
      console.error('❌ Error processing Lyra payment:', err);
      setPaymentStatus('error');
      toast.error('Failed to process payment. Please contact support.');
    }
  };

  /**
   * HANDLE LYRA PAYMENT ERROR
   * -------------------------
   * Handle Lyra payment errors
   */
  const handleLyraPaymentError = (error: any) => {
    console.error('❌ Lyra payment error:', error);
    setPaymentStatus('error');
    toast.error(error?.message || 'Payment failed. Please try again.');
  };

  /**
   * HANDLE PAY LATER
   * ----------------
   * Processes pay later option
   */
  const handlePayLater = async () => {
    if (!termsAccepted) {
      openTerms();
      return;
    }

    console.log('💳 Pay Later selected');
    setPaymentStatus('processing');

    try {
      // Extract schedule details from cart items
      const scheduleDetails = extractScheduleDetails();
      
      // Debug: Log cart items to verify they contain bookingDetails
      console.log('🔍 Cart items being sent to API:', JSON.stringify(cartItems, null, 2));
      console.log('🔍 Extracted schedule details:', scheduleDetails);
      
      // If no schedule details were extracted, log a warning
      if (scheduleDetails.length === 0) {
        console.warn('⚠️ No schedule details extracted from cart items!');
        console.warn('⚠️ This means bookings will not be created in the database.');
        console.warn('⚠️ Cart items structure:', cartItems.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type,
          hasBookingDetails: !!item.bookingDetails,
          bookingDetailsCount: item.bookingDetails?.length || 0
        })));
      }
      
      // Create order in the database
      const orderResponse = await fetch('/api/orders/create-unified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerInfo: customerData || {
            name: 'Customer',
            email: 'customer@example.com',
            phone: '+51999999999',
            countryCode: 'PE',
            language: 'en'
          },
          shippingAddress: shippingData ? {
            address: shippingData.address,
            city: shippingData.city,
            state: shippingData.state || '',
            zipCode: shippingData.postalCode,
            country: shippingData.country
          } : null,
          items: cartItems,
          totalAmount: getTotalPrice(),
          currency: 'S/.',
          paymentMethod: 'pay_later',
          scheduleDetails: scheduleDetails.length > 0 ? scheduleDetails : undefined
        })
      });

      if (!orderResponse.ok) {
        // Get more detailed error information
        let errorMessage = 'Failed to create order';
        try {
          // Check if response has content before trying to parse JSON
          const responseText = await orderResponse.text();
          console.error('❌ Raw error response:', responseText);
          
          if (responseText && responseText.trim()) {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorData.message || errorMessage;
            const errorDetails = errorData.details || errorData.errorType;
            console.error('❌ Order creation error details:', errorData);
            
            // Provide more specific error message based on status code
            if (orderResponse.status === 500) {
              errorMessage = errorDetails ? 
                `Server error: ${errorDetails}` : 
                'Server error occurred while creating order. Please try again or contact support.';
            }
          } else {
            console.error('❌ Empty error response body');
            errorMessage = `Failed to create order (HTTP ${orderResponse.status}: ${orderResponse.statusText})`;
          }
        } catch (parseError) {
          console.error('❌ Could not parse error response:', parseError);
          errorMessage = `Failed to create order (HTTP ${orderResponse.status}: ${orderResponse.statusText})`;
        }
        throw new Error(errorMessage);
      }

      const orderResult = await orderResponse.json();
      console.log('✅ Order created:', orderResult);

      // Create order data for confirmation with real order number
      const orderInfo: OrderData = {
        orderNumber: orderResult.orderNumber,
        total: getTotalPrice(),
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      setOrderData(orderInfo);

      // Clear cart immediately after order confirmation
      console.log('🧹 Clearing cart immediately after order confirmation');
      clearCart();

      // Show success message
      toast.success('Order confirmed! You will be contacted for payment.');

      // Navigate to confirmation immediately for faster user experience
      setTimeout(() => {
        goToNextStep();
      }, 1000);

    } catch (error) {
      console.error('❌ Error creating order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to create order: ${errorMessage}. Please contact support.`);
      
      // Still set order data with pending status
      const orderInfo: OrderData = {
        orderNumber: 'PENDING',
        total: getTotalPrice(),
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      setOrderData(orderInfo);
      
      // Navigate to confirmation anyway
      setTimeout(() => {
        goToNextStep();
      }, 1000);
    }
  };

  /**
   * HANDLE TERMS ACCEPTANCE
   * -----------------------
   * Processes terms and conditions acceptance
   */
  const handleTermsAccept = () => {
    setTermsAccepted(true);
    closeTerms();
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
            <h4 className="font-semibold text-foreground mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-[var(--color-status-success)]" />
              Price Details
            </h4>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="space-y-2 text-sm">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium text-foreground">
                    {isClient && cartItems.length > 0 && cartItems[0].currency} {isClient ? (getTotalPrice() / 1.18).toFixed(2) : '0.00'}
                  </span>
                </div>
                
                {/* IGV (18%) */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">IGV (18%):</span>
                  <span className="font-medium text-foreground">
                    {isClient && cartItems.length > 0 && cartItems[0].currency} {isClient ? (getTotalPrice() - (getTotalPrice() / 1.18)).toFixed(2) : '0.00'}
                  </span>
                </div>
                
                {/* Total */}
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-lg font-semibold text-foreground">Total:</span>
                  <span className="text-xl font-bold text-primary">
                    {isClient && cartItems.length > 0 && cartItems[0].currency} {isClient ? getTotalPrice().toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>


          {/* Packages and Bookings */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Packages & Bookings
            </h4>
            <div className="space-y-4">
              {isClient && cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-foreground">{item.name}</h5>
                    <span className="font-semibold text-primary">
                      {isClient && item.currency} {isClient ? (item.price * item.quantity).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  
                  {item.type === 'package' && item.bookingDetails && item.bookingDetails.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground mb-3">
                        Booked Sessions ({item.bookingDetails.length}):
                      </p>
                      <div className="space-y-2">
                        {item.bookingDetails.map((booking, bookingIndex) => (
                          <div key={bookingIndex} className="rounded-lg p-3" style={{ background: 'color-mix(in srgb, var(--color-accent-500) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--color-accent-500) 25%, transparent)' }}>
                            {/* Compact Session Header */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-[var(--color-accent-500)]" />
                                <span className="text-sm font-semibold text-foreground">
                                  Session {bookingIndex + 1}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3 text-[var(--color-status-success)]" />
                                <span className="text-xs text-[var(--color-status-success)] font-medium">Ready</span>
                              </div>
                            </div>

                            {/* Compact Session Details - Two Column Layout */}
                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                              {/* Date & Time */}
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>Date:</span>
                                <span className="font-medium text-foreground">{booking.selectedDate}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>Time:</span>
                                <span className="font-medium text-foreground">{booking.selectedTime}</span>
                              </div>

                              {/* Teacher & Service */}
                              {booking.teacher && (
                                <div className="flex items-center space-x-1">
                                  <User className="w-3 h-3" />
                                  <span>Teacher:</span>
                                  <span className="font-medium text-foreground truncate">{booking.teacher}</span>
                                </div>
                              )}
                              {booking.serviceType && (
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>Service:</span>
                                  <span className="font-medium text-foreground truncate">{booking.serviceType}</span>
                                </div>
                              )}

                              {/* Day & Venue */}
                              {booking.dayOfWeek && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Day:</span>
                                  <span className="font-medium text-foreground">{booking.dayOfWeek}</span>
                                </div>
                              )}
                              {booking.venue && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>Location:</span>
                                  <span className="font-medium text-foreground truncate">{booking.venue}</span>
                                </div>
                              )}

                              {/* Slot ID (if available) */}
                              {booking.scheduleSlotId && (
                                <div className="flex items-center space-x-1 col-span-2">
                                  <div className="w-3 h-3 bg-muted rounded-full flex items-center justify-center">
                                    <span className="text-xs text-muted-foreground">#</span>
                                  </div>
                                  <span>Slot ID:</span>
                                  <span className="font-mono text-xs text-foreground">{booking.scheduleSlotId}</span>
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
        color: 'text-[var(--color-status-info)]',
        icon: '⏳'
      },
      success: {
        message: 'Payment successful! Redirecting...',
        color: 'text-[var(--color-status-success)]',
        icon: '✅'
      },
      error: {
        message: 'Payment failed. Please try again.',
        color: 'text-[var(--color-status-error)]',
        icon: '❌'
      }
    };

    const config = statusConfig[paymentStatus];

    return (
      <div className={`text-center p-4 rounded-lg bg-secondary border border-border ${config.color}`}>
        <div className="text-2xl mb-2">{config.icon}</div>
        <p className="font-medium">{config.message}</p>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  const _totalPrice = getTotalPrice();
  const validation = validateOrder();
  
  // Client-side only state to prevent hydration mismatch
  const [isClient, setIsClient] = React.useState(false);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Payment
        </h2>
        <p className="text-muted-foreground">
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
                      className="flex items-center space-x-1 text-[var(--color-accent-500)] border-[var(--color-accent-500)] hover:bg-[var(--color-accent-500)]/10"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-secondary p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium text-foreground">
                          {customerData.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium text-foreground">
                          {customerData.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium text-foreground">
                          {customerData.phone ? `${customerData.countryCode} ${customerData.phone}` : 'Not provided'}
                        </span>
                      </div>
                      {/* Shipping Address Information - when available */}
                      {shippingData && (
                        <div className="flex items-start space-x-2 md:col-span-2">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <span className="text-muted-foreground">Shipping Address:</span>
                            <div className="font-medium text-foreground">
                              {shippingData.address}
                              {shippingData.city && `, ${shippingData.city}`}
                              {shippingData.country && `, ${shippingData.country}`}
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
                    {/* Payment Method Selection */}
                    <div className="space-y-3">
                      {/* Lyra/Izipay Payment Option */}
                      <div 
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedPaymentMethod === 'lyra'
                            ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
                            : 'border-border hover:border-[var(--color-primary-300)]'
                        }`}
                        onClick={() => setSelectedPaymentMethod('lyra')}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <input
                            type="radio"
                            checked={selectedPaymentMethod === 'lyra'}
                            onChange={() => setSelectedPaymentMethod('lyra')}
                            className="w-4 h-4 text-[var(--color-primary-500)]"
                          />
                          <CreditCard className="w-6 h-6 text-[var(--color-primary-500)]" />
                          <h4 className="font-medium text-foreground">Credit/Debit Card</h4>
                        </div>
                        <p className="text-sm text-muted-foreground ml-7">
                          Pay securely with your credit or debit card via Lyra/Izipay
                        </p>
                      </div>

                      {/* Pay Later Option */}
                      <div 
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedPaymentMethod === 'paylater'
                            ? 'border-[var(--color-accent-500)] bg-[var(--color-accent-50)]'
                            : 'border-border hover:border-[var(--color-accent-300)]'
                        }`}
                        onClick={() => setSelectedPaymentMethod('paylater')}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <input
                            type="radio"
                            checked={selectedPaymentMethod === 'paylater'}
                            onChange={() => setSelectedPaymentMethod('paylater')}
                            className="w-4 h-4 text-[var(--color-accent-500)]"
                          />
                          <Clock className="w-6 h-6 text-[var(--color-accent-500)]" />
                          <h4 className="font-medium text-foreground">Pay Later</h4>
                        </div>
                        <p className="text-sm text-muted-foreground ml-7">
                          Complete your order now and pay later. We will contact you to arrange payment.
                        </p>
                      </div>
                    </div>

                    {/* Lyra Payment Form */}
                    {selectedPaymentMethod === 'lyra' && (
                      <div className="border-t pt-4">
                        <LyraEmbeddedForm
                          amount={getTotalPrice()}
                          currency="PEN"
                          orderId={`ORDER-${Date.now()}`}
                          customerEmail={customerData?.email || ''}
                          customerPhone={customerData?.phone}
                          customerFirstName={customerData?.name?.split(' ')[0]}
                          customerLastName={customerData?.name?.split(' ').slice(1).join(' ')}
                          onSuccess={handleLyraPaymentSuccess}
                          onError={handleLyraPaymentError}
                          displayMode="embedded"
                        />
                      </div>
                    )}

                    {/* Pay Later Form */}
                    {selectedPaymentMethod === 'paylater' && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Complete your order now and pay later. We will contact you to arrange payment.
                      </p>

                      {/* Terms Acceptance */}
                      <div className="mb-4">
                        <label className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
                          />
                          <span className="text-sm text-foreground">
                            I agree to the{' '}
                            <button
                              onClick={() => openTerms()}
                              className="text-[var(--color-accent-500)] hover:text-[var(--color-accent-600)] underline"
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
                            ? 'bg-[var(--color-accent-500)] text-white hover:bg-[var(--color-accent-600)]'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        <Clock className="w-5 h-5" />
                        <span>Complete Order (Pay Later)</span>
                      </button>

                      {!termsAccepted && (
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Please accept the Terms and Conditions to proceed
                        </p>
                      )}
                    </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="p-4 rounded-lg text-center" style={{ background: 'color-mix(in srgb, var(--color-status-error) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--color-status-error) 25%, transparent)' }}>
                <AlertCircle className="w-8 h-8 text-[var(--color-status-error)] mx-auto mb-2" />
                <p className="font-medium" style={{ color: 'color-mix(in srgb, var(--color-status-error) 85%, black)' }}>
                  ⚠️ Cannot proceed with payment
                </p>
                <p className="text-sm mt-1" style={{ color: 'color-mix(in srgb, var(--color-status-error) 75%, black)' }}>
                  {validation.error}
                </p>
              </div>
            )}

            {/* Validation Error Display */}
            {!validation.isValid && (
              <div className="mt-4 p-3 rounded-lg" style={{ background: 'color-mix(in srgb, var(--color-status-error) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--color-status-error) 25%, transparent)' }}>
                <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--color-status-error) 85%, black)' }}>
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
          <div className="rounded-lg p-6" style={{ background: 'color-mix(in srgb, var(--color-status-success) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--color-status-success) 25%, transparent)' }}>
            <CheckCircle className="w-12 h-12 text-[var(--color-status-success)] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'color-mix(in srgb, var(--color-status-success) 85%, black)' }}>
              🎉 Order Confirmed!
            </h3>
            <p className="mb-4" style={{ color: 'color-mix(in srgb, var(--color-status-success) 75%, black)' }}>
              Your order has been confirmed. We will contact you to arrange payment.
            </p>
            <div className="text-sm text-[var(--color-status-success)]">
              <p>Order #{orderData.orderNumber}</p>
              <p>Total: {cartItems.length > 0 && cartItems[0].currency} {orderData.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Terms modal handled globally via AppShell */}
    </div>
  );
}
