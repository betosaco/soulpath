# 🗺️ Routes and Logic Documentation

## 📋 Table of Contents

1. [Application Routes Overview](#application-routes-overview)
2. [Cart Sidebar Behavior](#cart-sidebar-behavior)
3. [Booking Flow Logic](#booking-flow-logic)
4. [Navigation and State Management](#navigation-and-state-management)
5. [Message and Notification System](#message-and-notification-system)
6. [API Routes](#api-routes)
7. [User Authentication Flow](#user-authentication-flow)
8. [Admin vs Client Routes](#admin-vs-client-routes)

---

## 🛣️ Application Routes Overview

### **Public Routes**
| Route | Component | Purpose | Access |
|-------|-----------|---------|--------|
| `/` | `HomePage` | Landing page with hero section | Public |
| `/login` | `LoginPage` | User authentication | Public |
| `/products` | `ProductsPage` | Package browsing and selection | Public |
| `/schedule` | `SchedulePage` | Schedule viewing and booking | Public |
| `/checkout` | `CheckoutPage` | Payment processing | Public |
| `/result` | `ResultPage` | Booking confirmation | Public |

### **Client Routes (Authenticated)**
| Route | Component | Purpose | Access |
|-------|-----------|---------|--------|
| `/account` | `AccountPage` | User dashboard | Client |
| `/account/book` | `BookSessionPage` | Book new sessions | Client |
| `/account/purchase` | `PurchasePage` | Purchase packages | Client |
| `/account/my-packages` | `MyPackagesPage` | View owned packages | Client |
| `/account/live-session` | `LiveSessionPage` | Join live sessions | Client |
| `/account/sessions` | `SessionsPage` | View booking history | Client |
| `/account/purchase-history` | `PurchaseHistoryPage` | View purchase history | Client |
| `/account/profile` | `ProfilePage` | Manage user profile | Client |

### **Admin Routes (Admin Only)**
| Route | Component | Purpose | Access |
|-------|-----------|---------|--------|
| `/admin` | `AdminPage` | Admin dashboard | Admin |
| `/admin/bookings` | `BookingsManagement` | Manage all bookings | Admin |
| `/admin/packages` | `PackagesManagement` | Manage packages | Admin |
| `/admin/users` | `UsersManagement` | Manage users | Admin |
| `/admin/emails` | `EmailManagement` | Email templates | Admin |
| `/admin/seo` | `SeoManagement` | SEO settings | Admin |

---

## 🛒 Cart Sidebar Behavior

### **Opening Behavior**
```typescript
// Cart opens when:
1. User clicks cart icon in header
2. User adds item to cart
3. User clicks "Add to Cart" button
4. Programmatic call to openCart()
```

### **Closing Behavior**
```typescript
// Cart closes when:
1. User clicks X button
2. User clicks backdrop/overlay
3. User clicks "Proceed to Checkout" (if already on checkout page)
4. User completes checkout
5. Programmatic call to closeCart()
```

### **Stay Open Logic**
```typescript
// Cart stays open when:
1. User is browsing products
2. User is on schedule page
3. User is adding multiple items
4. User is in the middle of booking flow
5. Cart has items and user is not on checkout page
```

### **State Management**
```typescript
// Cart state is managed by Zustand store
const { isCartOpen, openCart, closeCart, toggleCart } = useCartUI();

// Cart items are managed separately
const { items, addItem, removeItem, updateQuantity } = useCart();
```

### **Mobile vs Desktop Behavior**
- **Mobile**: Cart slides in from right, full width
- **Desktop**: Cart slides in from right, max-width 384px
- **Backdrop**: Semi-transparent overlay on both

---

## 📅 Booking Flow Logic

### **Master Booking Flow Scenarios**

#### **Scenario A: Schedule-First Flow**
```
User Journey: Schedule → Package → Checkout
1. User selects time slot
2. System shows available packages
3. User selects package
4. Proceed to checkout
```

#### **Scenario B: Package-First Flow**
```
User Journey: Package → Schedule → Checkout
1. User selects package from products page
2. System shows available time slots
3. User selects time slot
4. Proceed to checkout
```

#### **Scenario C: Add More Bookings**
```
User Journey: Existing Package → Schedule → Checkout
1. User has packages in cart
2. User clicks "Book Now" from cart
3. System shows available slots (excluding booked ones)
4. User selects additional time slot
5. Proceed to checkout
```

#### **Scenario D: Multiple Packages**
```
User Journey: Multiple Packages → Schedule Selection → Checkout
1. User has multiple packages in cart
2. User selects time slot
3. System shows package selection modal
4. User chooses which package to book
5. Proceed to checkout
```

### **Cross-Package Booking Rules**
```typescript
// ✅ ALLOWED: Different packages can book same time slot
Package A (4-matpass) + Package B (8-matpass) → Same 10:00 AM slot

// ❌ NOT ALLOWED: Same package booking same slot twice
Package A → 10:00 AM slot (already booked) → Cannot book again

// ✅ ALLOWED: Multiple instances of same package type
2x Package A (4-matpass) → Can book different slots
```

### **Session Limit Enforcement**
```typescript
// Each package has session limits
4-matpass = 4 sessions maximum
8-matpass = 8 sessions maximum

// Validation occurs at:
1. Package selection
2. Schedule booking
3. Cart checkout
```

---

## 🧭 Navigation and State Management

### **Route Protection**
```typescript
// Authentication check
const { user, isAdmin } = useAuth();

// Redirect logic
if (user) {
  if (isAdmin) {
    router.push('/admin');
  } else {
    router.push('/account');
  }
}
```

### **Session Storage Usage**
```typescript
// Booking flow state persistence
sessionStorage.setItem('currentCheckoutStep', 'customer');
sessionStorage.setItem('isAddingMoreBookings', 'true');
sessionStorage.setItem('bookingFlowType', 'package-first');
sessionStorage.setItem('lockedTimeSlots', JSON.stringify(slots));
```

### **State Synchronization**
```typescript
// Cart state syncs across components
const cartItems = useCart().items;
const isCartOpen = useCartUI().isCartOpen;

// Booking state syncs via sessionStorage
const currentStep = sessionStorage.getItem('currentCheckoutStep');
```

---

## 💬 Message and Notification System

### **Toast Notifications**

#### **Success Messages**
```typescript
toast.success('Package added to cart successfully!');
toast.success('Booking confirmed! Check your email for details.');
toast.success('Payment processed successfully!');
```

#### **Error Messages**
```typescript
toast.error('This time slot is already booked. Please select a different time.');
toast.error('You have reached the maximum number of sessions for this package.');
toast.error('Payment failed. Please try again.');
```

#### **Warning Messages**
```typescript
toast.warning('You have multiple packages booked for the same time slot.');
toast.warning('This package has limited availability.');
```

#### **Info Messages**
```typescript
toast.info('You can change to group booking to allow multiple packages.');
toast.info('Session reminder sent to your email.');
```

### **Email Notifications**

#### **User Booking Confirmation**
```html
Subject: Booking Confirmation - MatMax Yoga Studio
Content: Session details, date, time, instructor, venue
Template: userBookingConfirmation
```

#### **Session Reminder**
```html
Subject: Session Reminder - Your Reading is Tomorrow
Content: Reminder with session details and video link
Template: sessionReminder
```

#### **Admin Notification**
```html
Subject: New Booking Received - MatMax Yoga Studio
Content: Client details, booking information, next steps
Template: adminBookingNotification
```

### **WhatsApp Integration**
```typescript
// WhatsApp message format
const message = `¡Hola! Me interesa reservar una sesión:

📅 *Detalles de la Sesión:*
• Fecha: ${bookingDate}
• Hora: ${bookingTime}
• Duración: ${duration} minutos

👤 *Información Personal:*
• Nombre: ${clientName}
• Email: ${clientEmail}
• Teléfono: ${clientPhone}

💰 *Información de Pago:*
• Paquete: ${packageName}
• Precio: $${price} USD

¿Podrían ayudarme a completar mi reserva? ¡Gracias!`;
```

---

## 🔌 API Routes

### **Package Management**
```typescript
GET /api/packages
- Fetch all available packages
- Returns package details, pricing, sessions

POST /api/packages
- Create new package (admin only)
- Requires authentication and admin role
```

### **Schedule Management**
```typescript
GET /api/schedule
- Fetch available time slots
- Returns slots with availability status

POST /api/schedule
- Create new schedule slot (admin only)
- Requires authentication and admin role
```

### **Booking Management**
```typescript
GET /api/bookings
- Fetch user bookings
- Requires authentication

POST /api/bookings
- Create new booking
- Requires authentication and valid package

PUT /api/bookings/:id
- Update booking details
- Requires authentication and ownership

DELETE /api/bookings/:id
- Cancel booking
- Requires authentication and ownership
```

### **User Management**
```typescript
GET /api/users
- Fetch user profile
- Requires authentication

PUT /api/users
- Update user profile
- Requires authentication

POST /api/users/change-password
- Change user password
- Requires authentication
```

---

## 🔐 User Authentication Flow

### **Login Process**
```typescript
1. User enters email/password
2. System validates credentials
3. If valid: redirect based on role
   - Admin → /admin
   - Client → /account
4. If invalid: show error message
```

### **Role-Based Access**
```typescript
// Admin users
- Access to /admin routes
- Can manage bookings, packages, users
- Can view analytics and reports

// Client users
- Access to /account routes
- Can book sessions, view packages
- Can manage their own bookings
```

### **Session Management**
```typescript
// Session persistence
- Uses Supabase auth
- Automatic token refresh
- Logout clears all session data
```

---

## 👥 Admin vs Client Routes

### **Admin Dashboard Features**
- **Bookings Management**: View, edit, cancel all bookings
- **Package Management**: Create, edit, delete packages
- **User Management**: View user profiles, manage accounts
- **Email Templates**: Customize notification emails
- **SEO Settings**: Manage meta tags, descriptions
- **Analytics**: View booking statistics, revenue

### **Client Dashboard Features**
- **My Bookings**: View personal booking history
- **My Packages**: View owned packages and sessions
- **Book New Session**: Schedule new appointments
- **Purchase Packages**: Buy new packages
- **Profile Management**: Update personal information
- **Live Sessions**: Join scheduled video calls

---

## 🔄 State Flow Diagrams

### **Cart State Flow**
```
User Action → Cart Update → UI Update → State Persistence
     ↓              ↓           ↓            ↓
Add Item → Update Items → Show Badge → Save to Store
Remove Item → Update Items → Hide Badge → Save to Store
Open Cart → Set isOpen → Show Sidebar → Update UI
Close Cart → Set isOpen → Hide Sidebar → Update UI
```

### **Booking State Flow**
```
Select Package → Add to Cart → Select Schedule → Book Session
     ↓              ↓              ↓              ↓
Package State → Cart State → Schedule State → Booking State
     ↓              ↓              ↓              ↓
Update UI → Show Cart → Show Slots → Confirm Booking
```

### **Authentication Flow**
```
Login Attempt → Validate Credentials → Check Role → Redirect
     ↓              ↓                    ↓          ↓
User Input → Supabase Auth → Role Check → Route User
     ↓              ↓                    ↓          ↓
Show Form → Show Loading → Set User → Navigate
```

---

## 📱 Mobile-Specific Behavior

### **Touch Interactions**
- **Cart Toggle**: Large touch targets (44px minimum)
- **Booking Buttons**: Enhanced touch feedback
- **Swipe Gestures**: Cart can be swiped closed
- **Scroll Behavior**: Smooth scrolling with momentum

### **Responsive Design**
- **Mobile**: Full-width cart, stacked layout
- **Tablet**: Side-by-side layout, medium cart width
- **Desktop**: Grid layout, fixed cart width

### **Performance Optimizations**
- **Lazy Loading**: Components load on demand
- **Image Optimization**: WebP format, responsive sizes
- **Code Splitting**: Route-based code splitting
- **Caching**: API responses cached for 1 hour

---

## 🚨 Error Handling

### **Network Errors**
```typescript
// API call failures
try {
  const response = await fetch('/api/packages');
  if (!response.ok) throw new Error('Network error');
} catch (error) {
  toast.error('Unable to load packages. Please try again.');
}
```

### **Validation Errors**
```typescript
// Form validation
if (!email || !password) {
  toast.error('Please fill in all required fields.');
  return;
}
```

### **Booking Conflicts**
```typescript
// Duplicate booking prevention
if (isTimeSlotBooked(slot)) {
  toast.error('This time slot is already booked.');
  return;
}
```

---

## 🔧 Development Notes

### **Key Components**
- `MasterBookingFlow`: Central booking orchestrator
- `CartSidebar`: Shopping cart management
- `EnhancedSchedule`: Schedule display and selection
- `AppShell`: Main layout wrapper
- `CentralizedHeader`: Navigation and cart toggle

### **State Management**
- **Zustand**: Cart and UI state
- **SessionStorage**: Booking flow persistence
- **Supabasis e**: User authentication and data
- **React Query**: API data caching

### **Styling**
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animations and transitions
- **CSS Custom Properties**: Theme variables
- **Responsive Design**: Mobile-first approach

---

*This documentation provides a comprehensive overview of all routes, logic, and behavior patterns in the wellness booking system. For specific implementation details, refer to the individual component files.*
