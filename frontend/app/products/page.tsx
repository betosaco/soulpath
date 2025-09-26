'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AppShell } from '@/components/AppShell';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/appStore';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

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
  status: string;
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
  
  const { addItem: addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    if (product.status === 'ACTIVE' && product.stock > 0) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '/images/products/placeholder-product.jpg',
        sku: product.sku,
        currency: product.currency || 'S/.',
        type: 'product',
        stock: product.stock,
        weight: product.weight,
        dimensions: product.dimensions,
      });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/products?limit=20');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
          // Convert price from string to number for proper formatting
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const productsWithNumericPrice = data.data.map((product: any) => ({
            ...product,
            price: parseFloat(product.price),
            comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : null
          }));
          setProducts(productsWithNumericPrice);
        } else {
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
      <AppShell className="min-h-screen bg-[var(--color-surface-primary)]">
        <div className="min-h-screen" style={{ color: 'var(--color-text-primary)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              {/* Minimal Loading Header */}
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Available Products</h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>Loading products...</p>
              </div>
              
              {/* Subtle Loading Animation - Same as packages */}
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-2" style={{ borderColor: 'color-mix(in srgb, var(--color-primary-500) 25%, transparent)', borderTopColor: 'var(--color-primary-500)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell className="min-h-screen bg-[var(--color-surface-primary)]">
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Error Loading Products</h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppLayout>
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Our Products</h1>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              Discover our carefully curated collection of yoga and wellness products to enhance your practice.
            </p>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>No Products Available</h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>Check back later for new products!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product.id} className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border" style={{ background: 'var(--color-surface-primary)', borderColor: 'var(--color-border-500)' }}>
                  <div className="aspect-w-16 aspect-h-12" style={{ background: 'var(--color-surface-secondary)' }}>
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center" style={{ background: 'var(--color-surface-secondary)' }}>
                        <span style={{ color: 'var(--color-text-tertiary)' }}>No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium px-2 py-1 rounded" style={{ color: 'var(--color-accent-500)', background: 'color-mix(in srgb, var(--color-accent-500) 12%, transparent)' }}>
                        {product.category}
                      </span>
                      {product.isFeatured && (
                        <span className="text-xs font-medium px-2 py-1 rounded" style={{ color: 'var(--color-primary-500)', background: 'color-mix(in srgb, var(--color-primary-500) 12%, transparent)' }}>
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2" style={{ color: 'var(--color-text-primary)' }}>
                      {product.name}
                    </h3>
                    
                    <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                      {product.shortDescription || product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                          S/. {product.price.toFixed(2)}
                        </span>
                        {product.comparePrice && (
                          <span className="text-lg line-through" style={{ color: 'var(--color-text-tertiary)' }}>
                            S/. {product.comparePrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                        Stock: {product.stock}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.status !== 'ACTIVE' || product.stock <= 0}
                        variant="success"
                        className="flex-1"
                      >
                        <ShoppingCartIcon className="h-4 w-4 mr-2" />
                        {product.status === 'ACTIVE' && product.stock > 0 
                          ? 'Add to Cart' 
                          : product.status === 'OUT_OF_STOCK' 
                            ? 'Out of Stock'
                            : 'Not Available'
                        }
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="flex-1"
                      >
                        <Link href={`/product/${product.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
    </AppLayout>
  );
}