import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    // Get the product with images
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { images: true, name: true }
    });

    if (!product || !product.images || product.images.length === 0) {
      return new NextResponse('Image not found', { status: 404 });
    }

    // Get the first image
    const imageData = product.images[0];

    // Check if it's a base64 image
    if (imageData.startsWith('data:image/')) {
      // Extract the base64 data
      const base64Data = imageData.split(',')[1];
      const imageBuffer = Buffer.from(base64Data, 'base64');
      
      // Determine content type from the data URL
      const contentType = imageData.match(/data:([^;]+)/)?.[1] || 'image/jpeg';

      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } else {
      // It's a URL, redirect to it
      return NextResponse.redirect(imageData);
    }

  } catch (error) {
    console.error('Error serving product image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
