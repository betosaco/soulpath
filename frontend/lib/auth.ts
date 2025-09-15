import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Get authenticated user from request headers (set by middleware)
 * This is the primary method for API routes that are protected by middleware
 */
export function getAuthenticatedUser(request: NextRequest): AuthenticatedUser | null {
  const userId = request.headers.get('x-user-id');
  const userEmail = request.headers.get('x-user-email');
  const userRole = request.headers.get('x-user-role');

  if (!userId || !userEmail || !userRole) {
    console.log('Auth: Missing user data in headers');
    return null;
  }

  return {
    id: userId,
    email: userEmail,
    role: userRole
  };
}

/**
 * Legacy method for backward compatibility - extracts user from JWT token
 * Use getAuthenticatedUser() for routes protected by middleware
 */
export async function requireAuth(request: NextRequest): Promise<AuthenticatedUser | null> {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth: No Authorization header or invalid format');
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  console.log('Auth: Token received, length:', token.length);
  
  try {
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as Record<string, unknown>;
    
    if (!decoded || !decoded.userId) {
      console.log('Auth: Invalid JWT token or missing userId');
      return null;
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: String(decoded.userId) },
      select: { id: true, email: true, role: true, status: true }
    });

    if (!user) {
      console.log('Auth: User not found in database');
      return null;
    }

    if (user.status !== 'ACTIVE') {
      console.log('Auth: User account is not active');
      return null;
    }

    console.log('Auth: User authenticated:', user.email, 'Role:', user.role);

    return {
      id: user.id,
      email: user.email,
      role: user.role || 'user'
    };
  } catch (error) {
    console.log('Auth: JWT verification error:', error);
    return null;
  }
}

export async function requireAuthResponse(request: NextRequest): Promise<NextResponse | null> {
  const user = await requireAuth(request);
  
  if (!user) {
    return NextResponse.json({ 
      code: 401, 
      message: 'Missing or invalid authorization',
      error: 'Authorization required' 
    }, { status: 401 });
  }
  
  return null; // Continue with the request
}

export function createAuthMiddleware(handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const user = await requireAuth(request);
    
    if (!user) {
      return NextResponse.json({ 
        code: 401, 
        message: 'Missing or invalid authorization',
        error: 'Authorization required' 
      }, { status: 401 });
    }
    
    return handler(request, user);
  };
}
