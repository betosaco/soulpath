'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon, ShoppingCartIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { AppShell } from '@/components/AppShell';
import { useCart, useCartUI } from '@/store/appStore';
import { Button } from '@/components/ui/button';
import { ColorSwatch } from '@/components/ColorSwatch';

interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  category: string;
  stock: number;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
  isFeatured: boolean;
  isPopular: boolean;
  sku?: string;
  weight?: number;
  dimensions?: string;
  tags: string[];
}


export default function ProductPage() {
  const params = useParams();
  const productId = params?.id as string;
  const { addItem: addToCart, getTotalItems } = useCart();
  const { openCart } = useCartUI();
  
  console.log('🛒 ProductPage rendered, params:', params, 'productId:', productId);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>('');

  // Fetch product from API
  useEffect(() => {
    // Safety check for params
    if (!params || !productId) {
      setLoading(false);
      return;
    }
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        
        if (data.success) {
          // Convert price from string to number for proper formatting
          const productWithNumericPrice = {
            ...data.data,
            price: parseFloat(data.data.price),
            comparePrice: data.data.comparePrice ? parseFloat(data.data.comparePrice) : null
          };
          setProduct(productWithNumericPrice);
          
          // Set default color for products with color variants
          if (productWithNumericPrice.tags?.includes('color-swatch') && productWithNumericPrice.images?.length > 1) {
            setSelectedColor('black'); // Default to black (first image)
          }
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, params]);

  // Safety check for params - moved after hooks
  if (!params || !productId) {
    return (
      <AppShell className="min-h-screen bg-white">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading product...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (product && product.tags?.includes('color-swatch')) {
      // Update image index based on color selection
      if (color === 'black') {
        setCurrentImageIndex(0); // Black is first image
      } else if (color === 'white') {
        setCurrentImageIndex(1); // White is second image
      }
    }
  };

  const handleAddToCart = () => {
    if (product && product.status === 'ACTIVE' && product.stock > 0) {
      // Add the item quantity times to the cart
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          name: product.name + (selectedColor ? ` (${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)})` : ''),
          price: product.price,
          image: product.images[currentImageIndex] || product.images[0] || '/images/products/yoga-journal-1.jpg',
          sku: product.sku,
          currency: 'PEN',
          type: 'product',
          stock: product.stock,
          weight: product.weight?.toString(),
          dimensions: product.dimensions
        });
      }
      
      // Show success feedback
      const button = document.querySelector('[data-add-to-cart]') as HTMLButtonElement;
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✓ Added to Cart!';
        button.classList.add('bg-green-600');
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('bg-green-600');
        }, 2000);
      }
      
      // Reset quantity after adding
      setQuantity(1);
    }
  };


  if (loading) {
    return (
      <AppShell className="min-h-screen bg-white">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading product...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!product) {
    return (
      <AppShell className="min-h-screen bg-white">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600">The product you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell className="min-h-screen bg-white mobile-container mobile-scrollable">
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden max-w-md mx-auto">
              <Image
                src={product.images[currentImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <Button
                    onClick={prevImage}
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </Button>
                  <Button
                    onClick={nextImage}
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex flex-wrap gap-3 justify-center">
                {product.images.map((image, index) => (
                  <Button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    variant="ghost"
                    className={`relative p-0 border-2 rounded-lg overflow-hidden transition-all ${
                      currentImageIndex === index
                        ? 'border-primary ring-2 ring-primary ring-offset-2 !bg-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-16 h-16 relative">
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Selected indicator */}
                    {currentImageIndex === index && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-lg text-gray-600 mt-2">{product.category}</p>
              {product.sku && (
                <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold text-green-600">
                S/. {product.price.toFixed(2)}
              </div>
              {product.comparePrice && product.comparePrice > product.price && (
                <div className="text-xl text-gray-500 line-through">
                  S/. {product.comparePrice.toFixed(2)}
                </div>
              )}
            </div>

            {product.shortDescription && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Overview</h3>
                <p className="text-gray-700 leading-relaxed">{product.shortDescription}</p>
              </div>
            )}

            {/* Color Swatch for products with color variants */}
            {product.tags?.includes('color-swatch') && product.images?.length > 1 && (
              <ColorSwatch
                colors={[
                  {
                    name: 'Black',
                    value: 'black',
                    image: product.images[0],
                    available: true
                  },
                  {
                    name: 'White',
                    value: 'white',
                    image: product.images[1],
                    available: true
                  }
                ]}
                selectedColor={selectedColor}
                onColorChange={handleColorChange}
                productName={product.name}
              />
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.weight && (
                <div>
                  <h4 className="font-semibold text-gray-900">Weight</h4>
                  <p className="text-gray-600">{product.weight} kg</p>
                </div>
              )}
              {product.dimensions && (
                <div>
                  <h4 className="font-semibold text-gray-900">Dimensions</h4>
                  <p className="text-gray-600">{product.dimensions}</p>
                </div>
              )}
            </div>


            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-lg font-semibold">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <Button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-gray-100"
                    disabled={product.status !== 'ACTIVE' || product.stock <= 0}
                  >
                    <MinusIcon className="h-5 w-5" />
                  </Button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <Button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-gray-100"
                    disabled={product.status !== 'ACTIVE' || product.stock <= 0 || quantity >= product.stock}
                  >
                    <PlusIcon className="h-5 w-5" />
                  </Button>
                </div>
                {product.stock > 0 && (
                  <span className="text-sm text-gray-500">
                    Max: {product.stock}
                  </span>
                )}
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  data-add-to-cart
                  disabled={product.status !== 'ACTIVE' || product.stock <= 0}
                  className="flex-1"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  <span>
                    {product.status === 'ACTIVE' && product.stock > 0 
                      ? 'Add to Cart' 
                      : product.status === 'OUT_OF_STOCK' 
                        ? 'Out of Stock' 
                        : 'Not Available'
                    }
                  </span>
                </Button>
                <Button
                  onClick={() => openCart()}
                  variant="outline"
                >
                  View Cart ({getTotalItems()})
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                product.status === 'ACTIVE' && product.stock > 0 
                  ? 'bg-green-500' 
                  : product.status === 'OUT_OF_STOCK' 
                    ? 'bg-red-500'
                    : 'bg-gray-400'
              }`}></div>
              <span className={
                product.status === 'ACTIVE' && product.stock > 0 
                  ? 'text-green-600' 
                  : product.status === 'OUT_OF_STOCK' 
                    ? 'text-red-600'
                    : 'text-gray-500'
              }>
                {product.status === 'ACTIVE' && product.stock > 0 
                  ? `${product.stock} in stock` 
                  : product.status === 'OUT_OF_STOCK' 
                    ? 'Out of Stock'
                    : 'Not Available'
                }
              </span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </AppShell>
  );
}
