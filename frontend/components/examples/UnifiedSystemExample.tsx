'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { 
  User, 
  Mail, 
  Calendar, 
  CheckCircle,
  Star
} from 'lucide-react';
import { UnifiedForm, FormField, FormSection } from '../UnifiedForm';
import { AppShell } from '../AppShell';

// Example validation schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  preferredContact: z.enum(['email', 'phone']).default('email'),
  newsletter: z.boolean().default(false)
});

type ContactFormData = z.infer<typeof contactSchema>;

/**
 * UnifiedSystemExample - Demonstrates the new unified component system
 * 
 * This example shows how to use:
 * - AppShell for consistent layout
 * - UnifiedForm for standardized form handling
 * - CSS custom properties for consistent styling
 * - Responsive design patterns
 * - Component composition
 */
export function UnifiedSystemExample() {
  const handleSubmit = async (data: ContactFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form submitted:', data);
  };

  return (
    <AppShell showFooter={false}>
      <div className="unified-container py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold unified-text-primary mb-4">
            Unified Component System
          </h1>
          <p className="text-lg unified-text-secondary max-w-2xl mx-auto">
            Experience the power of our unified booking and shopping system with 
            consistent design, mobile-first responsiveness, and seamless user experience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="unified-grid unified-grid-cols-3 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="unified-card unified-p-lg text-center"
          >
            <div className="unified-bg-primary unified-rounded-full w-16 h-16 unified-flex unified-items-center unified-justify-center mx-auto mb-4">
              <User className="w-8 h-8 unified-text-primary" />
            </div>
            <h3 className="text-xl font-semibold unified-text-primary mb-2">
              Unified Forms
            </h3>
            <p className="unified-text-secondary">
              Consistent form handling with Zod validation and unified styling
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="unified-card unified-p-lg text-center"
          >
            <div className="unified-bg-primary unified-rounded-full w-16 h-16 unified-flex unified-items-center unified-justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 unified-text-primary" />
            </div>
            <h3 className="text-xl font-semibold unified-text-primary mb-2">
              Master Booking
            </h3>
            <p className="unified-text-secondary">
              Single, coherent booking flow for all services and products
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="unified-card unified-p-lg text-center"
          >
            <div className="unified-bg-primary unified-rounded-full w-16 h-16 unified-flex unified-items-center unified-justify-center mx-auto mb-4">
              <Star className="w-8 h-8 unified-text-primary" />
            </div>
            <h3 className="text-xl font-semibold unified-text-primary mb-2">
              Design System
            </h3>
            <p className="unified-text-secondary">
              Consistent styling with CSS custom properties and utility classes
            </p>
          </motion.div>
        </div>

        {/* Example Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="unified-container-prose"
        >
          <div className="unified-card">
            <div className="unified-card__header">
              <h2 className="unified-card__title">Contact Form Example</h2>
              <p className="unified-card__subtitle">
                This form demonstrates the unified form system with validation
              </p>
            </div>
            <div className="unified-card__content">
              <UnifiedForm
                schema={contactSchema}
                initialValues={{
                  name: '',
                  email: '',
                  phone: '',
                  message: '',
                  preferredContact: 'email',
                  newsletter: false
                }}
                onSubmit={handleSubmit}
                submitButtonText="Send Message"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                submitButtonIcon={Mail as any}
              >
                {({ values, errors, setValue }) => (
                  <>
                    <FormSection title="Personal Information">
                      <div className="unified-grid unified-grid-cols-2">
                        <FormField 
                          label="Full Name" 
                          error={errors.name} 
                          required
                        >
                          <input
                            type="text"
                            value={values.name}
                            onChange={(e) => setValue('name', e.target.value)}
                            className="unified-form-input"
                            placeholder="Enter your full name"
                          />
                        </FormField>

                        <FormField 
                          label="Email Address" 
                          error={errors.email} 
                          required
                        >
                          <input
                            type="email"
                            value={values.email}
                            onChange={(e) => setValue('email', e.target.value)}
                            className="unified-form-input"
                            placeholder="Enter your email"
                          />
                        </FormField>
                      </div>

                      <FormField 
                        label="Phone Number" 
                        error={errors.phone}
                      >
                        <input
                          type="tel"
                          value={values.phone}
                          onChange={(e) => setValue('phone', e.target.value)}
                          className="unified-form-input"
                          placeholder="Enter your phone number"
                        />
                      </FormField>
                    </FormSection>

                    <FormSection title="Message Details">
                      <FormField 
                        label="Message" 
                        error={errors.message} 
                        required
                      >
                        <textarea
                          value={values.message}
                          onChange={(e) => setValue('message', e.target.value)}
                          className="unified-form-textarea"
                          rows={4}
                          placeholder="Tell us about your needs..."
                        />
                      </FormField>

                      <div className="unified-grid unified-grid-cols-2">
                        <FormField 
                          label="Preferred Contact Method" 
                          error={errors.preferredContact}
                        >
                          <select
                            value={values.preferredContact}
                            onChange={(e) => setValue('preferredContact', e.target.value as 'email' | 'phone')}
                            className="unified-form-select"
                          >
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                          </select>
                        </FormField>

                        <div className="unified-flex unified-items-center unified-space-x-md">
                          <input
                            type="checkbox"
                            id="newsletter"
                            checked={values.newsletter}
                            onChange={(e) => setValue('newsletter', e.target.checked)}
                            className="unified-form-checkbox"
                          />
                          <label htmlFor="newsletter" className="unified-form-label">
                            Subscribe to newsletter
                          </label>
                        </div>
                      </div>
                    </FormSection>
                  </>
                )}
              </UnifiedForm>
            </div>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold unified-text-primary text-center mb-8">
            Benefits of the Unified System
          </h2>
          
          <div className="unified-grid unified-grid-cols-2">
            <div className="unified-space-y-lg">
              <div className="unified-flex unified-items-start unified-space-x-md">
                <CheckCircle className="w-6 h-6 unified-text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold unified-text-primary mb-1">
                    Single Source of Truth
                  </h3>
                  <p className="unified-text-secondary text-sm">
                    All components follow the same design patterns and use consistent styling
                  </p>
                </div>
              </div>

              <div className="unified-flex unified-items-start unified-space-x-md">
                <CheckCircle className="w-6 h-6 unified-text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold unified-text-primary mb-1">
                    Mobile-First Design
                  </h3>
                  <p className="unified-text-secondary text-sm">
                    Built-in responsive design that works perfectly on all devices
                  </p>
                </div>
              </div>

              <div className="unified-flex unified-items-start unified-space-x-md">
                <CheckCircle className="w-6 h-6 unified-text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold unified-text-primary mb-1">
                    Type Safety
                  </h3>
                  <p className="unified-text-secondary text-sm">
                    Full TypeScript support with Zod validation for robust form handling
                  </p>
                </div>
              </div>
            </div>

            <div className="unified-space-y-lg">
              <div className="unified-flex unified-items-start unified-space-x-md">
                <CheckCircle className="w-6 h-6 unified-text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold unified-text-primary mb-1">
                    Performance Optimized
                  </h3>
                  <p className="unified-text-secondary text-sm">
                    Reduced bundle size through component consolidation and efficient rendering
                  </p>
                </div>
              </div>

              <div className="unified-flex unified-items-start unified-space-x-md">
                <CheckCircle className="w-6 h-6 unified-text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold unified-text-primary mb-1">
                    Developer Experience
                  </h3>
                  <p className="unified-text-secondary text-sm">
                    Predictable APIs, comprehensive documentation, and easy migration paths
                  </p>
                </div>
              </div>

              <div className="unified-flex unified-items-start unified-space-x-md">
                <CheckCircle className="w-6 h-6 unified-text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold unified-text-primary mb-1">
                    Maintainable Code
                  </h3>
                  <p className="unified-text-secondary text-sm">
                    DRY principles, consistent patterns, and centralized styling system
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
