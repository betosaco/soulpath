/**
 * 🔄 Placeholder Autocomplete
 *
 * Context-aware autocomplete dropdown for template placeholders.
 * Provides intelligent suggestions based on scenario context and data mapping.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Search,
  Hash,
  Users,
  ShoppingCart,
  Calendar,
  Package,
  CreditCard,
  Link,
  Zap,
} from 'lucide-react';
import { placeholderRegistry, PlaceholderKey, PlaceholderCategory, placeholderCategories } from '@/lib/communication/placeholderRegistry';

interface PlaceholderSuggestion {
  key: string;
  definition: typeof placeholderRegistry[keyof typeof placeholderRegistry];
  matchScore: number;
}

interface PlaceholderAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (placeholder: string) => void;
  scenario?: any; // Current scenario context
  className?: string;
  disabled?: boolean;
}

export function PlaceholderAutocomplete({
  value,
  onChange,
  onSelect,
  scenario,
  className = '',
  disabled = false,
}: PlaceholderAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<PlaceholderSuggestion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Category icons
  const categoryIcons: Record<PlaceholderCategory, React.ComponentType<any>> = {
    user: Users,
    order: ShoppingCart,
    matpass: Zap,
    booking: Calendar,
    product: Package,
    payment: CreditCard,
    system: Link,
  };

  // Get suggestions based on search term and context
  const getSuggestions = (term: string, context?: any): PlaceholderSuggestion[] => {
    const allPlaceholders = Object.entries(placeholderRegistry);

    // Filter by search term
    let filtered = allPlaceholders.map(([key, definition]) => ({
      key,
      definition,
      matchScore: calculateMatchScore(key, definition, term),
    })).filter(item => item.matchScore > 0 || !term);

    // Boost relevance based on scenario context
    if (context?.customerType || context?.orderTypes) {
      filtered = filtered.map(item => ({
        ...item,
        matchScore: boostByContext(item, context),
      }));
    }

    // Sort by relevance
    return filtered.sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);
  };

  // Calculate match score for a placeholder
  const calculateMatchScore = (
    key: string,
    definition: typeof placeholderRegistry[keyof typeof placeholderRegistry],
    term: string
  ): number => {
    if (!term) return 1; // Base score for no search

    const search = term.toLowerCase();
    const keyLower = key.toLowerCase();
    const descLower = definition.description.toLowerCase();
    const categoryLower = definition.category.toLowerCase();

    let score = 0;

    // Exact key match gets highest score
    if (keyLower === search) score += 10;
    // Key starts with search
    else if (keyLower.startsWith(search)) score += 8;
    // Key contains search
    else if (keyLower.includes(search)) score += 6;
    // Description contains search
    else if (descLower.includes(search)) score += 4;
    // Category contains search
    else if (categoryLower.includes(search)) score += 2;

    return score;
  };

  // Boost relevance based on scenario context
  const boostByContext = (
    item: PlaceholderSuggestion,
    context: any
  ): number => {
    let boost = item.matchScore;

    // Boost user placeholders for new customer scenarios
    if (context.customerType === 'new' && item.definition.category === 'user') {
      boost += 3;
    }

    // Boost matpass placeholders for matpass orders
    if (context.orderTypes?.includes('matpass') && item.definition.category === 'matpass') {
      boost += 3;
    }

    // Boost booking placeholders for booking orders
    if (context.orderTypes?.includes('booking') && item.definition.category === 'booking') {
      boost += 3;
    }

    // Boost product placeholders for product orders
    if (context.orderTypes?.includes('product') && item.definition.category === 'product') {
      boost += 3;
    }

    // Boost order placeholders (always relevant)
    if (item.definition.category === 'order') {
      boost += 2;
    }

    return boost;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const newCursorPos = e.target.selectionStart || 0;

    onChange(newValue);
    setCursorPosition(newCursorPos);

    // Check if we're typing a placeholder ({{)
    const beforeCursor = newValue.slice(0, newCursorPos);
    const afterCursor = newValue.slice(newCursorPos);

    // Find the last opening brace sequence
    const lastOpenBrace = beforeCursor.lastIndexOf('{{');
    if (lastOpenBrace !== -1) {
      const placeholderStart = lastOpenBrace + 2;
      const currentPlaceholder = beforeCursor.slice(placeholderStart);

      // Check if we're still inside placeholder syntax
      const nextCloseBrace = afterCursor.indexOf('}}');
      const isInsidePlaceholder = nextCloseBrace === -1 || nextCloseBrace > 0;

      if (isInsidePlaceholder && currentPlaceholder.length > 0) {
        setSearchTerm(currentPlaceholder);
        setIsOpen(true);
        setSuggestions(getSuggestions(currentPlaceholder, scenario));
        setSelectedIndex(0);
        return;
      }
    }

    setIsOpen(false);
    setSearchTerm('');
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;

      case 'Enter':
      case 'Tab':
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          insertPlaceholder(suggestions[selectedIndex].key);
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  // Insert placeholder at cursor position
  const insertPlaceholder = (placeholderKey: string) => {
    const beforeCursor = value.slice(0, cursorPosition);
    const afterCursor = value.slice(cursorPosition);

    // Find the placeholder start
    const lastOpenBrace = beforeCursor.lastIndexOf('{{');
    if (lastOpenBrace === -1) return;

    // Replace from {{ to cursor with the complete placeholder
    const newBefore = beforeCursor.slice(0, lastOpenBrace) + `{{${placeholderKey}}}`;
    const newValue = newBefore + afterCursor;

    onChange(newValue);
    onSelect(placeholderKey);

    setIsOpen(false);
    setSearchTerm('');

    // Reset cursor position
    setTimeout(() => {
      if (inputRef.current) {
        const newCursorPos = newBefore.length;
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        inputRef.current.focus();
      }
    }, 0);
  };

  // Handle suggestion click
  const handleSuggestionClick = (placeholderKey: string) => {
    insertPlaceholder(placeholderKey);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update suggestions when search term changes
  useEffect(() => {
    if (searchTerm) {
      setSuggestions(getSuggestions(searchTerm, scenario));
      setSelectedIndex(0);
    }
  }, [searchTerm, scenario]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchTerm) setIsOpen(true);
          }}
          disabled={disabled}
          className="font-mono text-sm"
          placeholder="Escribe {{ para ver placeholders disponibles..."
        />

        {searchTerm && (
          <div className="absolute right-3 top-3 flex items-center gap-1 text-xs text-gray-400">
            <Hash className="w-3 h-3" />
            <span>{{searchTerm}}</span>
          </div>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <Card
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 max-h-80 overflow-y-auto shadow-lg border border-gray-200"
        >
          <CardContent className="p-2">
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => {
                const CategoryIcon = categoryIcons[suggestion.definition.category];
                const categoryInfo = placeholderCategories[suggestion.definition.category];

                return (
                  <div
                    key={suggestion.key}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleSuggestionClick(suggestion.key)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className="p-1.5 rounded"
                          style={{ backgroundColor: categoryInfo.color + '20' }}
                        >
                          <CategoryIcon
                            className="w-4 h-4"
                            style={{ color: categoryInfo.color }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded text-blue-600">
                              {suggestion.key}
                            </code>
                            <Badge
                              variant="outline"
                              className="text-xs"
                              style={{
                                borderColor: categoryInfo.color,
                                color: categoryInfo.color,
                              }}
                            >
                              {categoryInfo.label}
                            </Badge>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">
                            {suggestion.definition.description}
                          </p>

                          {suggestion.definition.example && (
                            <p className="text-xs text-gray-500">
                              <span className="font-medium">Ejemplo:</span> {suggestion.definition.example}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {suggestion.definition.required && (
                          <Badge variant="destructive" className="text-xs">
                            Requerido
                          </Badge>
                        )}
                        <span className="text-xs text-gray-400">
                          {suggestion.matchScore > 5 ? '⭐ Alta' :
                           suggestion.matchScore > 3 ? '👍 Buena' : '👌 Normal'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  Presiona ↑↓ para navegar, Enter para seleccionar, Esc para cerrar
                </span>
                <span>
                  {suggestions.length} sugerencias
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      <div className="mt-2 text-xs text-gray-500">
        <p>
          Usa <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{placeholder}}'}</code> para
          insertar datos dinámicos. Escribe {'{{'} para ver sugerencias inteligentes.
        </p>
      </div>
    </div>
  );
}

// Quick placeholder picker component (for use in other contexts)
interface QuickPlaceholderPickerProps {
  onSelect: (placeholder: string) => void;
  scenario?: any;
  className?: string;
}

export function QuickPlaceholderPicker({
  onSelect,
  scenario,
  className = '',
}: QuickPlaceholderPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<PlaceholderCategory | 'all'>('all');

  const getFilteredPlaceholders = () => {
    const all = Object.entries(placeholderRegistry);
    if (selectedCategory === 'all') return all;

    return all.filter(([_, def]) => def.category === selectedCategory);
  };

  const placeholders = getFilteredPlaceholders();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todos
        </button>
        {Object.entries(placeholderCategories).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key as PlaceholderCategory)}
            className={`px-3 py-1 text-xs rounded-full transition-colors flex items-center gap-1 ${
              selectedCategory === key
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{info.icon}</span>
            {info.label}
          </button>
        ))}
      </div>

      {/* Placeholder Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {placeholders.map(([key, definition]) => {
          const CategoryIcon = categoryIcons[definition.category];
          const categoryInfo = placeholderCategories[definition.category];

          return (
            <Card
              key={key}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelect(key)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div
                    className="p-1.5 rounded"
                    style={{ backgroundColor: categoryInfo.color + '20' }}
                  >
                    <CategoryIcon
                      className="w-4 h-4"
                      style={{ color: categoryInfo.color }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <code className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded text-blue-600 block mb-1">
                      {key}
                    </code>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {definition.description}
                    </p>
                    {definition.required && (
                      <Badge variant="destructive" className="text-xs mt-1">
                        Requerido
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
