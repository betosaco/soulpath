import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            orderItems: true,
            inventoryLogs: true
          }
        },
        inventoryLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const {
      name,
      description,
      shortDescription,
      sku,
      price,
      comparePrice,
      costPrice,
      currency,
      stock,
      minStock,
      maxStock,
      weight,
      dimensions,
      category,
      tags,
      images,
      status,
      isDigital,
      isFeatured,
      isPopular,
      seoTitle,
      seoDescription,
      slug
    } = body;

    const updateData: {
      name?: string;
      description?: string;
      shortDescription?: string;
      sku?: string;
      price?: number;
      comparePrice?: number;
      costPrice?: number;
      currency?: string;
      stock?: number;
      minStock?: number;
      maxStock?: number;
      weight?: number;
      dimensions?: string;
      category?: string;
      tags?: string[];
      images?: string[];
      status?: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
      isDigital?: boolean;
      isFeatured?: boolean;
      isPopular?: boolean;
      seoTitle?: string;
      seoDescription?: string;
      slug?: string;
    } = {};
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
    if (sku !== undefined) updateData.sku = sku;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (comparePrice !== undefined) updateData.comparePrice = comparePrice ? parseFloat(comparePrice) : undefined;
    if (costPrice !== undefined) updateData.costPrice = costPrice ? parseFloat(costPrice) : undefined;
    if (currency !== undefined) updateData.currency = currency;
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (minStock !== undefined) updateData.minStock = parseInt(minStock);
    if (maxStock !== undefined) updateData.maxStock = maxStock ? parseInt(maxStock) : undefined;
    if (weight !== undefined) updateData.weight = weight ? parseFloat(weight) : undefined;
    if (dimensions !== undefined) updateData.dimensions = dimensions;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (images !== undefined) updateData.images = images;
    if (status !== undefined && ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'].includes(status)) {
      updateData.status = status as 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
    }
    if (isDigital !== undefined) updateData.isDigital = isDigital;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (isPopular !== undefined) updateData.isPopular = isPopular;
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
    if (slug !== undefined) updateData.slug = slug;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
