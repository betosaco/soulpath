'use client';

import React, { useState } from 'react';
import { BaseInput } from '@/components/ui/BaseInput';
import { Textarea } from '@/components/ui/textarea';
import { CMSInput } from '@/components/cms/CMSInput';

export default function TestFormsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    select: '',
    checkbox: false,
    radio: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Form Styling Test Page
          </h1>
          <p className="text-lg text-gray-600">
            Test the improved form styling and components
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* BaseInput Examples */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              BaseInput Components
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <BaseInput
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                error={errors.name}
                required
              />

              <BaseInput
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                error={errors.email}
                required
                hint="We'll never share your email"
              />

              <BaseInput
                label="Phone Number"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                error={errors.phone}
                required
              />

              <div className="unified-form-group">
                <label className="unified-form-label">Select Option</label>
                <select
                  className="unified-form-select"
                  value={formData.select}
                  onChange={(e) => setFormData({...formData, select: e.target.value})}
                >
                  <option value="">Choose an option</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
              </div>

              <Textarea
                placeholder="Enter your message here..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="unified-form-textarea"
              />

              <div className="unified-form-checkbox">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.checkbox}
                  onChange={(e) => setFormData({...formData, checkbox: e.target.checked})}
                />
                <label htmlFor="terms">I agree to the terms and conditions</label>
              </div>

              <div className="unified-form-radio">
                <input
                  type="radio"
                  id="option1"
                  name="radio"
                  value="option1"
                  checked={formData.radio === 'option1'}
                  onChange={(e) => setFormData({...formData, radio: e.target.value})}
                />
                <label htmlFor="option1">Option 1</label>
              </div>

              <div className="unified-form-radio">
                <input
                  type="radio"
                  id="option2"
                  name="radio"
                  value="option2"
                  checked={formData.radio === 'option2'}
                  onChange={(e) => setFormData({...formData, radio: e.target.value})}
                />
                <label htmlFor="option2">Option 2</label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#6ea058] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#5a8a47] transition-colors"
              >
                Submit Form
              </button>
            </form>
          </div>

          {/* CMSInput Examples */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              CMSInput Components
            </h2>
            
            <div className="space-y-6">
              <CMSInput
                label="CMS Text Input"
                placeholder="Enter text here"
                value={formData.name}
                onChange={(value) => setFormData({...formData, name: value})}
                error={errors.name}
                required
              />

              <CMSInput
                label="CMS Email Input"
                type="email"
                placeholder="Enter email here"
                value={formData.email}
                onChange={(value) => setFormData({...formData, email: value})}
                error={errors.email}
                required
              />

              <CMSInput
                label="CMS Textarea"
                multiline
                rows={4}
                placeholder="Enter your message here"
                value={formData.message}
                onChange={(value) => setFormData({...formData, message: value})}
              />

              <CMSInput
                label="Success State"
                placeholder="This field is valid"
                value="Valid input"
                onChange={() => {}}
                className="success"
              />

              <CMSInput
                label="Error State"
                placeholder="This field has an error"
                value=""
                onChange={() => {}}
                error="This field is required"
              />
            </div>
          </div>
        </div>

        {/* Form States Demo */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Form States Demo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Normal State</h3>
              <BaseInput
                placeholder="Normal input field"
                value=""
                onChange={() => {}}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Error State</h3>
              <BaseInput
                placeholder="Error input field"
                value=""
                onChange={() => {}}
                error="This field has an error"
                className="error"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Success State</h3>
              <BaseInput
                placeholder="Success input field"
                value="Valid input"
                onChange={() => {}}
                className="success"
              />
            </div>
          </div>
        </div>

        {/* Mobile Responsiveness Note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            📱 Mobile Testing
          </h3>
          <p className="text-blue-800">
            Test this page on mobile devices to see the responsive form styling. 
            The forms are optimized for touch interactions and mobile screens.
          </p>
        </div>
      </div>
    </div>
  );
}
