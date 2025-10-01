'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Package,
  ShoppingCart,
  User,
  MapPin,
  CreditCard,
  FileText,
  Calendar,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/AppShell';
import { useCart } from '@/store/appStore';
import { useLanguage, useTranslations } from '@/hooks/useTranslations';
import { defaultTranslations } from '@/lib/data/translations';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'product' | 'package';
  image?: string;
  sessions?: number;
  duration?: number;
  packageType?: string;
}

interface BookingDetails {
  id: string;
  selectedDate: string;
  selectedTime: string;
  teacher?: string;
  serviceType?: string;
  venue?: string;
  dayOfWeek: string;
  scheduleSlotId: string;
}


interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  shippingStatus: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  // Billing document fields
  billingDocumentType?: string;
  dni?: string;
  ruc?: string;
  companyName?: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  currency: string;
  createdAt: string;
  shippingAddress?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderItems: OrderItem[];
  bookingDetails?: BookingDetails[];
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart();

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

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setError('No order ID provided');
      setLoading(false);
    }
  }, [orderId]);

  // Clear cart when order confirmation page loads
  useEffect(() => {
    console.log('🧹 Clearing cart after order confirmation');
    clearCart();
  }, [clearCart]);

  const fetchOrderDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.error || 'Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'S/.') => {
    const currencyCode = currency.toUpperCase();

    // Special handling for Peruvian Soles - display as S/.
    if (currencyCode === 'S/.') {
      return `S/. ${amount.toFixed(2)}`;
    }

    // For other currencies, use standard Intl formatting
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatBillingDocument = (order: OrderDetails) => {
    if (!order.billingDocumentType) return getTranslation('notSpecified', 'Not specified');
    
    switch (order.billingDocumentType) {
      case 'boleta':
        return `Boleta (DNI: ${order.dni || getTranslation('notProvided', 'Not provided')})`;
      case 'boleta_simple':
        return 'Boleta Simple';
      case 'factura':
        return `Factura (RUC: ${order.ruc || getTranslation('notProvided', 'Not provided')}${order.companyName ? ` - ${order.companyName}` : ''})`;
      default:
        return order.billingDocumentType;
    }
  };


  if (loading) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 mx-auto mb-4" style={{ borderColor: 'color-mix(in srgb, var(--color-primary-500) 25%, transparent)', borderTopColor: 'var(--color-primary-500)' }}></div>
            <p className="text-muted-foreground">{getTranslation('loadingOrderDetails', 'Loading order details...')}</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !order) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'color-mix(in srgb, var(--color-status-error) 12%, transparent)' }}>
              <CheckCircle className="w-8 h-8 text-[var(--color-status-error)]" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-foreground">{getTranslation('orderNotFound', 'Order Not Found')}</h1>
            <p className="mb-6 text-muted-foreground">{error || getTranslation('orderNotFoundDesc', 'The order you are looking for does not exist.')}</p>
            <Button
              onClick={() => window.location.href = '/'}
              className="text-primary-foreground bg-primary"
            >
              {getTranslation('returnHome', 'Return Home')}
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell key={language}>
      {/* No step indicators - clean order confirmation page */}
      <div className="min-h-screen py-8 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'color-mix(in srgb, var(--color-status-success) 12%, transparent)' }}>
              <CheckCircle className="w-10 h-10 text-[var(--color-status-success)]" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              {order.paymentStatus === 'PENDING' ? getTranslation('orderCreated', 'Order Created!') : getTranslation('title', 'Order Confirmed!')}
            </h1>
            <p className="text-xl mb-2 text-muted-foreground">
              {getTranslation('thankYou', 'Thank you for your')} {order.paymentStatus === 'PENDING' ? getTranslation('order', 'order') : getTranslation('purchase', 'purchase')}, {order.customerName}!
            </p>
            <p className="text-muted-foreground">
              {getTranslation('orderNumber', 'Order')} #{order.orderNumber} • {formatDate(order.createdAt)}
            </p>
            {order.paymentStatus === 'PENDING' && (
              <div className="mt-4 p-4 rounded-lg" style={{ background: 'color-mix(in srgb, var(--color-status-warning) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--color-status-warning) 25%, transparent)' }}>
                <p className="font-medium" style={{ color: 'color-mix(in srgb, var(--color-status-warning) 85%, black)' }}>{getTranslation('paymentPending', 'Payment Pending')}</p>
                <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--color-status-warning) 75%, black)' }}>
                  {getTranslation('paymentPendingDesc', 'You\'ll receive payment instructions via email shortly. Your order is confirmed.')}
                </p>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
{getTranslation('orderItems', 'Order Items')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.orderItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 border border-border rounded-lg"
                      >
                        <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-secondary">
                          {item.type === 'package' ? (
                            <Package className="w-8 h-8 text-primary" />
                          ) : (
                            <ShoppingCart className="w-8 h-8 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
                          <p className="text-muted-foreground">
                            {item.type === 'package' ? getTranslation('yogaPackage', 'Yoga Package') : getTranslation('product', 'Product')}
                            {item.sessions && ` • ${item.sessions} ${getTranslation('sessions', 'sessions')}`}
                            {item.duration && ` • ${item.duration} min each`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {getTranslation('quantity', 'Quantity')}: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg text-foreground">
                            {formatCurrency(item.price * item.quantity, order.currency)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.price, order.currency)} {getTranslation('each', 'each')}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Booking Details */}
              {order.bookingDetails && order.bookingDetails.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {getTranslation('scheduledClasses', 'Scheduled Classes')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.bookingDetails.map((booking, index) => (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-accent-500) 12%, transparent)' }}>
                            <Calendar className="w-8 h-8 text-[var(--color-accent-500)]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-foreground">
                              {booking.serviceType || getTranslation('yogaClass', 'Yoga Class')}
                            </h3>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {new Date(booking.selectedDate).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })} at {booking.selectedTime}
                              </p>
                              {booking.teacher && (
                                <p className="flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  {booking.teacher}
                                </p>
                              )}
                              {booking.venue && (
                                <p className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  {booking.venue}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
{getTranslation('customerInfo', 'Customer Information')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{getTranslation('name', 'Name')}</p>
                      <p className="font-medium text-foreground">{order.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{getTranslation('email', 'Email')}</p>
                      <p className="font-medium text-foreground">{order.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{getTranslation('phone', 'Phone')}</p>
                      <p className="font-medium text-foreground">{order.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{getTranslation('orderStatus', 'Order Status')}</p>
                      <p className="font-medium capitalize text-foreground">{order.status.toLowerCase()}</p>
                    </div>
                  </div>
                  
                  {/* Billing Document Information */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">{getTranslation('billingDocument', 'Billing Document')}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatBillingDocument(order)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
{getTranslation('shippingAddress', 'Shipping Address')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                    <p className="font-medium text-foreground">{order.shippingAddress.address}</p>
                    <p className="text-muted-foreground">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                    <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    {getTranslation('orderSummary', 'Order Summary')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{getTranslation('subtotal', 'Subtotal')}</span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(order.subtotal, order.currency)}
                      </span>
                    </div>
                    {order.taxAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IGV (18%)</span>
                        <span className="font-medium text-foreground">
                          {formatCurrency(order.taxAmount, order.currency)}
                        </span>
                      </div>
                    )}
                    {order.shippingAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{getTranslation('shipping', 'Shipping')}</span>
                        <span className="font-medium text-foreground">
                          {formatCurrency(order.shippingAmount, order.currency)}
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-semibold text-foreground">
                        <span>{getTranslation('total', 'Total')}</span>
                        <span className="text-primary">
                          {formatCurrency(order.total, order.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>


              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => window.location.href = '/schedule'}
                  variant="outline"
                  className="w-full"
                >
                  {getTranslation('bookASession', 'Book a Session')}
                </Button>
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="w-full"
                >
{getTranslation('continueShopping', 'Continue Shopping')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}