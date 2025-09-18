import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Define protected admin routes
const ADMIN_ROUTES = [
  '/admin',
  '/api/admin'
];

// Define public routes that should be accessible without authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/packages',
  '/api/auth/login',
  '/api/auth/verify',
  '/api/packages',
  '/api/health',
  '/api/content',
  '/api/sections',
  '/api/schedule-slots',
  '/api/schedules',
  '/api/booking',
  '/api/feedback',
  '/api/bug-reports',
  '/api/otp/send',
  '/api/otp/verify',
  '/api/stripe',
  '/api/telegram/webhook',
  '/api/whatsapp/webhook',
  '/api/whatsapp-business/webhook'
];

interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

/**
 * Extract JWT token from Authorization header or cookies
 */
function extractToken(request: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('Authorization');
  console.log('🔐 Middleware: Authorization header:', authHeader);
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
    console.log('🔐 Middleware: Token extracted from header:', token.substring(0, 20) + '...');
    return token;
  }

  // Try cookies as fallback
  const tokenFromCookie = request.cookies.get('auth_token')?.value;
  console.log('🔐 Middleware: Token from cookie:', tokenFromCookie ? tokenFromCookie.substring(0, 20) + '...' : 'none');
  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  console.log('🔐 Middleware: No token found');
  return null;
}

/**
 * Verify JWT token using jose library (Edge Runtime compatible)
 */
async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    console.log('🔐 Middleware: Verifying token:', token.substring(0, 20) + '...');
    
    // Create secret key for jose
    const secret = new TextEncoder().encode(JWT_SECRET);
    
    // Verify JWT token
    const { payload } = await jwtVerify(token, secret);
    console.log('🔐 Middleware: JWT payload:', payload);
    
    if (!payload || !payload.userId) {
      console.log('🔐 Middleware: Invalid JWT token or missing userId');
      return null;
    }

    // For now, just verify the JWT without database check
    // TODO: Add database verification in production
    console.log('🔐 Middleware: JWT verified successfully');
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string || 'user'
    };
  } catch (error) {
    console.log('🔐 Middleware: JWT verification error:', error);
    return null;
  }
}

/**
 * Check if the current path matches any of the protected admin routes
 */
function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Check if the current path is a public route
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('🔐 Middleware: Processing request to', pathname);

  // Check if this is an admin route FIRST
  if (isAdminRoute(pathname)) {
    console.log('🔐 Middleware: Admin route detected, checking authentication');

    // Extract token
    const token = extractToken(request);
    if (!token) {
      console.log('🔐 Middleware: No token found, redirecting to login');
      
      // For API routes, return 401
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { 
            code: 401, 
            message: 'Authentication required',
            error: 'Missing or invalid authorization token' 
          },
          { status: 401 }
        );
      }
      
      // For page routes, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token and get user data
    const userData = await verifyToken(token);
    if (!userData) {
      console.log('🔐 Middleware: Token verification failed, redirecting to login');
      
      // For API routes, return 401
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { 
            code: 401, 
            message: 'Authentication required',
            error: 'Invalid or expired token' 
          },
          { status: 401 }
        );
      }
      
      // For page routes, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has admin role
    if (userData.role !== 'ADMIN') {
      console.log('🔐 Middleware: User is not admin, role:', userData.role);
      
      // For API routes, return 403
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { 
            code: 403, 
            message: 'Access denied',
            error: 'Admin privileges required' 
          },
          { status: 403 }
        );
      }
      
      // For page routes, redirect to account page
      const accountUrl = new URL('/account', request.url);
      return NextResponse.redirect(accountUrl);
    }

    console.log('🔐 Middleware: Admin access granted for user:', userData.email);
    
    // Add user data to request headers for use in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', userData.userId);
    requestHeaders.set('x-user-email', userData.email);
    requestHeaders.set('x-user-role', userData.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Skip middleware for public routes
  if (isPublicRoute(pathname)) {
    console.log('🔐 Middleware: Public route, skipping auth check');
    return NextResponse.next();
  }

  // For non-admin routes, continue without additional checks
  console.log('🔐 Middleware: Non-admin route, continuing');
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
