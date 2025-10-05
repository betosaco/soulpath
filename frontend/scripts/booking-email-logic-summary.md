# Booking Email Logic Summary

## How the System Now Works

### Scenario 1: Just Making a Booking (Using Existing MatPass)
- **Route**: `/api/client/bookings`
- **Template**: `booking_only` 
- **Content**: Only booking details (date, time, instructor, venue)
- **Logic**: `isNewPurchase = false` (package is older than 5 minutes)

### Scenario 2: New MatPass Purchase + Booking
- **Route**: `/api/client/bookings` (after purchase)
- **Template**: `renewal_matpass`
- **Content**: MatPass purchase details + booking details + pricing
- **Logic**: `isNewPurchase = true` (package is newer than 5 minutes and payment is COMPLETED)

## Detection Logic

```javascript
const isNewPurchase = userPackage.purchase && 
  userPackage.purchase.paymentStatus === 'COMPLETED' &&
  (new Date().getTime() - new Date(userPackage.purchase.purchasedAt).getTime()) < 5 * 60 * 1000; // 5 minutes
```

## Email Data Mapping

### For New Purchase (renewal_matpass template):
- `matpassItems`: Current MatPass purchase details
- `totalAmount`: Purchase amount
- `orderNumber`: `PURCHASE-{purchaseId}`
- `paymentMethod`: 'Credit Card'
- `bookings`: Booking details

### For Existing MatPass (booking_only template):
- `matpassItems`: Empty array
- `totalAmount`: 0
- `orderNumber`: `BOOKING-{bookingId}`
- `paymentMethod`: 'MatPass Credit'
- `bookings`: Booking details only

## Templates Used

1. **booking_only**: For existing MatPass bookings
2. **renewal_matpass**: For new MatPass purchases (with or without booking)
3. **welcome_matpass**: For new customers buying their first MatPass
4. **products_only**: For product-only purchases

## Result

- ✅ **Existing customer + just booking** → `booking_only` template
- ✅ **Existing customer + new MatPass purchase** → `renewal_matpass` template  
- ✅ **New customer + MatPass purchase** → `welcome_matpass` template
- ✅ **Product-only purchase** → `products_only` template
