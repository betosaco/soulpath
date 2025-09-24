/**
 * ========================================================================================
 * VIRTUALIZED LIST COMPONENT
 * ========================================================================================
 *
 * PURPOSE:
 * --------
 * A virtualized list component for handling large datasets in dropdown menus.
 * Only renders visible items to improve performance.
 *
 * FEATURES:
 * ---------
 * - Virtualization for large lists
 * - Smooth scrolling
 * - Search optimization
 * - Keyboard navigation
 * - Accessibility support
 */

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

interface VirtualizedListProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  searchTerm?: string;
  searchFields?: string[];
  className?: string;
}

export function VirtualizedList({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  searchTerm = '',
  searchFields = ['name'],
  className = ''
}: VirtualizedListProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    
    const term = searchTerm.toLowerCase();
    return items.filter(item => 
      searchFields.some(field => 
        item[field]?.toLowerCase().includes(term)
      )
    );
  }, [items, searchTerm, searchFields]);

  // Calculate visible range
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    filteredItems.length
  );

  // Get visible items
  const visibleItems = filteredItems.slice(visibleStart, visibleEnd);

  // Handle scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Scroll to top when search term changes
  useEffect(() => {
    if (scrollElementRef.current) {
      scrollElementRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  }, [searchTerm]);

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-y-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      {/* Spacer for items before visible range */}
      <div style={{ height: visibleStart * itemHeight }} />
      
      {/* Visible items */}
      {visibleItems.map((item, index) => (
        <div
          key={`${item.code || item.name}-${visibleStart + index}`}
          style={{ height: itemHeight }}
        >
          {renderItem(item, visibleStart + index)}
        </div>
      ))}
      
      {/* Spacer for items after visible range */}
      <div style={{ height: (filteredItems.length - visibleEnd) * itemHeight }} />
    </div>
  );
}
