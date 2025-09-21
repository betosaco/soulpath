'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCheckoutFlow } from '@/components/ProductCheckoutFlow';
import { LoadingState } from '@/components/LoadingState';

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  comparePrice?: number | null;
  images: string[];
  category: string;
  stock: number;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
  shortDescription?: string;
  isFeatured: boolean;
  isPopular: boolean;
  sku?: string;
  weight?: number;
  dimensions?: string;
  tags: string[];
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  image: string;
}

// OrderData interface removed as it's no longer used

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Get product ID and quantity from URL params
  const productId = searchParams.get('productId');
  const quantity = parseInt(searchParams.get('quantity') || '1');

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        setLoading(true);
        
        if (productId) {
          // Load product from API
          const response = await fetch(`/api/products/${productId}`);
          const data = await response.json();
          
          if (data.success) {
            const productData = {
              ...data.data,
              price: parseFloat(data.data.price),
              comparePrice: data.data.comparePrice ? parseFloat(data.data.comparePrice) : null
            };
            setProduct(productData);
            
            // Create cart item
            const cartItem: CartItem = {
              id: productData.id,
              name: productData.name,
              price: productData.price,
              currency: productData.currency || 'PEN',
              quantity: quantity,
              image: productData.images && productData.images.length > 0 ? productData.images[0] : '/images/placeholder.jpg'
            };
            setCartItems([cartItem]);
          } else {
            setError('Product not found');
          }
        } else {
          // Load from localStorage (fallback)
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            const cartData = JSON.parse(savedCart);
            setCartItems(cartData);
            
            // If we have cart items, load the first product
            if (cartData.length > 0) {
              const firstItem = cartData[0];
              const response = await fetch(`/api/products/${firstItem.id}`);
              const data = await response.json();
              
              if (data.success) {
                const productData = {
                  ...data.data,
                  price: parseFloat(data.data.price),
                  comparePrice: data.data.comparePrice ? parseFloat(data.data.comparePrice) : null
                };
                setProduct(productData);
              }
            }
          } else {
            setError('No items in cart');
          }
        }
      } catch (err) {
        console.error('Error loading checkout data:', err);
        setError('Failed to load checkout data');
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [productId, quantity]);

  const handleCheckoutComplete = (orderData: {
    orderId: string;
    status: string;
    amount: number;
    currency: string;
    items: CartItem[];
  }) => {
    console.log('Order completed:', orderData);
    // Clear cart
    localStorage.removeItem('cart');
    // Redirect to confirmation page
    router.push('/order-confirmation');
  };

  if (loading) {
    return <LoadingState message="Loading checkout..." />;
  }

  if (error || !product || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Checkout Error</h1>
          <p className="text-gray-600 mb-4">{error || 'No items to checkout'}</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductCheckoutFlow
      product={product}
      cartItems={cartItems}
      onCheckoutComplete={handleCheckoutComplete}
    />
  );
}