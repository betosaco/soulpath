'use client';

import React, { useState } from 'react';
import { useTheme, useThemeSwitcher } from '@/lib/theme/ThemeProvider';
import { ThemeColors, currentTheme } from '@/lib/theme/theme-config';
import { themeClasses } from '@/lib/theme/theme-utils';
import { Settings, Palette, Save, RotateCcw } from 'lucide-react';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
}

function ColorInput({ label, value, onChange, description }: ColorInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[var(--color-text-primary)]">
        {label}
      </label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded-lg border border-[var(--color-border-medium)] cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-[var(--color-background-surface)] border border-[var(--color-border-medium)] rounded-lg text-[var(--color-text-primary)] text-sm"
          placeholder="#000000"
        />
      </div>
      {description && (
        <p className="text-xs text-[var(--color-text-secondary)]">{description}</p>
      )}
    </div>
  );
}

export function ThemeManager() {
  const { theme, setTheme } = useTheme();
  const { switchToTheme, currentTheme: currentThemeName } = useThemeSwitcher();
  const [isOpen, setIsOpen] = useState(false);
  const [customTheme, setCustomTheme] = useState<ThemeColors>(theme);

  const handleColorChange = (category: keyof ThemeColors, key: string, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const applyCustomTheme = () => {
    setTheme(customTheme, 'custom');
  };

  const resetToDefault = () => {
    setCustomTheme(currentTheme);
    setTheme(currentTheme, 'light');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-[var(--color-primary-main)] text-[var(--color-primary-contrast)] rounded-full shadow-lg hover:bg-[var(--color-primary-hover)] transition-all duration-200"
        title="Open Theme Manager"
      >
        <Palette className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--color-background-surface)] rounded-xl shadow-2xl m-4">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--color-background-surface)] border-b border-[var(--color-border-light)] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-[var(--color-primary-main)]" />
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                Theme Manager
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-[var(--color-background-secondary)] rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Quick Theme Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
              Quick Themes
            </h3>
            <div className="flex space-x-4">
              <button
                onClick={() => switchToTheme('light')}
                className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                  currentThemeName === 'light'
                    ? 'bg-[var(--color-primary-main)] text-[var(--color-primary-contrast)] border-[var(--color-primary-main)]'
                    : 'bg-[var(--color-background-surface)] text-[var(--color-text-primary)] border-[var(--color-border-medium)] hover:bg-[var(--color-background-secondary)]'
                }`}
              >
                Light Theme
              </button>
              <button
                onClick={() => switchToTheme('dark')}
                className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                  currentThemeName === 'dark'
                    ? 'bg-[var(--color-primary-main)] text-[var(--color-primary-contrast)] border-[var(--color-primary-main)]'
                    : 'bg-[var(--color-background-surface)] text-[var(--color-text-primary)] border-[var(--color-border-medium)] hover:bg-[var(--color-background-secondary)]'
                }`}
              >
                Dark Theme
              </button>
            </div>
          </div>

          {/* Custom Colors */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
              Customize Colors
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Primary Colors */}
              <div className="space-y-4">
                <h4 className="font-medium text-[var(--color-text-primary)]">Primary Colors (Buttons)</h4>
                <ColorInput
                  label="Main"
                  value={customTheme.primary.main}
                  onChange={(value) => handleColorChange('primary', 'main', value)}
                  description="Main button color"
                />
                <ColorInput
                  label="Hover"
                  value={customTheme.primary.hover}
                  onChange={(value) => handleColorChange('primary', 'hover', value)}
                  description="Button hover state"
                />
              </div>

              {/* Background Colors */}
              <div className="space-y-4">
                <h4 className="font-medium text-[var(--color-text-primary)]">Background Colors</h4>
                <ColorInput
                  label="Primary"
                  value={customTheme.background.primary}
                  onChange={(value) => handleColorChange('background', 'primary', value)}
                  description="Main background color"
                />
                <ColorInput
                  label="Secondary"
                  value={customTheme.background.secondary}
                  onChange={(value) => handleColorChange('background', 'secondary', value)}
                  description="Secondary background"
                />
              </div>

              {/* Text Colors */}
              <div className="space-y-4">
                <h4 className="font-medium text-[var(--color-text-primary)]">Text Colors</h4>
                <ColorInput
                  label="Primary"
                  value={customTheme.text.primary}
                  onChange={(value) => handleColorChange('text', 'primary', value)}
                  description="Main text color"
                />
                <ColorInput
                  label="Secondary"
                  value={customTheme.text.secondary}
                  onChange={(value) => handleColorChange('text', 'secondary', value)}
                  description="Secondary text"
                />
              </div>

              {/* Accent Colors */}
              <div className="space-y-4">
                <h4 className="font-medium text-[var(--color-text-primary)]">Accent Colors</h4>
                <ColorInput
                  label="Main"
                  value={customTheme.accent.main}
                  onChange={(value) => handleColorChange('accent', 'main', value)}
                  description="Accent/highlight color"
                />
                <ColorInput
                  label="Hover"
                  value={customTheme.accent.hover}
                  onChange={(value) => handleColorChange('accent', 'hover', value)}
                  description="Accent hover state"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[var(--color-text-primary)]">Preview</h3>
            <div className="p-6 bg-[var(--color-background-secondary)] rounded-lg space-y-4">
              <div className="flex space-x-4">
                <button className={themeClasses.button.primary + ' px-4 py-2 rounded-lg'}>
                  Primary Button
                </button>
                <button className={themeClasses.button.accent + ' px-4 py-2 rounded-lg'}>
                  Accent Button
                </button>
                <button className={themeClasses.button.outline + ' px-4 py-2 rounded-lg'}>
                  Outline Button
                </button>
              </div>
              <div className={themeClasses.card.default + ' p-4'}>
                <h4 className={themeClasses.text.primary + ' font-medium mb-2'}>Card Example</h4>
                <p className={themeClasses.text.secondary}>
                  This is how your theme will look in cards and components.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4 border-t border-[var(--color-border-light)]">
            <button
              onClick={applyCustomTheme}
              className={themeClasses.button.primary + ' px-6 py-2 rounded-lg flex items-center space-x-2'}
            >
              <Save className="w-4 h-4" />
              <span>Apply Theme</span>
            </button>
            <button
              onClick={resetToDefault}
              className={themeClasses.button.outline + ' px-6 py-2 rounded-lg flex items-center space-x-2'}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Default</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
