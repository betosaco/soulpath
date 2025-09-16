# Izipay Credentials Issue - Resolution Guide

## 🚨 Current Issue

The Izipay payment integration is failing with error `INT_905: "invalid login or private key"`. This indicates that the current credentials in `.env.local` are placeholder values and not valid Izipay credentials.

## 🔍 Error Details

```
Error Code: INT_905
Error Message: "invalid login or private key"
Status: ERROR
Mode: TEST
```

## 📋 Required Actions

### 1. Get Valid Izipay Credentials

You need to obtain valid Izipay credentials from your Izipay account:

1. **Log into your Izipay merchant account**
2. **Navigate to the API section**
3. **Generate or retrieve your API credentials:**
   - Username
   - Password
   - Public Key
   - HMAC Key

### 2. Update Environment Variables

Replace the placeholder values in `.env.local` with your actual Izipay credentials:

```bash
# Current placeholder values (INVALID)
IZIPAY_TEST_USERNAME=88569105
IZIPAY_TEST_PASSWORD=testpassword_NS]pdOEIQsM4RMu16WF89kCViBW9ddilhEdsq02sHA2T
IZIPAY_TEST_PUBLIC_KEY=88569105:testpublickey_oHKEsiKA3i9E1JshcnIA7RktrR163DdRZYZYOWgXqwSx
IZIPAY_TEST_HMAC_KEY=H9ataKGBMUFzH8F0kz4ihdw3MTBb0WbpJ1TLLuRL<HZM1

# Replace with your actual credentials
IZIPAY_TEST_USERNAME=your_actual_username
IZIPAY_TEST_PASSWORD=your_actual_password
IZIPAY_TEST_PUBLIC_KEY=your_actual_public_key
IZIPAY_TEST_HMAC_KEY=your_actual_hmac_key
```

### 3. Test Credentials

After updating the credentials, test them using:

```bash
node test-izipay-credentials.js
```

This should return a `SUCCESS` status instead of `ERROR`.

## 🛠️ Alternative: Mock Payment for Development

If you don't have Izipay credentials yet, you can temporarily use a mock payment system for development:

1. **Enable mock mode** in the Izipay configuration
2. **Use test credentials** that always return success
3. **Implement a fallback** for development

## 📞 Support

If you need help obtaining Izipay credentials:

1. **Contact Izipay support** directly
2. **Check your Izipay merchant dashboard**
3. **Review Izipay documentation** for credential generation

## 🔗 Useful Links

- [Izipay Developer Documentation](https://www.izipay.com/developers)
- [Izipay API Reference](https://www.izipay.com/developers/api-reference)
- [Izipay Error Codes](https://www.izipay.com/developers/error-codes)

## ✅ Next Steps

1. Get valid Izipay credentials
2. Update `.env.local` with real credentials
3. Test the payment integration
4. Deploy to production with production credentials
