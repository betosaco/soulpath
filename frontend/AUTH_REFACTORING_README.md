# Authentication & Authorization Refactoring

## Overview

This document outlines the complete refactoring of the authentication and authorization system to implement a robust Role-Based Access Control (RBAC) system using Next.js Middleware. The refactoring eliminates security flaws, establishes a single source of truth for user roles, and provides centralized route protection.

## Key Improvements

### ✅ Security Enhancements
- **Eliminated hardcoded admin emails** - Database is now the single source of truth
- **Centralized route protection** - Next.js middleware handles all admin route security
- **No client-side role checking** - All authorization happens server-side
- **Automatic token validation** - Middleware verifies JWT tokens and user roles

### ✅ Architecture Improvements
- **Single source of truth** - User roles are only determined by the database
- **DRY principle** - No duplicated admin logic between client and server
- **Centralized security** - All admin routes are protected at the network edge
- **Scalable design** - Easy to add new roles and permissions

### ✅ Developer Experience
- **Simplified API calls** - Admin API client handles authentication automatically
- **Type safety** - Full TypeScript support throughout the auth flow
- **Clear separation of concerns** - Auth logic is centralized and reusable

## Architecture

### 1. Next.js Middleware (`middleware.ts`)

The middleware acts as the primary security gate, intercepting all requests to admin routes:

```typescript
// Protected routes
const ADMIN_ROUTES = ['/admin', '/api/admin'];

// Public routes (no auth required)
const PUBLIC_ROUTES = ['/', '/login', '/api/packages', ...];
```

**Key Features:**
- Extracts JWT from Authorization header or cookies
- Verifies token and fetches user data from database
- Checks user role against database (not hardcoded lists)
- Redirects unauthorized users appropriately
- Adds user data to request headers for API routes

### 2. Refactored Auth Utilities (`lib/auth.ts`)

Two main functions for different use cases:

```typescript
// For middleware-protected routes (recommended)
export function getAuthenticatedUser(request: NextRequest): AuthenticatedUser | null

// For legacy routes (backward compatibility)
export async function requireAuth(request: NextRequest): Promise<AuthenticatedUser | null>
```

### 3. Admin API Client (`lib/api/admin.ts`)

A dedicated client for admin operations with automatic authentication:

```typescript
import { adminApi } from '@/lib/api/admin';

// Automatic token inclusion
const stats = await adminApi.getDashboardStats();
const users = await adminApi.getUsers({ page: 1, limit: 10 });
```

### 4. Simplified useAuth Hook (`hooks/useAuth.tsx`)

Removed hardcoded admin emails, now only checks database role:

```typescript
// Before: Hardcoded email list + database role
const isAdmin = Boolean(user?.email && (ADMIN_EMAILS.includes(user.email) || user.role === 'admin'));

// After: Database role only
const isAdmin = Boolean(user?.role === 'admin');
```

## Implementation Details

### Database Schema

The User model in `prisma/schema.prisma` includes:

```prisma
model User {
  id       String  @id @default(cuid())
  email    String  @unique
  role     String? @default("user")
  status   String? @default("active")
  // ... other fields
}
```

### Middleware Configuration

The middleware runs on all routes except static files:

```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
```

### Route Protection Flow

1. **Request arrives** at admin route (`/admin/*` or `/api/admin/*`)
2. **Middleware intercepts** and checks if route is protected
3. **Token extraction** from Authorization header or cookies
4. **Token verification** using JWT secret
5. **Database lookup** to verify user exists and is active
6. **Role checking** against database (not hardcoded lists)
7. **Authorization decision**:
   - ✅ Admin: Continue to route with user data in headers
   - ❌ Not admin: Redirect to `/account` or return 403
   - ❌ No token: Redirect to `/login` or return 401

## Usage Examples

### 1. Creating a New Admin API Route

```typescript
// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  // Get user from middleware-set headers (no additional DB calls)
  const user = getAuthenticatedUser(request);
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // User is guaranteed to be admin by middleware
  // Fetch and return data...
}
```

### 2. Using the Admin API Client

```typescript
// In a React component
import { adminApi } from '@/lib/api/admin';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await adminApi.getUsers({ page: 1, limit: 20 });
      if (response.success) {
        setUsers(response.data);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Render users...
}
```

### 3. Adding New Admin Routes

To protect a new admin route, simply place it under `/admin` or `/api/admin`:

```
frontend/
├── app/
│   ├── (admin)/
│   │   ├── dashboard/     # Protected by middleware
│   │   └── settings/      # Protected by middleware
│   └── api/
│       └── admin/
│           ├── users/     # Protected by middleware
│           └── reports/   # Protected by middleware
```

## Security Benefits

### 1. Eliminated Attack Vectors
- ❌ **Hardcoded admin emails** - No longer exposed in source code
- ❌ **Client-side role checking** - All authorization is server-side
- ❌ **Forgotten auth checks** - Middleware protects all admin routes automatically

### 2. Centralized Security
- ✅ **Single point of control** - All admin security logic in middleware
- ✅ **Consistent behavior** - Same security rules for all admin routes
- ✅ **Easy updates** - Security changes only need to be made in one place

### 3. Database as Source of Truth
- ✅ **Dynamic role management** - Roles can be changed in database without code deployment
- ✅ **Audit trail** - All role changes are tracked in database
- ✅ **Scalable permissions** - Easy to add new roles and permissions

## Migration Guide

### For Existing Admin Routes

1. **Remove manual auth checks** - Middleware handles this automatically
2. **Use `getAuthenticatedUser()`** instead of `requireAuth()` for better performance
3. **Update API calls** to use the admin API client

### For New Admin Features

1. **Place routes under `/admin` or `/api/admin`** - Automatic protection
2. **Use admin API client** for data fetching
3. **No need for manual auth checks** - Middleware guarantees admin access

## Testing the New System

### 1. Test Admin Access
```bash
# Should work (with valid admin token)
curl -H "Authorization: Bearer <admin-token>" http://localhost:3000/api/admin/stats

# Should return 401 (no token)
curl http://localhost:3000/api/admin/stats

# Should return 403 (non-admin token)
curl -H "Authorization: Bearer <user-token>" http://localhost:3000/api/admin/stats
```

### 2. Test Route Protection
- Visit `/admin/dashboard` without login → Redirects to `/login`
- Visit `/admin/dashboard` with user token → Redirects to `/account`
- Visit `/admin/dashboard` with admin token → Shows dashboard

## Future Enhancements

### 1. Role Hierarchy
```typescript
// Future: Support for multiple roles
enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}
```

### 2. Permission System
```typescript
// Future: Granular permissions
interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}
```

### 3. Audit Logging
```typescript
// Future: Track all admin actions
interface AdminAction {
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  ipAddress: string;
}
```

## Conclusion

This refactoring establishes a robust, scalable, and secure authentication system that:

- ✅ Eliminates security vulnerabilities
- ✅ Provides centralized route protection
- ✅ Uses the database as the single source of truth
- ✅ Simplifies development and maintenance
- ✅ Prepares the system for future scalability

The new system ensures that admin functionality is properly protected while maintaining a clean, maintainable codebase.
