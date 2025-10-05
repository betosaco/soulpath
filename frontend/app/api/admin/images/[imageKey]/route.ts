import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: { imageKey: string } }
) {
  try {
    console.log('🔍 POST /api/admin/images/[imageKey] - Starting request...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ User authenticated:', user.email);
    const { imageKey } = params;
    const body = await request.json();
    const { file } = body;
    console.log('📝 Request body:', { imageKey, file });

    if (!file) {
      return NextResponse.json({ success: false, error: 'File data is required' 
      }, { status: 400 });
    }

    // Try to update the table
    const { data, error } = await supabase
      .from('images')
      .upsert({
        key: imageKey,
        url: file.url || file,
        metadata: file.metadata || {},
        updatedAt: new Date().toISOString()
      }, { onConflict: 'key' })
      .select()
      .single();

    if (error) {
      console.log('⚠️ images table might not exist, cannot update:', error.message);
      return NextResponse.json({ success: false, error: 'Images table does not exist. Please run the database setup first.',
        details: error.message 
      }, { status: 500 });
    }

    console.log('✅ Image updated successfully:', data);
    return NextResponse.json({ 
      success: true,
      message: 'Image updated successfully',
      image: data
    });

  } catch (error) {
    console.error('❌ Unexpected error in POST /api/admin/images/[imageKey]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { imageKey: string } }
) {
  try {
    console.log('🔍 PUT /api/admin/images/[imageKey] - Starting request...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ User authenticated:', user.email);
    const { imageKey } = params;
    const body = await request.json();
    const { url } = body;
    console.log('📝 Request body:', { imageKey, url });

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL is required' 
      }, { status: 400 });
    }

    // Try to update the table
    const { data, error } = await supabase
      .from('images')
      .upsert({
        key: imageKey,
        url,
        updatedAt: new Date().toISOString()
      }, { onConflict: 'key' })
      .select()
      .single();

    if (error) {
      console.log('⚠️ images table might not exist, cannot update:', error.message);
      return NextResponse.json({ success: false, error: 'Images table does not exist. Please run the database setup first.',
        details: error.message 
      }, { status: 500 });
    }

    console.log('✅ Image URL updated successfully:', data);
    return NextResponse.json({ 
      success: true,
      message: 'Image URL updated successfully',
      image: data
    });

  } catch (error) {
    console.error('❌ Unexpected error in PUT /api/admin/images/[imageKey]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { imageKey: string } }
) {
  try {
    console.log('🔍 DELETE /api/admin/images/[imageKey] - Starting request...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ User authenticated:', user.email);
    const { imageKey } = params;
    console.log('📝 Deleting image key:', imageKey);

    // Try to delete from the table
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('key', imageKey);

    if (error) {
      console.log('⚠️ images table might not exist, cannot delete:', error.message);
      return NextResponse.json({ success: false, error: 'Images table does not exist. Please run the database setup first.',
        details: error.message 
      }, { status: 500 });
    }

    console.log('✅ Image deleted successfully');
    return NextResponse.json({ 
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('❌ Unexpected error in DELETE /api/admin/images/[imageKey]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}
