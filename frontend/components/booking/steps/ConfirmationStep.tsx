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
import { CheckCircle, Download, Mail, Phone, Calendar, Package, Truck, User, Clock, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart, useAppStore, useOrder, useShipping } from '@/store/appStore';
import { useLanguage, useTranslations } from '@/hooks/useTranslations';
import { defaultTranslations } from '@/lib/data/translations';

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
  orderData: propOrderData,
  customerData: propCustomerData,
  shippingData: propShippingData
}: ConfirmationStepProps) {
  // ============================================================================
  // HOOKS AND STATE MANAGEMENT
  // ============================================================================

  /**
   * TRANSLATION HOOKS
   * -----------------
   * Access to language and translation system
   */
  const { language } = useLanguage();
  const { t } = useTranslations(undefined, language);
  
  // Use default translations directly to ensure checkout translations are always available
  const checkoutTranslations = defaultTranslations[language]?.checkout || defaultTranslations.en.checkout || {};
  const confirmationTranslations = checkoutTranslations.confirmation || {};

  // Helper function to get translations
  const getTranslation = (key: string, fallback: string = ''): string => {
    return (confirmationTranslations as Record<string, any>)[key] || fallback;
  };

  /**
   * ROUTER FOR NAVIGATION
   * --------------------
   * Access to Next.js router for navigation
   */
  const router = useRouter();

  /**
   * GLOBAL STORE DATA
   * -----------------
   * Access to global state data
   */
  const { orderData: globalOrderData } = useOrder();
  const { customerData: globalCustomerData } = useAppStore();
  const { shippingData: globalShippingData } = useShipping();

  // Use props if provided, otherwise fall back to global store
  const orderData = propOrderData || globalOrderData;
  const customerData = propCustomerData || globalCustomerData;
  const shippingData = propShippingData || globalShippingData;

  /**
   * CART STATE
   * ----------
   * Access to cart items for detailed booking information
   */
  const { items: cartItems } = useCart();

  /**
   * CUSTOMER DATA STATE
   * -------------------
   * Access to stored customer data from previous steps
   */
  const { customerData: storeCustomerData } = useAppStore();

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
            <CheckCircle className="w-5 h-5 text-[var(--color-status-success)] mr-2" />
{getTranslation('orderItems', 'Order Details')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong className="text-foreground">{getTranslation('orderNumber', 'Order Number')}:</strong>
                <p className="text-lg font-mono text-foreground">{orderData.orderNumber}</p>
              </div>
              <div>
                <strong className="text-foreground">{getTranslation('total', 'Total Amount')}:</strong>
                <p className="text-lg font-bold text-primary">S/ {orderData.total.toFixed(2)}</p>
              </div>
            </div>

            <div>
              <strong className="text-foreground mb-2 block">{getTranslation('orderItems', 'Items Purchased')}:</strong>
              <ul className="space-y-2">
                {orderData.items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center p-2 bg-secondary rounded">
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
            <Calendar className="w-5 h-5 text-[var(--color-accent-500)] mr-2" />
{getTranslation('yourBookings', 'Your Bookings')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {packageItems.map((item, itemIndex) => (
              <div key={itemIndex} className="border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-3 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  {item.name}
                </h4>

                <div className="space-y-2">
                  {item.bookingDetails?.map((booking, bookingIndex) => (
                    <div key={bookingIndex} className="rounded-lg p-3" style={{ background: 'color-mix(in srgb, var(--color-accent-500) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--color-accent-500) 25%, transparent)' }}>
                      {/* Compact Session Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-[var(--color-accent-500)]" />
                          <span className="text-sm font-semibold text-foreground">
                            {getTranslation('session', 'Session')} {bookingIndex + 1}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-[var(--color-status-success)]" />
                          <span className="text-xs text-[var(--color-status-success)] font-medium">Confirmed</span>
                        </div>
                      </div>

                      {/* Compact Session Details - Two Column Layout */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        {/* Date & Time */}
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{getTranslation('date', 'Date')}:</span>
                          <span className="font-medium text-foreground">{booking.selectedDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{getTranslation('time', 'Time')}:</span>
                          <span className="font-medium text-foreground">{booking.selectedTime}</span>
                        </div>

                        {/* Teacher & Service */}
                        {booking.teacher && (
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{getTranslation('teacher', 'Teacher')}:</span>
                            <span className="font-medium text-foreground truncate">{booking.teacher}</span>
                          </div>
                        )}
                        {booking.serviceType && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{getTranslation('service', 'Service')}:</span>
                            <span className="font-medium text-foreground truncate">{booking.serviceType}</span>
                          </div>
                        )}

                        {booking.venue && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{getTranslation('location', 'Location')}:</span>
                            <span className="font-medium text-foreground truncate">{booking.venue}</span>
                          </div>
                        )}

                        {/* Slot ID (if available) */}
                        {booking.scheduleSlotId && (
                          <div className="flex items-center space-x-1 col-span-2">
                            <div className="w-3 h-3 bg-muted rounded-full flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">#</span>
                            </div>
                            <span>{getTranslation('slotId', 'Slot ID')}:</span>
                            <span className="font-mono text-xs text-foreground">{booking.scheduleSlotId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">
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
    // Use store customer data if available, otherwise fall back to props
    const displayCustomerData = storeCustomerData || customerData;
    if (!displayCustomerData) return null;

    return (
      <Card className="unified-card">
        <CardHeader>
          <CardTitle className="unified-card__title flex items-center">
            <User className="w-5 h-5 text-[var(--color-accent-500)] mr-2" />
{getTranslation('customerInfo', 'Customer Information')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Name:</strong> {displayCustomerData.name}</p>
            <p><strong>Email:</strong> {displayCustomerData.email}</p>
            {displayCustomerData.phone && (
              <p><strong>Phone:</strong> {displayCustomerData.phone}</p>
            )}
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
            <Truck className="w-5 h-5 text-[var(--color-accent-500)] mr-2" />
{getTranslation('shippingAddress', 'Shipping Address')}
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
    <Card className="unified-card" style={{ background: 'color-mix(in srgb, var(--color-primary-500) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--color-primary-500) 20%, transparent)' }}>
      <CardHeader>
        <CardTitle className="unified-card__title text-foreground">
          {getTranslation('whatsNext', 'What\'s Next?')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-muted-foreground">
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">{getTranslation('emailConfirmation', 'Email Confirmation')}</p>
              <p className="text-sm">{getTranslation('emailConfirmationDesc', "You'll receive a confirmation email with your booking details and receipt.")}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">{getTranslation('sessionReminders', 'Session Reminders')}</p>
              <p className="text-sm">{getTranslation('sessionRemindersDesc', "We'll send you reminders 24 hours and 1 hour before each session.")}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">{getTranslation('questions', 'Questions?')}</p>
              <p className="text-sm">{getTranslation('contactSupport', 'Contact our support team if you need to make changes to your bookings.')}</p>
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
        {getTranslation('viewMyBookings', 'View My Bookings')}
      </Button>

      <Button
        onClick={handleStartNewBooking}
        className="flex items-center bg-green-600 hover:bg-green-700"
      >
        <Package className="w-4 h-4 mr-2" />
        {getTranslation('bookMoreSessions', 'Book More Sessions')}
      </Button>

      <Button
        onClick={handlePrintConfirmation}
        variant="outline"
        className="flex items-center"
      >
        <Download className="w-4 h-4 mr-2" />
        {getTranslation('printConfirmation', 'Print Confirmation')}
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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'color-mix(in srgb, var(--color-status-success) 12%, transparent)' }}>
          <CheckCircle className="w-8 h-8 text-[var(--color-status-success)]" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {getTranslation('title', 'Order Confirmed!')}
        </h2>
        <p className="text-muted-foreground text-lg">
          {getTranslation('thankYouPurchase', 'Thank you for your purchase. Your booking is confirmed.')}
        </p>
        {orderData?.orderNumber && (
          <p className="text-lg font-semibold text-foreground mt-2">
            {getTranslation('orderNumber', 'Order Number')}: {orderData.orderNumber}
          </p>
        )}
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

      
    </div>
  );
}
