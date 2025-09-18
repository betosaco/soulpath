# Lyra Payment Integration

This document describes the Lyra payment integration for the Peruvian market using the MiCuentaWeb platform.

## Overview

The Lyra integration allows processing payments in Peruvian Soles (PEN) through the MiCuentaWeb payment gateway. This integration is designed to work alongside the existing Stripe integration.

## Components

### 1. LyraPaymentService (`lib/lyra/payment-service.ts`)

A service class that handles:
- Creating form tokens (server-side only)
- Validating payment responses
- Managing Lyra configuration

### 2. LyraPaymentForm (`components/LyraPaymentForm.tsx`)

A React component that:
- Renders the Lyra payment form
- Handles payment flow
- Provides success/error callbacks
- Manages loading states

### 3. API Routes

- `api/lyra/create-token/route.ts` - Creates form tokens securely
- `api/lyra/validate/route.ts` - Validates payment responses

### 4. Pages

- `app/test-lyra/page.tsx` - Test page for development
- `app/payment-success/page.tsx` - Success page after payment

## Environment Variables

Add these to your `.env.local` file:

```env
# Lyra Payment Integration (Peruvian Market)
LYRA_USERNAME="your_lyra_username"
LYRA_PASSWORD="your_lyra_password"
LYRA_PUBLIC_KEY="your_lyra_public_key"
```

## Usage

### Basic Usage

```tsx
import LyraPaymentForm from '@/components/LyraPaymentForm';

function CheckoutPage() {
  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    // Handle successful payment
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    // Handle payment error
  };

  return (
    <LyraPaymentForm
      amount={500} // Amount in cents (S/ 5.00)
      currency="PEN"
      orderId="unique-order-id"
      customer={{
        email: "customer@example.com",
        name: "Customer Name"
      }}
      onSuccess={handlePaymentSuccess}
      onError={handlePaymentError}
    />
  );
}
```

### Advanced Usage with Metadata

```tsx
<LyraPaymentForm
  amount={1000} // S/ 10.00
  currency="PEN"
  orderId="order-123"
  customer={{
    email: "customer@example.com",
    name: "Customer Name",
    phone: "+51987654321"
  }}
  metadata={{
    packageId: "pkg-123",
    userId: "user-456",
    source: "web"
  }}
  onSuccess={handlePaymentSuccess}
  onError={handlePaymentError}
  className="custom-styles"
/>
```

## Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/test-lyra` to test the integration

3. Use the test credentials provided by Lyra

## Security Considerations

1. **Never expose credentials on the client side** - The form token is always generated server-side
2. **Validate payments server-side** - Always validate payment responses on your server
3. **Use HTTPS in production** - Ensure all payment communications are encrypted
4. **Store credentials securely** - Use environment variables and secure secret management

## Integration with Existing Payment System

The Lyra integration is designed to work alongside your existing Stripe integration:

1. **Payment Methods**: Add "LYRA" as a payment method in your database
2. **Payment Records**: Use the existing `PaymentRecord` model
3. **API Integration**: Extend your existing payment API to support Lyra

## Error Handling

The integration provides comprehensive error handling:

- **Network errors**: Connection issues with Lyra API
- **Validation errors**: Invalid payment data
- **Payment errors**: Declined payments or processing errors
- **Form errors**: Issues with the payment form itself

## Customization

### Styling

The payment form can be customized using the `className` prop:

```tsx
<LyraPaymentForm
  // ... other props
  className="my-custom-payment-form"
/>
```

### Language

The form language is set to Spanish (es-PE) by default. To change it, modify the `kr-language` parameter in the `LyraPaymentForm` component.

### Success/Error Handling

You can provide custom success and error handlers:

```tsx
<LyraPaymentForm
  // ... other props
  onSuccess={(paymentData) => {
    // Custom success logic
    router.push('/custom-success-page');
  }}
  onError={(error) => {
    // Custom error handling
    showNotification('Payment failed: ' + error);
  }}
/>
```

## Production Deployment

1. **Environment Variables**: Set up production environment variables
2. **Webhook Configuration**: Configure Lyra webhooks for payment notifications
3. **SSL Certificate**: Ensure your domain has a valid SSL certificate
4. **Testing**: Test thoroughly with small amounts before going live

## Support

For issues with the Lyra integration:

1. Check the browser console for error messages
2. Verify environment variables are set correctly
3. Test with the provided test credentials
4. Check Lyra documentation for API changes

## Related Files

- `lib/lyra/payment-service.ts` - Core service
- `components/LyraPaymentForm.tsx` - React component
- `app/api/lyra/create-token/route.ts` - Token creation API
- `app/api/lyra/validate/route.ts` - Payment validation API
- `app/test-lyra/page.tsx` - Test page
- `app/payment-success/page.tsx` - Success page
