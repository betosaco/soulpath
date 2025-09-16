# Izipay Payment Integration Setup Guide

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)
```bash
./setup-izipay-env.sh
```

### Option 2: Manual Setup

## 📝 Local Environment Setup

Create a `.env.local` file in the frontend directory:

```env
# Izipay Configuration
# Test Environment
IZIPAY_TEST_USERNAME=88569105
IZIPAY_TEST_PASSWORD=testpassword_NS]pdOEIQsM4RMu16WF89kCViBW9ddilhEdsq02sHA2T
IZIPAY_TEST_PUBLIC_KEY=88569105:testpublickey_oHKEsiKA3i9E1JshcnIA7RktrR163DdRZYZYOWgXqwSXx
IZIPAY_TEST_HMAC_KEY=H9ataKGBMUFzH8F0kz4ihdw3MTBb0WbpJ1TLLuRL<HZM1

# Production Environment
IZIPAY_PROD_USERNAME=88569105
IZIPAY_PROD_PASSWORD=prodpassword_di6IeBzwz6ccq30feWkUmGN5s6PmhX67|6RrKJHSicFPh
IZIPAY_PROD_PUBLIC_KEY=88569105:publickey UKrWazicOvfMEi40dXuBAcGK1TaTK6izIIJZYWWHGCakv
IZIPAY_PROD_HMAC_KEY=XnvOuum4jpXuY9U1BbpoY3tPK0KRy3|vBfw1ZKmp2G2Sz

# Izipay API Configuration
IZIPAY_API_BASE_URL=https://api.micuentaweb.pe
IZIPAY_JAVASCRIPT_URL=https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js
```

## ☁️ Vercel Environment Setup

### Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`

### Add Environment Variables to Vercel

Run these commands to add each environment variable:

```bash
# Test Environment Variables
vercel env add IZIPAY_TEST_USERNAME production
# Enter: 88569105

vercel env add IZIPAY_TEST_PASSWORD production
# Enter: testpassword_NS]pdOEIQsM4RMu16WF89kCViBW9ddilhEdsq02sHA2T

vercel env add IZIPAY_TEST_PUBLIC_KEY production
# Enter: 88569105:testpublickey_oHKEsiKA3i9E1JshcnIA7RktrR163DdRZYZYOWgXqwSXx

vercel env add IZIPAY_TEST_HMAC_KEY production
# Enter: H9ataKGBMUFzH8F0kz4ihdw3MTBb0WbpJ1TLLuRL<HZM1

# Production Environment Variables
vercel env add IZIPAY_PROD_USERNAME production
# Enter: 88569105

vercel env add IZIPAY_PROD_PASSWORD production
# Enter: prodpassword_di6IeBzwz6ccq30feWkUmGN5s6PmhX67|6RrKJHSicFPh

vercel env add IZIPAY_PROD_PUBLIC_KEY production
# Enter: 88569105:publickey UKrWazicOvfMEi40dXuBAcGK1TaTK6izIIJZYWWHGCakv

vercel env add IZIPAY_PROD_HMAC_KEY production
# Enter: XnvOuum4jpXuY9U1BbpoY3tPK0KRy3|vBfw1ZKmp2G2Sz

# API Configuration
vercel env add IZIPAY_API_BASE_URL production
# Enter: https://api.micuentaweb.pe

vercel env add IZIPAY_JAVASCRIPT_URL production
# Enter: https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js
```

### Verify Vercel Environment Variables
```bash
vercel env ls
```

## 🧪 Testing

### Local Testing
1. Start development server: `npm run dev`
2. Navigate to packages page
3. Select a package and proceed to payment
4. Test with Izipay test credentials

### Production Testing
1. Deploy to Vercel: `vercel --prod`
2. Test payment flow on production URL
3. Verify payment processing works correctly

## 🔧 Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Restart development server after adding variables
   - Check `.env.local` file exists in frontend directory
   - Verify variable names match exactly

2. **Payment form not loading**
   - Check browser console for JavaScript errors
   - Verify Izipay script URL is accessible
   - Check network tab for API call failures

3. **Form token generation fails**
   - Verify API credentials are correct
   - Check server logs for authentication errors
   - Ensure API endpoint is accessible

### Debug Commands

```bash
# Check local environment variables
cat .env.local

# Check Vercel environment variables
vercel env ls

# Test API endpoint locally
curl -X POST http://localhost:3000/api/izipay/create-payment \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "orderId": "test-123", "customer": {"email": "test@example.com"}}'
```

## 📋 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `IZIPAY_TEST_USERNAME` | Test environment username | `88569105` |
| `IZIPAY_TEST_PASSWORD` | Test environment password | `testpassword_...` |
| `IZIPAY_TEST_PUBLIC_KEY` | Test environment public key | `88569105:testpublickey_...` |
| `IZIPAY_TEST_HMAC_KEY` | Test environment HMAC key | `H9ataKGBMUFzH8F0kz4ihdw3MTBb0WbpJ1TLLuRL<HZM1` |
| `IZIPAY_PROD_USERNAME` | Production environment username | `88569105` |
| `IZIPAY_PROD_PASSWORD` | Production environment password | `prodpassword_...` |
| `IZIPAY_PROD_PUBLIC_KEY` | Production environment public key | `88569105:publickey...` |
| `IZIPAY_PROD_HMAC_KEY` | Production environment HMAC key | `XnvOuum4jpXuY9U1BbpoY3tPK0KRy3|vBfw1ZKmp2G2Sz` |
| `IZIPAY_API_BASE_URL` | Izipay API base URL | `https://api.micuentaweb.pe` |
| `IZIPAY_JAVASCRIPT_URL` | Izipay JavaScript library URL | `https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js` |

## ✅ Verification Checklist

- [ ] Local `.env.local` file created with all variables
- [ ] Vercel environment variables added
- [ ] Development server restarted
- [ ] Payment form loads correctly
- [ ] Test payment processes successfully
- [ ] Production deployment works
- [ ] Payment verification works

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review server logs for error messages
3. Verify all environment variables are set correctly
4. Test with Izipay test credentials first
