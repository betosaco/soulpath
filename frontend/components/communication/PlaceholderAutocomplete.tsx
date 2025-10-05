import React, { useState, useEffect, useRef } from 'react';
import { BaseButton } from '../ui/BaseButton';
import { Badge } from '../ui/badge';
import { getPlaceholdersGrouped, Placeholder } from '../../lib/communication/placeholders';
import { Search, Plus, X, Hash, User, Calendar, DollarSign, Package } from 'lucide-react';

interface PlaceholderAutocompleteProps {
  isOpen: boolean;
  onSelect: (placeholder: string) => void;
  onClose: () => void;
  position: { top: number; left: number };
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  type?: 'email' | 'sms';
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'user':
      return <User className="w-4 h-4 text-blue-600" />;
    case 'booking':
      return <Calendar className="w-4 h-4 text-green-600" />;
    case 'order':
    case 'payment':
      return <DollarSign className="w-4 h-4 text-purple-600" />;
    case 'package':
      return <Package className="w-4 h-4 text-orange-600" />;
    default:
      return <Hash className="w-4 h-4 text-gray-600" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'user':
      return 'border-blue-200 bg-blue-50';
    case 'booking':
      return 'border-green-200 bg-green-50';
    case 'order':
    case 'payment':
      return 'border-purple-200 bg-purple-50';
    case 'package':
      return 'border-orange-200 bg-orange-50';
    default:
      return 'border-gray-200 bg-gray-50';
  }
};

export function PlaceholderAutocomplete({
  isOpen,
  onSelect,
  onClose,
  position,
  searchTerm = '',
  onSearchChange,
  type = 'email'
}: PlaceholderAutocompleteProps) {
  const [filteredPlaceholders, setFilteredPlaceholders] = useState<Record<string, Placeholder[]>>({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get all placeholders grouped by category
  const allPlaceholders = React.useMemo(() => getPlaceholdersGrouped(type), [type]);

  // Filter placeholders based on search term
  useEffect(() => {
    const search = localSearchTerm.toLowerCase();
    const filtered: Record<string, Placeholder[]> = {};

    Object.entries(allPlaceholders).forEach(([category, placeholders]) => {
      const filteredCategory = placeholders.filter(placeholder =>
        placeholder.key.toLowerCase().includes(search) ||
        placeholder.description.toLowerCase().includes(search) ||
        category.toLowerCase().includes(search)
      );

      if (filteredCategory.length > 0) {
        filtered[category] = filteredCategory;
      }
    });

    setFilteredPlaceholders(filtered);
    setSelectedIndex(0);
  }, [localSearchTerm, allPlaceholders]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const allItems = Object.values(filteredPlaceholders).flat();
    const totalItems = allItems.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
        break;
      case 'Enter':
        e.preventDefault();
        if (allItems[selectedIndex]) {
          onSelect(allItems[selectedIndex].key);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      case 'Tab':
        e.preventDefault();
        if (allItems[selectedIndex]) {
          onSelect(allItems[selectedIndex].key);
        }
        break;
    }
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value);
    onSearchChange?.(value);
  };

  if (!isOpen) return null;

  const allItems = Object.values(filteredPlaceholders).flat();
  let currentItemIndex = 0;

  return (
    <div
      ref={containerRef}
      className="fixed z-50 w-96 max-h-96 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden"
      style={{
        top: position.top,
        left: position.left,
      }}
      onKeyDown={handleKeyDown}
    >
      {/* Header with search */}
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Insert Placeholder</span>
          <BaseButton
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="ml-auto h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </BaseButton>
        </div>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search placeholders..."
          value={localSearchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Placeholder list */}
      <div className="max-h-64 overflow-y-auto">
        {Object.keys(filteredPlaceholders).length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p className="text-sm">No placeholders found</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="p-2">
            {Object.entries(filteredPlaceholders).map(([category, placeholders]) => (
              <div key={category} className="mb-3">
                <div className="flex items-center gap-2 mb-2 px-2">
                  {getCategoryIcon(category)}
                  <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                    {category}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {placeholders.length}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {placeholders.map((placeholder) => {
                    const isSelected = currentItemIndex === selectedIndex;
                    currentItemIndex++;

                    return (
                      <div
                        key={placeholder.key}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-100 border border-blue-300'
                            : 'hover:bg-gray-100 border border-transparent'
                        }`}
                        onClick={() => onSelect(placeholder.key)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <code className={`text-sm font-mono px-2 py-1 rounded ${
                              isSelected
                                ? 'bg-blue-200 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {placeholder.key}
                            </code>
                            {placeholder.required && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {placeholder.description}
                          </p>
                          {placeholder.example && (
                            <p className="text-xs text-gray-500 mt-1 italic">
                              Example: {placeholder.example}
                            </p>
                          )}
                        </div>
                        <BaseButton
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(placeholder.key);
                          }}
                          className={`h-6 w-6 p-0 ${
                            isSelected ? 'text-blue-600' : 'text-gray-400'
                          }`}
                        >
                          <Plus className="w-3 h-3" />
                        </BaseButton>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
          <span>{allItems.length} placeholders</span>
        </div>
      </div>
    </div>
  );
}

// Hook for managing placeholder autocomplete in textarea/plain text
export function usePlaceholderAutocomplete(
  textareaRef: React.RefObject<HTMLTextAreaElement>
) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [triggerPosition, setTriggerPosition] = useState(0);

  const openAutocomplete = (cursorPosition: number, search: string = '') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const rect = textarea.getBoundingClientRect();

    // Get cursor coordinates
    const textMetrics = getCursorPosition(textarea, cursorPosition);
    const top = rect.top + textMetrics.top + 20; // Offset below cursor
    const left = Math.min(
      rect.left + textMetrics.left,
      rect.right - 400 // Ensure it fits within textarea bounds
    );

    setPosition({ top, left });
    setSearchTerm(search);
    setTriggerPosition(cursorPosition - (search.length + 2)); // Position before {{
    setIsOpen(true);
  };

  const closeAutocomplete = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  const insertPlaceholder = (placeholder: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = triggerPosition;
    const end = textarea.selectionEnd;
    const currentContent = textarea.value;
    const newContent = currentContent.substring(0, start) + placeholder + currentContent.substring(end);

    textarea.value = newContent;
    textarea.focus();
    textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);

    closeAutocomplete();
  };

  return {
    isOpen,
    position,
    searchTerm,
    openAutocomplete,
    closeAutocomplete,
    insertPlaceholder,
    setSearchTerm
  };
}

// Helper function to get cursor position in textarea
function getCursorPosition(textarea: HTMLTextAreaElement, position: number) {
  const div = document.createElement('div');
  const style = window.getComputedStyle(textarea);

  // Copy textarea styles to div
  [
    'fontFamily',
    'fontSize',
    'fontWeight',
    'letterSpacing',
    'lineHeight',
    'paddingTop',
    'paddingLeft',
    'paddingRight',
    'borderLeftWidth',
    'borderRightWidth',
    'wordWrap',
    'whiteSpace',
    'wordBreak'
  ].forEach(prop => {
    div.style[prop as any] = style[prop as any];
  });

  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.whiteSpace = 'pre-wrap';
  div.style.wordWrap = 'break-word';

  // Set the same width as textarea
  div.style.width = textarea.clientWidth + 'px';

  // Create text up to cursor position
  const textBeforeCursor = textarea.value.substring(0, position);
  div.textContent = textBeforeCursor;

  document.body.appendChild(div);

  const span = document.createElement('span');
  span.textContent = textarea.value.substring(position) || '.';
  div.appendChild(span);

  const rect = span.getBoundingClientRect();
  const textareaRect = textarea.getBoundingClientRect();

  document.body.removeChild(div);

  return {
    top: rect.top - textareaRect.top,
    left: rect.left - textareaRect.left
  };
}
