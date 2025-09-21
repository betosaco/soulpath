'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AppLayout } from '@/components/AppLayout';
import { useCart } from '@/lib/cart-context';

interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  comparePrice?: number;
  currency: string;
  stock: number;
  weight: string;
  dimensions: string;
  category: string;
  tags: string[];
  images: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
  isFeatured: boolean;
  isPopular: boolean;
  seoTitle: string;
  seoDescription: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  console.log('🛒 ProductsPage component rendered, loading:', loading, 'products:', products.length, 'error:', error);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('🛒 Fetching products...');
        const response = await fetch('/api/products?limit=50');
        console.log('🛒 Response status:', response.status);
        const data = await response.json();
        console.log('🛒 Products response:', data);
        
        if (data.success) {
          // Convert price from string to number for proper formatting
          const productsWithNumericPrice = data.data.map((product: {
            id: string;
            name: string;
            description: string;
            price: string;
            comparePrice?: string;
            sku: string;
            status: string;
            images: string[];
            category: string;
            tags: string[];
            stock: number;
            weight: string;
            dimensions: string;
            seoTitle: string;
            seoDescription: string;
            createdAt: string;
            updatedAt: string;
          }) => ({
            ...product,
            price: parseFloat(product.price),
            comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : null
          }));
          console.log('🛒 Processed products:', productsWithNumericPrice);
          setProducts(productsWithNumericPrice);
        } else {
          console.error('🛒 API error:', data);
          setError('Failed to load products from server');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <AppLayout className="min-h-screen bg-white">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading products...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout className="min-h-screen bg-gray-50">
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Products</h1>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout className="min-h-screen bg-gray-50">
      <div className="py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Our Products</h1>
          
          {products.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Products Available</h2>
              <p className="text-gray-600 text-sm sm:text-base">Check back later for new products!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => {
                const isInStock = product.status === 'ACTIVE' && product.stock > 0;
                const mainImage = product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg';
                
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow group"
                  >
                    <Link href={`/product/${product.id}`}>
                      <div className="aspect-square relative cursor-pointer">
                        <Image
                          src={mainImage}
                          alt={product.name}
                          fill
                          className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        {!isInStock && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm sm:text-base">Out of Stock</span>
                          </div>
                        )}
                        {product.isFeatured && (
                          <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Featured
                          </div>
                        )}
                        {product.isPopular && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Popular
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-2">{product.category}</p>
                      {product.shortDescription && (
                        <p className="text-gray-500 text-xs sm:text-sm mb-3 line-clamp-2">{product.shortDescription}</p>
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-lg sm:text-2xl font-bold text-green-600">S/. {product.price.toFixed(2)}</p>
                        {isInStock && (
                          <span className="text-xs sm:text-sm text-gray-500">
                            {product.stock} in stock
                          </span>
                        )}
                      </div>
                      
                      {isInStock && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: mainImage,
                              sku: product.sku
                            });
                          }}
                          className="w-full bg-[#6ea058] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#5a8a4a] transition-colors text-sm"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
