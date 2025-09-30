# Teacher Application Form Setup

This document explains how to set up the teacher application form with Brevo email integration.

## Features

- **Comprehensive Application Form**: Collects personal information, professional experience, certifications, and teaching preferences
- **Email Integration**: Uses Brevo API to send application notifications to admin and confirmation emails to applicants
- **Form Validation**: Client-side and server-side validation with user-friendly error messages
- **Responsive Design**: Mobile-first design that works on all devices
- **Multi-language Support**: Supports Spanish and English

## Environment Variables Setup

### Required Environment Variables

Add these environment variables to your `.env.local` file in the `frontend` directory:

```bash
# Brevo Email Configuration
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=noreply@matmax.world
BREVO_SENDER_NAME=MatMax Wellness
ADMIN_EMAIL=admin@matmax.world
```

### Getting Your Brevo API Key

1. Sign up for a Brevo account at [https://www.brevo.com](https://www.brevo.com)
2. Go to your account settings
3. Navigate to "SMTP & API" section
4. Generate a new API key
5. Copy the API key and add it to your environment variables

## API Endpoints

### POST `/api/teacher-application`

Handles teacher application form submissions.

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "phone": "string",
  "dateOfBirth": "string",
  "address": "string",
  "city": "string",
  "country": "string",
  "yogaStyle": "string",
  "experienceYears": "string",
  "certifications": "string",
  "teachingLanguages": ["string"],
  "availability": "string",
  "motivation": "string",
  "specializations": "string",
  "references": "string",
  "portfolio": "string",
  "agreeToTerms": boolean,
  "agreeToDataProcessing": boolean
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully"
}
```

## Email Templates

The system sends two types of emails:

1. **Admin Notification Email**: Sent to the admin email with all application details
2. **Confirmation Email**: Sent to the applicant confirming receipt of their application

Both emails are sent in HTML and plain text formats for maximum compatibility.

## Form Fields

### Personal Information
- First Name (required)
- Last Name (required)
- Email (required)
- Phone (required)
- Date of Birth (required)
- Address (required)
- City (required)
- Country (required)

### Professional Information
- Primary Yoga Style (required)
- Years of Teaching Experience (required)
- Certifications & Training
- Teaching Languages (required - at least one)
- Availability

### Additional Information
- Motivation for joining MatMax (required)
- Specializations & Interests
- Professional References
- Portfolio/Website

### Terms & Conditions
- Agreement to Terms of Service and Privacy Policy (required)
- Consent to data processing (required)

## Navigation

The teacher application form is accessible via:
- **Footer Link**: "Apply as Teacher" in the Quick Links section
- **Direct URL**: `/apply-teacher`

## Styling

The form uses the existing design system with:
- CSS custom properties for consistent theming
- Responsive grid layouts
- Modern form components (Input, Textarea, Select, Checkbox)
- Toast notifications for user feedback
- Loading states and success confirmation

## Security

- Form validation on both client and server side
- CORS headers properly configured
- Environment variables for sensitive data
- Terms and conditions acceptance required

## Testing

To test the form:

1. Set up the environment variables
2. Start the development server
3. Navigate to `/apply-teacher`
4. Fill out the form with test data
5. Submit and check that emails are sent correctly

## Troubleshooting

### Common Issues

1. **Emails not sending**: Check that BREVO_API_KEY is correctly set
2. **Form validation errors**: Ensure all required fields are filled
3. **CORS errors**: Verify CORS configuration in the API route

### Debug Mode

Check the browser console and server logs for detailed error messages. The API endpoint includes comprehensive error logging.
