'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface ColorOption {
  name: string;
  value: string;
  image: string;
  available: boolean;
}

interface ColorSwatchProps {
  colors: ColorOption[];
  selectedColor: string;
  onColorChange: (color: string) => void;
  productName: string;
}

export function ColorSwatch({ colors, selectedColor, onColorChange, productName }: ColorSwatchProps) {
  if (colors.length <= 1) {
    return null; // Don't show swatch if only one color
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Color</h3>
        <p className="text-sm text-gray-600">Choose your preferred color</p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <Button
            key={color.value}
            onClick={() => onColorChange(color.value)}
            variant="ghost"
            className={`relative p-0 border-2 rounded-lg overflow-hidden transition-all ${
              selectedColor === color.value
                ? 'border-primary ring-2 ring-primary ring-offset-2'
                : 'border-gray-200 hover:border-gray-300'
            } ${!color.available ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!color.available}
          >
            <div className="w-16 h-16 relative">
              <Image
                src={color.image}
                alt={`${productName} - ${color.name}`}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Color name overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 text-center">
              {color.name}
            </div>
            
            {/* Selected indicator */}
            {selectedColor === color.value && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </Button>
        ))}
      </div>
      
      {/* Selected color info */}
      <div className="text-sm text-gray-600">
        Selected: <span className="font-medium text-gray-900">
          {colors.find(c => c.value === selectedColor)?.name}
        </span>
      </div>
    </div>
  );
}
