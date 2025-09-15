# Izipay Payment Integration

This document provides comprehensive information about the Izipay payment integration for the wellness monorepo, enabling credit card payments in Peru using Peruvian Sol (PEN) currency.

## Overview

Izipay is a secure payment gateway specifically designed for Peru, supporting major credit and debit cards including Visa, Mastercard, American Express, and Diners Club. The integration provides:

- **Secure Payment Processing**: 3D Secure authentication and tokenization
- **Multiple Payment Methods**: Credit/debit cards from major providers
- **Local Currency Support**: Payments in Peruvian Sol (PEN)
- **Flexible Integration**: Both redirect and embedded payment forms
- **Webhook Support**: Real-time payment status notifications

## Prerequisites

1. **Izipay Account**: Sign up at [Izipay Peru](https://www.izipay.pe/)
2. **API Credentials**: Obtain from your Izipay merchant dashboard
3. **Webhook URL**: Configure webhook endpoint in Izipay dashboard

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Izipay Configuration
IZIPAY_MERCHANT_ID=your_merchant_id
IZIPAY_USERNAME=your_username
IZIPAY_PASSWORD=your_password
IZIPAY_PUBLIC_KEY=your_public_key
IZIPAY_ENVIRONMENT=sandbox  # or 'production'

# Next.js URL for webhook callbacks
NEXTAUTH_URL=http://localhost:3000  # or your production URL
```

### Environment Variables Explanation

- `IZIPAY_MERCHANT_ID`: Your unique merchant identifier
- `IZIPAY_USERNAME`: API username for authentication
- `IZIPAY_PASSWORD`: API password for authentication
- `IZIPAY_PUBLIC_KEY`: Public key for signature verification
- `IZIPAY_ENVIRONMENT`: Set to 'sandbox' for testing, 'production' for live payments

## Database Setup

### 1. Run Migration

The integration includes a database migration to add PEN currency and Izipay payment method:

```bash
# Run the migration
npx prisma migrate deploy
```

### 2. Seed Payment Methods

Update your database with the new payment methods:

```bash
# Run the seed script
node scripts/seed-payment-methods-with-icons.js
```

### 3. Update Currency Data

Ensure PEN currency is available:

```bash
# Run the main seed script
npx prisma db seed
```

## API Endpoints

### Create Payment Intent

**Endpoint**: `POST /api/izipay/create-payment-intent`

Creates a payment intent for processing with Izipay.

**Request Body**:
```json
{
  "amount": 100.00,
  "currency": "PEN",
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "description": "Wellness Services Payment",
  "packagePriceId": 1,
  "quantity": 1,
  "metadata": {
    "customField": "value"
  }
}
```

**Response**:
```json
{
  "success": true,
  "paymentUrl": "https://api.micuentaweb.pe/vads-payment/entry.silentInit.a?vads_form_token=...",
  "transactionId": "form_token_here",
  "orderId": "WLN_1234567890_abcdef123",
  "amount": 100.00,
  "currency": "PEN",
  "message": "Payment intent created successfully"
}
```

### Webhook Handler

**Endpoint**: `POST /api/izipay/webhook`

Handles payment status notifications from Izipay.

**Webhook Payload** (from Izipay):
```json
{
  "transactionId": "form_token_here",
  "orderId": "WLN_1234567890_abcdef123",
  "status": "PAID",
  "amount": 10000,
  "currency": "PEN",
  "paymentMethod": "CARD",
  "timestamp": "2023-09-14T10:30:00Z",
  "signature": "signature_hash"
}
```

## React Components

### 1. IzipayPaymentButton

Simple payment button that redirects to Izipay payment page.

```tsx
import { IzipayPaymentButton } from '@/components/izipay/IzipayPaymentButton';

<IzipayPaymentButton
  amount={100.00}
  currency="PEN"
  customerEmail="customer@example.com"
  customerName="John Doe"
  description="Wellness Services"
  onSuccess={(result) => console.log('Payment successful:', result)}
  onError={(error) => console.error('Payment error:', error)}
/>
```

### 2. IzipayInlineForm

Embedded payment form (requires Izipay JavaScript SDK).

```tsx
import { IzipayInlineForm } from '@/components/izipay/IzipayInlineForm';

<IzipayInlineForm
  amount={100.00}
  currency="PEN"
  customerEmail="customer@example.com"
  customerName="John Doe"
  description="Wellness Services"
  onSuccess={(result) => console.log('Payment successful:', result)}
  onError={(error) => console.error('Payment error:', error)}
/>
```

### 3. IzipayPaymentMethod

Complete payment method component with features and options.

```tsx
import { IzipayPaymentMethod } from '@/components/izipay/IzipayPaymentMethod';

<IzipayPaymentMethod
  amount={100.00}
  currency="PEN"
  customerEmail="customer@example.com"
  customerName="John Doe"
  variant="card"
  showFeatures={true}
  onSuccess={(result) => console.log('Payment successful:', result)}
  onError={(error) => console.error('Payment error:', error)}
/>
```

## Payment Service

### IzipayPaymentService

The main service class for Izipay integration:

```typescript
import { IzipayPaymentService } from '@/lib/izipay/payment-service';

// Create payment intent
const result = await IzipayPaymentService.createPaymentIntent({
  amount: 100.00,
  currency: 'PEN',
  customerEmail: 'customer@example.com',
  customerName: 'John Doe',
  orderId: 'unique_order_id',
  description: 'Wellness Services Payment'
});

// Get payment details
const details = await IzipayPaymentService.getPaymentDetails('transaction_id');

// Process refund
const refund = await IzipayPaymentService.refundPayment('transaction_id', 50.00);
```

## Webhook Configuration

### 1. Izipay Dashboard Setup

1. Log into your Izipay merchant dashboard
2. Navigate to **Configuration** > **Webhooks**
3. Add webhook URL: `https://yourdomain.com/api/izipay/webhook`
4. Select events: `payment.success`, `payment.failed`, `payment.cancelled`
5. Save configuration

### 2. Webhook Security

The webhook handler automatically verifies signatures using your public key to ensure authenticity.

## Testing

### 1. Sandbox Environment

Use the following test card numbers in sandbox mode:

- **Successful Payment**: `4970100000000003`
- **Failed Payment**: `4970100000000004`
- **3D Secure**: `4970100000000005`

### 2. Test Flow

1. Set `IZIPAY_ENVIRONMENT=sandbox`
2. Use test credentials from Izipay dashboard
3. Make test payments using sandbox card numbers
4. Verify webhook notifications are received

## Production Deployment

### 1. Environment Setup

```bash
# Production environment variables
IZIPAY_ENVIRONMENT=production
IZIPAY_MERCHANT_ID=your_production_merchant_id
IZIPAY_USERNAME=your_production_username
IZIPAY_PASSWORD=your_production_password
IZIPAY_PUBLIC_KEY=your_production_public_key
NEXTAUTH_URL=https://yourdomain.com
```

### 2. SSL Certificate

Ensure your webhook URL uses HTTPS in production.

### 3. Webhook URL Update

Update webhook URL in Izipay dashboard to production URL:
`https://yourdomain.com/api/izipay/webhook`

## Error Handling

### Common Error Codes

- **400**: Invalid request parameters
- **401**: Authentication failed
- **403**: Insufficient permissions
- **404**: Resource not found
- **500**: Internal server error

### Error Response Format

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error message",
  "details": {
    "additionalInfo": "value"
  }
}
```

## Security Considerations

1. **Environment Variables**: Never expose credentials in client-side code
2. **Webhook Verification**: Always verify webhook signatures
3. **HTTPS**: Use HTTPS for all webhook endpoints in production
4. **Input Validation**: Validate all payment parameters
5. **Error Logging**: Log errors without exposing sensitive data

## Monitoring and Logging

### Payment Tracking

All payments are tracked in the database with:
- Purchase records
- Payment records
- Transaction IDs
- Status updates

### Webhook Logs

Webhook events are logged for debugging and monitoring:
```bash
# View webhook logs
tail -f logs/izipay-webhook.log
```

## Troubleshooting

### Common Issues

1. **Invalid Credentials**: Verify environment variables
2. **Webhook Not Received**: Check URL configuration in Izipay dashboard
3. **Payment Fails**: Verify test card numbers in sandbox
4. **Currency Issues**: Ensure PEN currency is properly configured

### Debug Mode

Enable debug logging:
```bash
DEBUG=izipay:* npm run dev
```

## Support and Resources

- **Izipay Documentation**: [https://developers.izipay.pe/](https://developers.izipay.pe/)
- **Izipay Support**: Contact through merchant dashboard
- **Integration Support**: Check this repository's issues

## Changelog

- **v1.0.0**: Initial Izipay integration with PEN currency support
- Components: Payment button, inline form, payment method selector
- API: Payment intent creation and webhook handling
- Database: PEN currency and Izipay payment method configuration

---

For additional help or questions about the Izipay integration, please refer to the official Izipay documentation or create an issue in this repository.
