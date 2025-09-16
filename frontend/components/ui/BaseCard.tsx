/**
 * BaseCard Component
 * 
 * A centralized card component that uses the design system
 * for consistent styling across the application.
 * 
 * Usage:
 * import { BaseCard } from '@/components/ui/BaseCard';
 * 
 * <BaseCard variant="elevated" size="lg">
 *   <BaseCard.Header>Card Title</BaseCard.Header>
 *   <BaseCard.Content>Card content goes here</BaseCard.Content>
 *   <BaseCard.Footer>Card footer</BaseCard.Footer>
 * </BaseCard>
 */

import React from 'react';
import { cn } from '@/lib/utils';
import '@/styles/unified-component-styles.css';

// ============================================================================
// TYPES
// ============================================================================

export interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  focus?: boolean;
  active?: boolean;
  children: React.ReactNode;
}

export interface BaseCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface BaseCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface BaseCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function BaseCard({
  variant = 'default',
  size = 'md',
  hover = false,
  focus = false,
  active = false,
  className,
  children,
  ...props
}: BaseCardProps) {
  const baseClasses = 'unified-card';
  const variantClasses = variant === 'elevated' ? 'shadow-lg' : 
                        variant === 'outlined' ? 'border-2' : 
                        variant === 'ghost' ? 'bg-transparent border-none' : '';
  const sizeClasses = size === 'sm' ? 'p-4' : 
                     size === 'lg' ? 'p-6' : 
                     size === 'xl' ? 'p-8' : 'p-5';
  
  const stateClasses = cn(
    hover && 'hover:shadow-md',
    focus && 'focus:ring-2 focus:ring-[var(--unified-primary)]',
    active && 'active:scale-95'
  );

  const classes = cn(
    baseClasses,
    variantClasses,
    sizeClasses,
    stateClasses,
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

BaseCard.Header = function BaseCardHeader({
  className,
  children,
  ...props
}: BaseCardHeaderProps) {
  return (
    <div
      className={cn(
        'unified-card__header',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

BaseCard.Content = function BaseCardContent({
  className,
  children,
  ...props
}: BaseCardContentProps) {
  return (
    <div className={cn('unified-card__content', className)} {...props}>
      {children}
    </div>
  );
};

BaseCard.Footer = function BaseCardFooter({
  className,
  children,
  ...props
}: BaseCardFooterProps) {
  return (
    <div
      className={cn(
        'unified-card__footer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================================================
// EXPORT
// ============================================================================

export default BaseCard;
