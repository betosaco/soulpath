import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createEnums() {
  try {
    console.log('🔧 Creating enum types...');

    // Create ProductStatus enum
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "public"."ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'DISCONTINUED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // Create UserStatus enum
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // Create BookingStatus enum
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "public"."BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // Create PaymentStatus enum
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // Create OrderStatus enum
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "public"."OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // Create ShippingStatus enum
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "public"."ShippingStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // Create CustomerStatus enum
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "public"."CustomerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    console.log('✅ All enum types created successfully');

  } catch (error) {
    console.error('❌ Error creating enums:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createEnums();
