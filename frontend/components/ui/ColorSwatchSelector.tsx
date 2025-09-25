'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ColorOption {
  id: string;
  name: string;
  colorCode: string;
  image: string;
  sku: string;
  stock: number;
  isAvailable: boolean;
}

interface ColorSwatchSelectorProps {
  colors: ColorOption[];
  selectedColorId?: string;
  onColorSelect: (colorId: string) => void;
  className?: string;
}

export function ColorSwatchSelector({
  colors,
  selectedColorId,
  onColorSelect,
  className
}: ColorSwatchSelectorProps) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Color:</span>
        <span className="text-sm text-gray-600">
          {colors.find(c => c.id === selectedColorId)?.name || 'Select a color'}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => onColorSelect(color.id)}
            onMouseEnter={() => setHoveredColor(color.id)}
            onMouseLeave={() => setHoveredColor(null)}
            disabled={!color.isAvailable}
            className={cn(
              'relative group flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-200',
              'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
              selectedColorId === color.id
                ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                : 'border-gray-200 hover:border-gray-300',
              !color.isAvailable
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer'
            )}
          >
            {/* Color Swatch */}
            <div
              className={cn(
                'w-6 h-6 rounded-full border-2 border-white shadow-sm',
                color.colorCode === '#FFFFFF' && 'border-gray-300'
              )}
              style={{ backgroundColor: color.colorCode }}
            />
            
            {/* Color Name */}
            <span className={cn(
              'text-sm font-medium',
              selectedColorId === color.id
                ? 'text-primary'
                : 'text-gray-700'
            )}>
              {color.name}
            </span>
            
            {/* Stock Indicator */}
            {color.stock <= 5 && color.stock > 0 && (
              <span className="text-xs text-orange-600 font-medium">
                Only {color.stock} left
              </span>
            )}
            
            {/* Out of Stock Indicator */}
            {!color.isAvailable && (
              <span className="text-xs text-red-600 font-medium">
                Out of stock
              </span>
            )}
            
            {/* Hover Tooltip */}
            {hoveredColor === color.id && color.isAvailable && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                {color.name} - {color.sku}
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Color Description */}
      {selectedColorId && (
        <div className="text-xs text-gray-500">
          {colors.find(c => c.id === selectedColorId)?.name} tote bag made in Peru from cotton-based materials
        </div>
      )}
    </div>
  );
}

// Helper function to get color options for a product
export function getColorOptionsForProduct(productId: string): ColorOption[] {
  // This would typically come from your API or product data
  // For now, returning mock data based on the product IDs
  const colorMappings: Record<string, ColorOption[]> = {
    'prod-tote-path-to-you-white': [
      {
        id: 'prod-tote-path-to-you-white',
        name: 'White',
        colorCode: '#FFFFFF',
        image: '/api/products/prod-tote-path-to-you-white/image',
        sku: 'TB-PTY-W-001',
        stock: 25,
        isAvailable: true
      },
      {
        id: 'prod-tote-path-to-you-black',
        name: 'Black',
        colorCode: '#000000',
        image: '/api/products/prod-tote-path-to-you-black/image',
        sku: 'TB-PTY-B-001',
        stock: 25,
        isAvailable: true
      }
    ],
    'prod-tote-path-to-you-black': [
      {
        id: 'prod-tote-path-to-you-white',
        name: 'White',
        colorCode: '#FFFFFF',
        image: '/api/products/prod-tote-path-to-you-white/image',
        sku: 'TB-PTY-W-001',
        stock: 25,
        isAvailable: true
      },
      {
        id: 'prod-tote-path-to-you-black',
        name: 'Black',
        colorCode: '#000000',
        image: '/api/products/prod-tote-path-to-you-black/image',
        sku: 'TB-PTY-B-001',
        stock: 25,
        isAvailable: true
      }
    ],
    'prod-tote-unknown-self': [
      {
        id: 'prod-tote-unknown-self',
        name: 'White',
        colorCode: '#FFFFFF',
        image: '/api/products/prod-tote-unknown-self/image',
        sku: 'TB-UNS-W-001',
        stock: 50,
        isAvailable: true
      }
    ]
  };

  return colorMappings[productId] || [];
}
