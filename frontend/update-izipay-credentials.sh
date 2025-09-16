#!/bin/bash

# Update Izipay credentials with correct values
echo "🔧 Updating Izipay credentials..."

# Backup current .env.local
cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)

# Update .env.local with correct credentials
cat > .env.local << 'EOF'
# Izipay Configuration - Updated with correct credentials
IZIPAY_TEST_USERNAME=88569105
IZIPAY_TEST_PASSWORD=testpassword_NSJpdOElQsM4RMu16WF89ykCViBW9ddilhEdsq02sHA2T
IZIPAY_TEST_PUBLIC_KEY=88569105:testpublickey_oHKEsiKA3i9E1JshcnIA7RktrR163DdRZYzYOWgXqwSXx
IZIPAY_TEST_HMAC_KEY=H9qtqKGBMUFzH8F0kz4ihdw3MTBb0WbpJ1TLLuRLxHZM1
IZIPAY_PROD_USERNAME=88569105
IZIPAY_PROD_PASSWORD=prodpassword_di6IeBzwz6ccq3OfeWkUmGN5s6PmhX67l6RrKJHSicFPh
IZIPAY_PROD_PUBLIC_KEY=88569105:publickey_UKrWqzlcOvfMEi4OdXuBAcGK1TaTK6izlIJZYWwHGCqkv
IZIPAY_PROD_HMAC_KEY=Xnv0uum4jpXuY9U1BbpoY3tPK0KRy3lvBfw1ZKmp2G2Sz
IZIPAY_API_BASE_URL=https://api.micuentaweb.pe
IZIPAY_JAVASCRIPT_URL=https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js
EOF

echo "✅ Izipay credentials updated successfully!"
echo "📋 Changes made:"
echo "   - Fixed test password (removed ] character)"
echo "   - Fixed test public key (corrected character case)"
echo "   - Fixed test HMAC key (corrected characters)"
echo "   - Fixed production password (corrected characters)"
echo "   - Fixed production public key (corrected characters)"
echo "   - Fixed production HMAC key (corrected characters)"
echo ""
echo "🧪 Testing credentials..."
node test-izipay-credentials.js
