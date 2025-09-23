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

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setError('No order ID provided');
      setLoading(false);
    }
  }, [orderId]);

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

  const formatCurrency = (amount: number, currency: string = 'PEN') => {
    const currencyCode = currency.toUpperCase();

    // Special handling for Peruvian Soles - display as S/.
    if (currencyCode === 'PEN') {
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
    if (!order.billingDocumentType) return 'Not specified';
    
    switch (order.billingDocumentType) {
      case 'boleta':
        return `Boleta (DNI: ${order.dni || 'Not provided'})`;
      case 'boleta_simple':
        return 'Boleta Simple';
      case 'factura':
        return `Factura (RUC: ${order.ruc || 'Not provided'}${order.companyName ? ` - ${order.companyName}` : ''})`;
      default:
        return order.billingDocumentType;
    }
  };


  if (loading) {
    return (
      <AppShell>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !order) {
    return (
      <AppShell>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Return Home
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {order.paymentStatus === 'PENDING' ? 'Order Created!' : 'Order Confirmed!'}
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Thank you for your {order.paymentStatus === 'PENDING' ? 'order' : 'purchase'}, {order.customerName}!
            </p>
            <p className="text-gray-500">
              Order #{order.orderNumber} • {formatDate(order.createdAt)}
            </p>
            {order.paymentStatus === 'PENDING' && (
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-orange-800 font-medium">Payment Pending</p>
                <p className="text-orange-700 text-sm">
                  You&apos;ll receive payment instructions via email shortly. Your order is confirmed.
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
                    Order Items
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
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          {item.type === 'package' ? (
                            <Package className="w-8 h-8 text-primary" />
                          ) : (
                            <ShoppingCart className="w-8 h-8 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-gray-600">
                            {item.type === 'package' ? 'Yoga Package' : 'Product'}
                            {item.sessions && ` • ${item.sessions} sessions`}
                            {item.duration && ` • ${item.duration} min each`}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">
                            {formatCurrency(item.price * item.quantity, order.currency)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(item.price, order.currency)} each
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
                      Scheduled Classes
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
                          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {booking.serviceType || 'Yoga Class'}
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600">
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
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{order.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{order.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{order.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order Status</p>
                      <p className="font-medium capitalize">{order.status.toLowerCase()}</p>
                    </div>
                  </div>
                  
                  {/* Billing Document Information */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <p className="text-sm font-medium text-gray-700">Billing Document</p>
                    </div>
                    <p className="text-sm text-gray-600">
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
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">{order.shippingAddress.address}</p>
                      <p className="text-gray-600">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                      <p className="text-gray-600">{order.shippingAddress.country}</p>
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
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        {formatCurrency(order.subtotal, order.currency)}
                      </span>
                    </div>
                    {order.taxAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">IGV (18%)</span>
                        <span className="font-medium">
                          {formatCurrency(order.taxAmount, order.currency)}
                        </span>
                      </div>
                    )}
                    {order.shippingAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">
                          {formatCurrency(order.shippingAmount, order.currency)}
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">
                          {formatCurrency(order.total, order.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>What&apos;s Next?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-primary">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Email Confirmation</p>
                        <p className="text-xs text-gray-600">
                          {order.paymentStatus === 'PENDING' 
                            ? 'You\'ll receive an email with your order details and payment instructions.'
                            : 'You\'ll receive an email confirmation shortly with your order details.'
                          }
                        </p>
                      </div>
                    </div>
                    {order.paymentStatus === 'PENDING' && (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-orange-600">2</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Complete Payment</p>
                          <p className="text-xs text-gray-600">
                            Follow the payment instructions in your email to complete your order.
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-primary">{order.paymentStatus === 'PENDING' ? '3' : '2'}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Package Activation</p>
                        <p className="text-xs text-gray-600">
                          Your yoga packages are now active in your account and ready to use.
                        </p>
                      </div>
                    </div>
                    {order.shippingAddress && (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-primary">
                            {(() => {
                              let step = 2;
                              if (order.paymentStatus === 'PENDING') step++;
                              return step;
                            })()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Shipping</p>
                          <p className="text-xs text-gray-600">
                            Your products will be shipped to the address provided.
                          </p>
                        </div>
                      </div>
                    )}
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
                  Book a Session
                </Button>
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}