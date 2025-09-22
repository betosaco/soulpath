# Contact Form Email Setup for MatMax Yoga Studio

This document explains how to set up the contact form email functionality for the MatMax Yoga Studio website.

## Overview

The contact form on the about page (`/about`) now sends emails using the Brevo email service instead of redirecting to WhatsApp. When a user submits the contact form:

1. An email notification is sent to `info@matmax.store` with the user's message
2. A confirmation email is sent to the user's email address
3. Both emails are sent using the Brevo API

## Setup Instructions

### 1. Get a Brevo API Key

1. Go to [Brevo](https://www.brevo.com/) and create an account
2. Navigate to Settings > API Keys
3. Create a new API key with SMTP permissions
4. Copy the API key (starts with `xkeys-`)

### 2. Configure the Email Service

#### Option A: Using the Setup Script (Recommended)

1. Set your Brevo API key as an environment variable:
   ```bash
   export BREVO_API_KEY="your-brevo-api-key-here"
   ```

2. Run the setup script:
   ```bash
   cd frontend
   node setup-matmax-email-config.js
   ```

#### Option B: Using the Admin Dashboard

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Go to the admin dashboard
3. Navigate to Communication Settings
4. Enter your Brevo API key and configure:
   - **Sender Email**: `info@matmax.store`
   - **Sender Name**: `MatMax Yoga Studio`
   - **Admin Email**: `info@matmax.store`

### 3. Test the Setup

1. Visit the about page: `http://localhost:3000/about`
2. Fill out the contact form
3. Submit the form
4. Check that:
   - A success message appears
   - An email is sent to `info@matmax.store`
   - A confirmation email is sent to the user's email

## API Endpoint

The contact form uses the `/api/contact/send-message` endpoint which:

- Validates the form data
- Creates HTML email templates for both admin and user emails
- Sends emails using the Brevo email service
- Returns success/error responses

## Email Templates

### Admin Notification Email
- **To**: `info@matmax.store`
- **Subject**: "New contact message from [Name] - MatMax Yoga"
- **Content**: Includes user's name, email, phone, and message
- **Language**: Supports both English and Spanish

### User Confirmation Email
- **To**: User's email address
- **Subject**: "Thank you for contacting us - MatMax Yoga Studio"
- **Content**: Confirmation message with studio contact information
- **Language**: Matches the user's selected language

## Troubleshooting

### Common Issues

1. **"Email service not configured" error**
   - Make sure the Brevo API key is set correctly
   - Check that the communication_config table has the correct settings

2. **Emails not being sent**
   - Verify the Brevo API key has SMTP permissions
   - Check the Brevo dashboard for any API errors
   - Ensure the sender email domain is verified in Brevo

3. **Database connection issues**
   - Make sure the DATABASE_URL environment variable is set
   - Check that the Supabase connection is working

### Testing

You can test the email functionality using the test script:

```bash
cd frontend
node test-contact-email.js
```

## Files Modified

- `app/api/contact/send-message/route.ts` - New API endpoint for contact form
- `app/about/page.tsx` - Updated to use email instead of WhatsApp
- `lib/brevo-email-service.ts` - Email service using Brevo API
- `setup-matmax-email-config.js` - Setup script for configuration
- `test-contact-email.js` - Test script for email functionality

## Environment Variables

Required environment variables:

- `BREVO_API_KEY` - Your Brevo API key
- `DATABASE_URL` - Database connection string (if not using default)

Optional environment variables (fallback values):

- `BREVO_SENDER_EMAIL` - Default: `info@matmax.store`
- `BREVO_SENDER_NAME` - Default: `MatMax Yoga Studio`
