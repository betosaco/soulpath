# Lyra Payment Integration - Production Setup Guide

This guide explains how to configure and deploy the Lyra payment integration for production use in the Peruvian market.

## 🔧 Production Configuration

### Environment Variables

Create a `.env.production` file or set these environment variables in your production environment:

```env
# Lyra Payment Integration - Production Environment
NODE_ENV=production
LYRA_ENVIRONMENT=production

# Production Credentials
LYRA_USERNAME="prodpassword_di6IeBzwz6ccq3OfeWkUmGN5s6PmhX67l6RrKJHSicFPh"
LYRA_PASSWORD="88569105"
LYRA_PUBLIC_KEY="publickey_UKrWqzlcOvfMEi4OdXuBAcGK1TaTK6izlIJZYWwHGCqkv"

# HMAC-SHA-256 Keys for signature validation
LYRA_HMAC_TEST_KEY="H9qtqKGBMUFzH8F0kz4ihdw3MTBb0WbpJ1TLLuRLxHZM1"
LYRA_HMAC_PROD_KEY="L1tb9IvJNUHb1r120tn0CXfKjaacKrwTVhH6yLX6w5SUw"

# API Endpoints
LYRA_API_ENDPOINT="https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment"
LYRA_JS_LIBRARY_URL="https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js"

# Return URLs (UPDATE THESE WITH YOUR ACTUAL DOMAIN)
LYRA_RETURN_URL_SUCCESS="https://yourdomain.com/payment-success"
LYRA_RETURN_URL_ERROR="https://yourdomain.com/payment-error"
LYRA_RETURN_URL_CANCEL="https://yourdomain.com/payment-cancel"

# Webhook URL (UPDATE WITH YOUR ACTUAL DOMAIN)
LYRA_WEBHOOK_URL="https://yourdomain.com/api/lyra/webhook"
```

## 🔐 Security Configuration

### HMAC-SHA-256 Validation

The integration uses HMAC-SHA-256 signatures to validate payment responses from Lyra:

- **Test Key**: `H9qtqKGBMUFzH8F0kz4ihdw3MTBb0WbpJ1TLLuRLxHZM1`
- **Production Key**: `L1tb9IvJNUHb1r120tn0CXfKjaacKrwTVhH6yLX6w5SUw`

### Signature Validation Process

1. Lyra sends payment data with a `kr-hash` field containing the HMAC signature
2. The system validates the signature using the appropriate HMAC key
3. Only valid signatures are processed as successful payments

## 🚀 Deployment Steps

### 1. Update Domain URLs

Before deploying, update the following URLs in your environment variables:

```env
# Replace 'yourdomain.com' with your actual domain
LYRA_RETURN_URL_SUCCESS="https://yourdomain.com/payment-success"
LYRA_RETURN_URL_ERROR="https://yourdomain.com/payment-error"
LYRA_RETURN_URL_CANCEL="https://yourdomain.com/payment-cancel"
LYRA_WEBHOOK_URL="https://yourdomain.com/api/lyra/webhook"
```

### 2. Configure Lyra Dashboard

In your Lyra merchant dashboard, configure:

1. **Return URLs**:
   - Success: `https://yourdomain.com/payment-success`
   - Error: `https://yourdomain.com/payment-error`
   - Cancel: `https://yourdomain.com/payment-cancel`

2. **Webhook URL**:
   - `https://yourdomain.com/api/lyra/webhook`

3. **HMAC Key**:
   - Use the production key: `L1tb9IvJNUHb1r120tn0CXfKjaacKrwTVhH6yLX6w5SUw`

### 3. Test the Integration

Before going live, test the integration:

1. Use test card numbers provided by Lyra
2. Verify return URL handling
3. Test webhook processing
4. Validate HMAC signature verification

## 📋 API Endpoints

### Create Payment Token
```
POST /api/lyra/create-token
```

### Validate Payment Response
```
POST /api/lyra/validate
GET /api/lyra/validate?kr-hash=...&kr-status=...
```

### Webhook Handler
```
POST /api/lyra/webhook
```

## 🔍 Monitoring and Logging

### Payment Flow Monitoring

Monitor these key events:

1. **Form Token Creation**: Check for successful token generation
2. **Payment Processing**: Monitor payment status changes
3. **Webhook Processing**: Ensure webhooks are received and processed
4. **HMAC Validation**: Verify signature validation is working

### Error Handling

The integration includes comprehensive error handling for:

- Invalid credentials
- Network timeouts
- HMAC validation failures
- Payment status errors
- Webhook processing errors

## 🛡️ Security Best Practices

1. **Environment Variables**: Never commit production credentials to version control
2. **HMAC Validation**: Always validate signatures before processing payments
3. **HTTPS Only**: Ensure all URLs use HTTPS in production
4. **Webhook Security**: Implement additional webhook validation if needed
5. **Logging**: Log payment events for audit trails (without sensitive data)

## 📊 Production Checklist

- [ ] Environment variables configured
- [ ] Domain URLs updated
- [ ] Lyra dashboard configured
- [ ] HMAC keys set correctly
- [ ] Return URLs tested
- [ ] Webhook endpoint tested
- [ ] Payment flow tested
- [ ] Error handling verified
- [ ] Monitoring configured
- [ ] Security review completed

## 🆘 Troubleshooting

### Common Issues

1. **Invalid HMAC Signature**
   - Verify the correct HMAC key is being used
   - Check that the data string format matches Lyra's requirements

2. **Payment Not Processing**
   - Verify credentials are correct
   - Check API endpoint URLs
   - Ensure proper error handling

3. **Webhook Not Received**
   - Verify webhook URL is accessible
   - Check Lyra dashboard configuration
   - Review server logs for errors

### Support

For technical support with Lyra integration:
- Check the [Lyra documentation](https://docs.lyra.com/)
- Contact Lyra support for payment gateway issues
- Review application logs for debugging

## 📈 Performance Considerations

- The integration is optimized for the Peruvian market
- Uses CDN-hosted JavaScript libraries
- Implements efficient HMAC validation
- Includes proper error handling and retry logic

## 🔄 Maintenance

Regular maintenance tasks:

1. Monitor payment success rates
2. Review error logs
3. Update dependencies
4. Test webhook functionality
5. Verify HMAC validation
6. Check return URL accessibility
