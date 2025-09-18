// app/purchase/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface PurchaseData {
  id: number;
  totalAmount: number;
  currencyCode: string;
  paymentMethod: string;
  confirmedAt: string;
  user: {
    fullName: string | null;
    email: string;
  };
}

export default function PurchaseSuccessPage() {
  const searchParams = useSearchParams();
  const purchaseId = searchParams.get('purchaseId');
  const [purchase, setPurchase] = useState<PurchaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!purchaseId) {
      setError('No purchase ID provided');
      setLoading(false);
      return;
    }

    // Fetch purchase details
    const fetchPurchase = async () => {
      try {
        const response = await fetch(`/api/purchases/${purchaseId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch purchase details');
        }
        const data = await response.json();
        setPurchase(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchase();
  }, [purchaseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading purchase details...</p>
        </div>
      </div>
    );
  }

  if (error || !purchase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Purchase not found'}</p>
          <Link 
            href="/packages" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="text-green-600 text-6xl mb-6">✅</div>
          
          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>

          {/* Purchase Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Purchase Details</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Purchase ID:</span>
                <span className="font-medium">#{purchase.id}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">
                  {purchase.currencyCode} {purchase.totalAmount.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{purchase.paymentMethod}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Confirmed At:</span>
                <span className="font-medium">
                  {new Date(purchase.confirmedAt).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">
                  {purchase.user.fullName || purchase.user.email}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link 
              href="/account"
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View My Account
            </Link>
            
            <Link 
              href="/packages"
              className="block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Browse More Packages
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-sm text-gray-500">
            <p>
              A confirmation email has been sent to {purchase.user.email}. 
              You can also view your purchase details in your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
