import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

// Zod schemas for media validation
const uploadMediaSchema = z.object({
  type: z.enum(['image', 'video']),
  serviceTypeId: z.number().int().positive().optional(),
  category: z.enum(['cover', 'gallery', 'video', 'thumbnail']),
  alt: z.string().optional(),
  caption: z.string().optional()
});

const querySchema = z.object({
  serviceTypeId: z.coerce.number().int().positive().optional(),
  category: z.enum(['cover', 'gallery', 'video', 'thumbnail']).optional(),
  type: z.enum(['image', 'video']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

export async function GET(request: NextRequest) {
  try {
    console.log('📸 GET /api/admin/media - Starting request...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    console.log('✅ Admin user authenticated:', user.email);

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const validation = querySchema.safeParse(queryParams);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid query parameters',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { serviceTypeId, category, type, page, limit } = validation.data;

    console.log('🔍 Query parameters:', { serviceTypeId, category, type, page, limit });

    // For now, return a mock response since we don't have a media table yet
    // In a real implementation, you would query a media/files table
    const mockMedia = [
      {
        id: 1,
        url: '/images/services/yoga-class-1.jpg',
        type: 'image',
        category: 'cover',
        serviceTypeId: 1,
        alt: 'Yoga class in progress',
        caption: 'Students practicing Hatha Yoga',
        size: 245760,
        width: 800,
        height: 600,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        url: '/images/services/meditation-workshop.jpg',
        type: 'image',
        category: 'gallery',
        serviceTypeId: 2,
        alt: 'Meditation workshop setup',
        caption: 'Peaceful meditation environment',
        size: 189440,
        width: 600,
        height: 400,
        createdAt: new Date().toISOString()
      }
    ];

    const filteredMedia = mockMedia.filter(media => {
      if (serviceTypeId && media.serviceTypeId !== serviceTypeId) return false;
      if (category && media.category !== category) return false;
      if (type && media.type !== type) return false;
      return true;
    });

    console.log(`✅ Found ${filteredMedia.length} media items`);

    return NextResponse.json({
      success: true,
      data: {
        media: filteredMedia,
        pagination: {
          page,
          limit,
          total: filteredMedia.length,
          pages: Math.ceil(filteredMedia.length / limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Media API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📸 POST /api/admin/media - Uploading media...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const metadata = formData.get('metadata') as string;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided',
        message: 'Please select a file to upload'
      }, { status: 400 });
    }

    // Validate file type and size
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    if (file.size > maxFileSize) {
      return NextResponse.json({
        success: false,
        error: 'File too large',
        message: 'File size must be less than 10MB'
      }, { status: 400 });
    }

    const isImage = allowedImageTypes.includes(file.type);
    const isVideo = allowedVideoTypes.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type',
        message: 'Only images and videos are allowed'
      }, { status: 400 });
    }

    // Parse metadata
    let parsedMetadata;
    try {
      parsedMetadata = metadata ? JSON.parse(metadata) : {};
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Invalid metadata',
        message: 'Metadata must be valid JSON'
      }, { status: 400 });
    }

    const validation = uploadMediaSchema.safeParse(parsedMetadata);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid metadata',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { type, serviceTypeId, category, alt, caption } = validation.data;

    // Validate file type matches metadata
    if ((isImage && type !== 'image') || (isVideo && type !== 'video')) {
      return NextResponse.json({
        success: false,
        error: 'File type mismatch',
        message: 'File type does not match the specified media type'
      }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Upload the file to a cloud storage service (AWS S3, Cloudinary, etc.)
    // 2. Generate thumbnails for images/videos
    // 3. Store metadata in a database
    // 4. Return the public URL

    // For now, return a mock response
    const mockUrl = `/uploads/${Date.now()}-${file.name}`;
    
    const mediaItem = {
      id: Date.now(),
      url: mockUrl,
      type: isImage ? 'image' : 'video',
      category: category || 'gallery',
      serviceTypeId: serviceTypeId || null,
      alt: alt || file.name,
      caption: caption || '',
      size: file.size,
      width: isImage ? 800 : null,
      height: isImage ? 600 : null,
      createdAt: new Date().toISOString()
    };

    console.log('✅ Media uploaded successfully:', mediaItem.id);

    return NextResponse.json({
      success: true,
      data: mediaItem,
      message: 'Media uploaded successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Upload media error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('📸 DELETE /api/admin/media - Deleting media...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing media ID',
        message: 'Media ID is required'
      }, { status: 400 });
    }

    const mediaId = parseInt(id);
    if (isNaN(mediaId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid media ID',
        message: 'Media ID must be a number'
      }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Delete the file from cloud storage
    // 2. Remove the database record
    // 3. Clean up any thumbnails

    console.log('✅ Media deleted successfully:', mediaId);

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete media error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
