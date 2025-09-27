import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { requireAuth, getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cacheKey, withApiCache, cacheHeaders } from '@/lib/apiCache';

// Add CORS headers
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 200 }));
}

// GET: List all teachers for substitute selection
export async function GET(request: NextRequest) {
  console.log('🔍 GET /api/teacher/substitutes - Starting request');
  
  try {
    console.log('🔍 Attempting authentication...');
    const user = getAuthenticatedUser(request) ?? await requireAuth(request);
    console.log('🔍 User authenticated:', user ? 'Yes' : 'No', user?.email);
    
    if (!user || !user.email) {
      console.log('🔍 Unauthorized - no user or email');
      return addCorsHeaders(NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }));
    }

    // Find current teacher
    console.log('🔍 Looking up current teacher...');
    const currentTeacher = await prisma.teacher.findFirst({ 
      where: { email: user.email } 
    });
    console.log('🔍 Current teacher found:', currentTeacher ? 'Yes' : 'No', currentTeacher?.id);
    
    if (!currentTeacher) {
      console.log('🔍 Teacher profile not found for email:', user.email);
      return addCorsHeaders(NextResponse.json({ success: false, error: 'Teacher profile not found' }, { status: 403 }));
    }

    // Get all other teachers (excluding current teacher)
    console.log('🔍 Looking up substitute teachers...');
    const cacheTtlMs = 60_000; // 60s cache for directory list
    const key = cacheKey('/api/teacher/substitutes', {}, String(currentTeacher.id));
    const teachers = await withApiCache(key, cacheTtlMs, () => prisma.teacher.findMany({
      where: {
        id: { not: currentTeacher.id },
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        bio: true,
        shortBio: true,
        venue: {
          select: {
            id: true,
            name: true,
            city: true
          }
        },
        serviceTypes: {
          include: {
            serviceType: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: [
        { name: 'asc' }
      ]
    }));

    console.log('🔍 Found substitute teachers:', teachers.length);

    const response = { 
      success: true, 
      teachers: teachers.map(teacher => ({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        avatarUrl: teacher.avatarUrl,
        bio: teacher.bio,
        shortBio: teacher.shortBio,
        venue: teacher.venue,
        serviceTypes: teacher.serviceTypes.map(st => st.serviceType)
      }))
    };

    console.log('🔍 Returning response with', response.teachers.length, 'teachers');
    const res = addCorsHeaders(NextResponse.json(response));
    const headers = cacheHeaders(Math.floor(cacheTtlMs / 1000));
    Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  } catch (error) {
    console.error('🔍 GET /api/teacher/substitutes error:', error);
    console.error('🔍 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return addCorsHeaders(NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 }));
  }
}
