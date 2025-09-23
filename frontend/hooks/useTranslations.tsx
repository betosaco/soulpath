'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { defaultTranslations } from '@/lib/data/translations';

export function useLanguage() {
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  useEffect(() => {
    // Load language preference from localStorage
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
        setLanguage(savedLanguage as 'en' | 'es');
      }
    }
  }, []);

  const changeLanguage = React.useCallback((newLanguage: 'en' | 'es') => {
    console.log('🔄 Changing language to', newLanguage);
    setLanguage(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
      console.log('💾 Language saved to localStorage:', newLanguage);
    }
  }, []); // Remove language dependency to prevent infinite loop

  return { language, setLanguage: changeLanguage };
}

export function useTranslations(initialContent?: Record<string, unknown>, language?: 'en' | 'es') {
  const [content, setContent] = useState(initialContent || defaultTranslations);
  const [isLoading, setIsLoading] = useState(false); // Changed from true to false
  const hasFetchedRef = useRef(false); // Track if we've already fetched translations
  
  // Use provided language or fallback to default - memoized to prevent unnecessary re-renders
  const currentLanguage = useMemo(() => language || 'en', [language]);

  // Fetch translations from backend CMS
  const fetchTranslations = React.useCallback(async () => {
    // Skip fetch during SSR to prevent webpack errors
    if (typeof window === 'undefined') {
      return;
    }
    
    // Prevent multiple simultaneous fetches
    if (hasFetchedRef.current) {
      console.log('🔍 Already fetched translations, skipping...');
      return;
    }
    
    try {
      // Don't set loading state for background fetch
      // Add cache-busting parameter to ensure fresh content
      const response = await fetch(`/api/content?t=${Date.now()}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.content && Object.keys(result.content).length > 0) {
          console.log('🔍 API returned content:', result.content);
          console.log('🔍 Default translations keys:', Object.keys(defaultTranslations.en));
          
          // Ensure we always have the default structure, then update with API content
          const mergedContent = {
            en: { ...defaultTranslations.en },
            es: { ...defaultTranslations.es }
          };
          
          // Update specific keys from API content
          if (result.content.en) {
            Object.keys(result.content.en).forEach(key => {
              if (result.content.en[key] && typeof result.content.en[key] === 'object') {
                mergedContent.en[key as keyof typeof mergedContent.en] = { 
                  ...mergedContent.en[key as keyof typeof mergedContent.en], 
                  ...result.content.en[key] 
                };
              } else {
                mergedContent.en[key as keyof typeof mergedContent.en] = result.content.en[key];
              }
            });
          }
          
          if (result.content.es) {
            Object.keys(result.content.es).forEach(key => {
              if (result.content.es[key] && typeof result.content.es[key] === 'object') {
                mergedContent.es[key as keyof typeof mergedContent.es] = { 
                  ...mergedContent.es[key as keyof typeof mergedContent.es], 
                  ...result.content.es[key] 
                };
              } else {
                mergedContent.es[key as keyof typeof mergedContent.es] = result.content.es[key];
              }
            });
          }
          
          console.log('🔍 Merged content keys:', Object.keys(mergedContent.en));
          console.log('🔍 Merged nav keys:', Object.keys(mergedContent.en.nav || {}));
          
          setContent(mergedContent);
        } else {
          // Fallback to defaults if backend returns empty content
          console.log('🔍 Using default translations (no API content)');
          // Don't update content if we already have defaults
        }
      } else {
        console.warn('Failed to fetch translations from backend, using defaults');
        // Don't update content if we already have defaults
      }
    } catch (error) {
      console.error('Error fetching translations:', error);
      // Don't update content if we already have defaults
    }
  }, []);

  // Single useEffect to handle content initialization and language changes
  useEffect(() => {
    console.log(`🔄 useEffect triggered - initialContent:`, !!initialContent, 'language:', currentLanguage);
    
    // Only set initial content if it's provided and valid
    if (initialContent && Object.keys(initialContent).length > 0) {
      console.log('✅ Using initial content for language:', currentLanguage);
      setContent(initialContent);
    } else {
      // Ensure we have default translations first
      setContent(defaultTranslations);
      // Only fetch from backend if we haven't fetched yet and we're in the browser
      // Temporarily disabled to test if this is causing the infinite loop
      // if (!hasFetchedRef.current && typeof window !== 'undefined') {
      //   console.log('🔄 Fetching fresh content from backend for language:', currentLanguage);
      //   hasFetchedRef.current = true;
      //   fetchTranslations();
      // }
    }
  }, [initialContent, fetchTranslations, currentLanguage]); // Include currentLanguage dependency

  // Separate useEffect to handle language changes specifically
  useEffect(() => {
    if (content && Object.keys(content).length > 0) {
      // Only log when language actually changes, not on every content update
      console.log(`🔄 Language changed to: ${currentLanguage}, content available:`, Object.keys(content));
    }
  }, [currentLanguage, content]); // Include content in dependencies

  const updateContent = async (newContent: Record<string, unknown>) => {
    try {
      setIsLoading(true);
      
      // Update content via API
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContent),
      });

      if (response.ok) {
        const result = await response.json();
        setContent(result.content);
        return { success: true, data: result.content };
      } else {
        throw new Error('Failed to update content');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const reloadTranslations = React.useCallback(() => {
    hasFetchedRef.current = false; // Reset the fetch flag
    fetchTranslations();
  }, [fetchTranslations]);

  // Get the current language translations, fallback to English if current language not found
  const t = useMemo(() => {
    if (content && typeof content === 'object') {
      // Try current language first
      if (content[currentLanguage as keyof typeof content] && typeof content[currentLanguage as keyof typeof content] === 'object') {
        return content[currentLanguage as keyof typeof content];
      }
      // Fallback to English
      if (content.en && typeof content.en === 'object') {
        return content.en;
      }
    }
    // Final fallback to default translations
    return defaultTranslations[currentLanguage as keyof typeof defaultTranslations] || defaultTranslations.en;
  }, [content, currentLanguage]);
  
  // Ensure t is always an object and not undefined
  const safeT = t && typeof t === 'object' ? t : defaultTranslations.en;


  return { t: safeT, updateContent, isLoading, content, reloadTranslations };
}