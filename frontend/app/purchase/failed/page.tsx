// app/purchase/failed/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PurchaseFailedPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'Payment failed';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className="text-red-600 text-6xl mb-6">❌</div>
          
          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            We're sorry, but your payment could not be processed at this time.
          </p>

          {/* Error Details */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Details</h2>
            <p className="text-red-700">{reason}</p>
          </div>

          {/* Common Solutions */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What you can do:</h2>
            
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Check that your payment information is correct
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Ensure you have sufficient funds in your account
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Try using a different payment method
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Contact your bank if the issue persists
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link 
              href="/packages"
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </Link>
            
            <Link 
              href="/contact"
              className="block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Contact Support
            </Link>
            
            <Link 
              href="/"
              className="block w-full text-blue-600 hover:text-blue-800 transition-colors"
            >
              Return to Home
            </Link>
          </div>

          {/* Support Information */}
          <div className="mt-8 text-sm text-gray-500">
            <p>
              If you continue to experience issues, please contact our support team 
              with the error message above for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
