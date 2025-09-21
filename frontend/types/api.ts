// TypeScript interfaces based on actual Prisma query results
import { Decimal } from '@prisma/client/runtime/library';

export interface UserPackageData {
  id: number;
  userId: string;
  orderItemId: string;
  packagePriceId: number;
  purchaseId?: number | null;
  quantity?: number | null;
  sessionsUsed?: number | null;
  isActive?: boolean | null;
  expiresAt?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  packagePrice: {
    id: number;
    price: Decimal;
    packageDefinition: {
      id: number;
      name: string;
      description?: string | null;
      sessionsCount: number;
      packageType: string;
      sessionDuration?: {
        name: string;
        duration_minutes: number;
      } | null;
    };
    currency: {
      code: string;
      symbol: string;
    };
  };
  purchase?: {
    id: number;
    totalAmount: Decimal;
    currency: string;
    paymentStatus: string;
    purchasedAt: Date;
  } | null;
}

export interface BookingData {
  id: number;
  status?: string | null;
  createdAt: Date | null;
  user: {
    id: string;
    fullName?: string | null;
    email: string;
  };
  teacherScheduleSlot?: {
    startTime: Date;
  } | null;
  scheduleSlot?: {
    startTime: Date;
  } | null;
  userPackage?: {
    packagePrice: {
      packageDefinition: {
        name: string;
        packageType: string;
        sessionsCount: number;
        sessionDuration?: {
          duration_minutes: number;
        } | null;
      };
    };
  } | null;
}

export interface OrderItemData {
  id: string;
  itemType: string;
  productId?: string | null;
  packagePriceId?: number | null;
  quantity: number;
  price: Decimal;
  total: Decimal;
  product?: {
    id: string;
    name: string;
    image?: string | null;
    sku?: string | null;
  } | null;
  packagePrice?: {
    id: number;
    packageDefinition: {
      id: number;
      name: string;
      sessionsCount: number;
      packageType: string;
      sessionDuration?: {
        duration_minutes: number;
      } | null;
      maxGroupSize?: number | null;
    };
  } | null;
}

export interface ProductData {
  id: string;
  name: string;
  price: string | number;
  comparePrice?: string | number | null;
  category?: string;
  stock?: number;
  weight?: number;
  currency?: string;
}

export interface BookingStatsData {
  status?: string | null;
  _count: {
    status: number;
  };
}

export interface StripePromiseType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  then: (onfulfilled?: (value: any) => any) => Promise<any>;
}
