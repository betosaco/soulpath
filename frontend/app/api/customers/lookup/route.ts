import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { maskEmailForDisplay } from '@/lib/utils/email-mask';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, countryCode } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Format phone number for lookup (remove all non-digit characters)
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    
    // Validate phone number format for Peru
    if (countryCode === 'PE' || countryCode === '+51') {
      if (!/^9\d{8}$/.test(cleanPhoneNumber)) {
        return NextResponse.json({
          success: false,
          found: false,
          error: 'Peru mobile numbers must be 9 digits starting with 9 (e.g., 912345678)'
        }, { status: 400 });
      }
    }
    
    // Try to find user by phone number (exact match for better accuracy)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: cleanPhoneNumber },
          { phone: `+51 ${cleanPhoneNumber}` },
          { phone: `+51${cleanPhoneNumber}` },
          { phone: { contains: cleanPhoneNumber } }
        ]
      },
      include: {
        customerProfile: true,
        orders: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // Get last 5 orders
        }
      }
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        found: false,
        message: 'No customer found with this phone number'
      });
    }

    // Also try to find in Customer table directly
    const customer = await prisma.customer.findFirst({
      where: {
        phone: {
          contains: cleanPhoneNumber
        }
      }
    });

    // Prepare response data
    const customerData = {
      id: user.id,
      email: user.email,
      emailMasked: maskEmailForDisplay(user.email), // Add masked email for display
      fullName: user.fullName,
      phone: user.phone,
      birthDate: user.birthDate,
      birthTime: user.birthTime,
      birthPlace: user.birthPlace,
      language: user.language,
      status: user.status,
      notes: user.notes,
      adminNotes: user.adminNotes,
      lastBooking: user.lastBooking,
      createdAt: user.createdAt,
      // Customer profile data if exists
      customerProfile: user.customerProfile ? {
        firstName: user.customerProfile.firstName,
        lastName: user.customerProfile.lastName,
        dateOfBirth: user.customerProfile.dateOfBirth,
        totalOrders: user.customerProfile.totalOrders,
        totalSpent: user.customerProfile.totalSpent,
        lastOrderAt: user.customerProfile.lastOrderAt,
        status: user.customerProfile.status
      } : null,
      // Recent orders
      recentOrders: user.orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt
      }))
    };

    return NextResponse.json({
      success: true,
      found: true,
      data: customerData,
      message: 'Customer found successfully'
    });

  } catch (error) {
    console.error('Error looking up customer by phone:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to lookup customer' },
      { status: 500 }
    );
  }
}

// GET method for direct phone lookup
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phoneNumber = searchParams.get('phone');
    const countryCode = searchParams.get('countryCode');

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Format phone number for lookup
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    
    // Validate phone number format for Peru
    if (countryCode === 'PE' || countryCode === '+51') {
      if (!/^9\d{8}$/.test(cleanPhoneNumber)) {
        return NextResponse.json({
          success: false,
          found: false,
          error: 'Peru mobile numbers must be 9 digits starting with 9 (e.g., 912345678)'
        }, { status: 400 });
      }
    }
    
    // Try to find user by phone number (exact match for better accuracy)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: cleanPhoneNumber },
          { phone: `+51 ${cleanPhoneNumber}` },
          { phone: `+51${cleanPhoneNumber}` },
          { phone: { contains: cleanPhoneNumber } }
        ]
      },
      include: {
        customerProfile: true,
        orders: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 3 // Get last 3 orders for GET requests
        }
      }
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        found: false,
        message: 'No customer found with this phone number'
      });
    }

    // Prepare response data
    const customerData = {
      id: user.id,
      email: user.email,
      emailMasked: maskEmailForDisplay(user.email), // Add masked email for display
      fullName: user.fullName,
      phone: user.phone,
      birthDate: user.birthDate,
      birthTime: user.birthTime,
      birthPlace: user.birthPlace,
      language: user.language,
      status: user.status,
      notes: user.notes,
      adminNotes: user.adminNotes,
      lastBooking: user.lastBooking,
      createdAt: user.createdAt,
      // Customer profile data if exists
      customerProfile: user.customerProfile ? {
        firstName: user.customerProfile.firstName,
        lastName: user.customerProfile.lastName,
        dateOfBirth: user.customerProfile.dateOfBirth,
        totalOrders: user.customerProfile.totalOrders,
        totalSpent: user.customerProfile.totalSpent,
        lastOrderAt: user.customerProfile.lastOrderAt,
        status: user.customerProfile.status
      } : null,
      // Recent orders
      recentOrders: user.orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt
      }))
    };

    return NextResponse.json({
      success: true,
      found: true,
      data: customerData,
      message: 'Customer found successfully'
    });

  } catch (error) {
    console.error('Error looking up customer by phone:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to lookup customer' },
      { status: 500 }
    );
  }
}