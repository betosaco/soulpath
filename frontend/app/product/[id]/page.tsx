'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon, ShoppingCartIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { AppLayout } from '@/components/AppLayout';
import { LoadingState } from '@/components/LoadingState';

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

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch product from API
  useEffect(() => {
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

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

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

  const addToCart = () => {
    if (product && product.status === 'ACTIVE' && product.stock > 0) {
      const existingItem = cartItems.find(item => item.id === product.id);
      
      if (existingItem) {
        setCartItems(cartItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ));
      } else {
        setCartItems([...cartItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.images[0]
        }]);
      }
      
      setIsCartOpen(true);
      
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
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) {
    return <LoadingState message="Loading product..." />;
  }

  if (!product) {
    return (
      <AppLayout className="min-h-screen bg-white">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600">The product you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout className="min-h-screen bg-gray-50">
      {/* Shopping Cart Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-gray-600 text-sm">S/. {item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-6">
              <div className="flex justify-between text-lg font-semibold mb-4">
                <span>Total:</span>
                <span>S/. {getTotalPrice().toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  // Save cart to localStorage and redirect to checkout
                  localStorage.setItem('cart', JSON.stringify(cartItems));
                  window.location.href = '/checkout';
                }}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cart Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              <Image
                src={product.images[currentImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-green-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </button>
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

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-lg font-semibold">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                    disabled={product.status !== 'ACTIVE' || product.stock <= 0}
                  >
                    <MinusIcon className="h-5 w-5" />
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-100"
                    disabled={product.status !== 'ACTIVE' || product.stock <= 0 || quantity >= product.stock}
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
                {product.stock > 0 && (
                  <span className="text-sm text-gray-500">
                    Max: {product.stock}
                  </span>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={addToCart}
                  data-add-to-cart
                  disabled={product.status !== 'ACTIVE' || product.stock <= 0}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                </button>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Cart ({cartItems.length})
                </button>
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
    </AppLayout>
  );
}
