# Lyra/Izipay Quick Setup Guide

## 🚨 **Error Fix: "Invalid payment response"**

This error occurs because Lyra environment variables are not configured. Follow these steps:

---

## 📝 **Step 1: Add Environment Variables**

You need to add these variables to your `.env` file (or Vercel environment variables):

```bash
# Required for API Authentication
LYRA_USERNAME=69876357                    # Your Shop ID
LYRA_PASSWORD=testpassword_DEMOPUBLICKEY  # API Password

# Required for Frontend
NEXT_PUBLIC_LYRA_PUBLIC_KEY=69876357:testpublickey_DEMOPUBLICKEY95me92597fd28tGD4r5

# Required for Webhooks
LYRA_HMAC_TEST_KEY=your_test_hmac_key
LYRA_HMAC_PROD_KEY=your_prod_hmac_key

# Optional (has defaults)
LYRA_API_ENDPOINT=https://api.lyra.com/api-payment/V4/Charge/CreatePayment
NEXT_PUBLIC_LYRA_JS_LIBRARY_URL=https://static.lyra.com/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js
```

---

## 🔑 **Step 2: Get Your Credentials**

### **Option A: Use Test Credentials (for testing)**

```bash
LYRA_USERNAME=69876357
LYRA_PASSWORD=testpassword_DEMOPUBLICKEY95me92597fd28tGD4r5
NEXT_PUBLIC_LYRA_PUBLIC_KEY=69876357:testpublickey_DEMOPUBLICKEY95me92597fd28tGD4r5
```

### **Option B: Get Real Credentials (for production)**

1. **Login to Lyra Back Office**: https://secure.lyra.com/portal/
2. **Go to**: Settings > Shop
3. **Select your shop**
4. **Click**: REST API Keys tab
5. **Copy the following**:
   - **Username**: Shop ID (8-digit number)
   - **Password**: API Password key
   - **Public Key**: Client public key (format: `shopId:publicKey`)
   - **HMAC Keys**: Test and Production keys

---

## 🚀 **Step 3: Add to Vercel (if deploying)**

### **Using Vercel CLI:**

```bash
cd frontend

# Add each variable
vercel env add LYRA_USERNAME production
vercel env add LYRA_PASSWORD production
vercel env add NEXT_PUBLIC_LYRA_PUBLIC_KEY production
vercel env add LYRA_HMAC_TEST_KEY production
vercel env add LYRA_HMAC_PROD_KEY production

# Redeploy
vercel --prod
```

### **Using Vercel Dashboard:**

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings > Environment Variables**
4. Add each variable for **Production**, **Preview**, and **Development**

---

## 🧪 **Step 4: Test the Payment Form**

### **Local Testing:**

```bash
# 1. Add variables to .env
echo "LYRA_USERNAME=69876357" >> frontend/.env
echo "LYRA_PASSWORD=testpassword_DEMOPUBLICKEY95me92597fd28tGD4r5" >> frontend/.env
echo "NEXT_PUBLIC_LYRA_PUBLIC_KEY=69876357:testpublickey_DEMOPUBLICKEY95me92597fd28tGD4r5" >> frontend/.env

# 2. Restart dev server
cd frontend
npm run dev

# 3. Go to checkout page and test payment
```

### **Test Cards:**

| Card Network | Number | CVV | Expiry |
|-------------|--------|-----|--------|
| Visa | 4970100000000154 | 123 | 12/25 |
| Mastercard | 5970100000000154 | 123 | 12/25 |
| AMEX | 374500000000031 | 1234 | 12/25 |

---

## ✅ **Verification Checklist**

After adding environment variables:

- [ ] `LYRA_USERNAME` is set (Shop ID)
- [ ] `LYRA_PASSWORD` is set (API Password)
- [ ] `NEXT_PUBLIC_LYRA_PUBLIC_KEY` is set (includes `shopId:publicKey` format)
- [ ] Restart development server (or redeploy to Vercel)
- [ ] Go to `/booking/payment` page
- [ ] Select "Credit/Debit Card" payment option
- [ ] Payment form should load (not show "Invalid payment response")
- [ ] Test with test card numbers

---

## 🔍 **Debugging**

### **Check if variables are loaded:**

1. Open browser console on payment page
2. Look for these logs:
   ```
   🔍 Environment check: { hasUsername: true, hasPassword: true, ... }
   📊 FormToken API Response: { success: true, formToken: "..." }
   ```

3. If you see:
   ```
   ❌ Lyra credentials not configured
   ```
   Then environment variables are not loaded. Restart your dev server or redeploy.

### **Common Issues:**

| Issue | Solution |
|-------|----------|
| "Payment gateway not configured" | Add `LYRA_USERNAME` and `LYRA_PASSWORD` |
| "Invalid payment response" | Check API credentials are correct |
| Form not showing | Add `NEXT_PUBLIC_LYRA_PUBLIC_KEY` |
| "Failed to load payment form" | Check JavaScript library URL |

---

## 📞 **Need Help?**

1. **Check logs**: Browser console and server logs
2. **Verify credentials**: Login to Lyra Back Office
3. **Test environment**: Use test credentials first
4. **Review guide**: See `LYRA_INTEGRATION_GUIDE.md` for full details

---

## 🎯 **Quick Commands**

### **Local Development:**
```bash
# Add to .env and restart
echo "LYRA_USERNAME=69876357" >> frontend/.env
echo "LYRA_PASSWORD=testpassword_DEMOPUBLICKEY95me92597fd28tGD4r5" >> frontend/.env
echo "NEXT_PUBLIC_LYRA_PUBLIC_KEY=69876357:testpublickey_DEMOPUBLICKEY95me92597fd28tGD4r5" >> frontend/.env
cd frontend && npm run dev
```

### **Vercel Deployment:**
```bash
cd frontend
vercel env add LYRA_USERNAME
vercel env add LYRA_PASSWORD
vercel env add NEXT_PUBLIC_LYRA_PUBLIC_KEY
vercel --prod
```

---

**Status**: 🔧 Setup required - add environment variables to continue  
**Next**: Test payment form with test cards
