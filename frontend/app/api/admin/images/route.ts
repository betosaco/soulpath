import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

interface ImageData {
  id: number;
  name: string;
  url: string;
  altText?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/admin/images - Starting request...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ User authenticated:', user.email);

    const supabase = createAdminClient();
    console.log('🔍 Fetching from images table...');
    
    // Try to fetch from database first
    const { data, error } = await supabase
      .from('images')
      .select('*');

    if (error) {
      console.log('⚠️ images table might not exist, using empty array:', error.message);
      
      // Return empty images array if table doesn't exist
      const defaultImages: ImageData[] = [];
      
      console.log('✅ Returning empty images array');
      return NextResponse.json({ images: defaultImages });
    }

    console.log('✅ Images fetched successfully:', data);
    return NextResponse.json({ images: data || [] });
  } catch (error) {
    console.error('❌ Unexpected error in GET /api/admin/images:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/admin/images - Starting request...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ User authenticated:', user.email);
    const body = await request.json();
    console.log('📝 Request body:', body);
    
    const supabase = createAdminClient();
    
    // Try to update the table
    const { data, error } = await supabase
      .from('images')
      .upsert(body, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.log('⚠️ images table might not exist, cannot update:', error.message);
      return NextResponse.json({ success: false, error: 'Images table does not exist. Please run the database setup first.',
        details: error.message 
      }, { status: 500 });
    }

    console.log('✅ Image updated successfully:', data);
    return NextResponse.json({ images: data });
  } catch (error) {
    console.error('❌ Unexpected error in POST /api/admin/images:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}
