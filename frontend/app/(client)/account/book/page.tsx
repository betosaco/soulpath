'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/store/appStore';
import { AppShell } from '@/components/AppShell';
import { CustomerInfoStep } from '@/components/booking/steps/CustomerInfoStep';
import { BookingLayout } from '@/components/booking/layout/BookingLayout';

export default function BookPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [initialSlotData, setInitialSlotData] = useState<{
    slotId?: string;
    teacherId?: string;
    serviceTypeId?: string;
    venueId?: string;
    date?: string;
    time?: string;
  } | null>(null);

  useEffect(() => {
    // Check if we have slot data from URL parameters
    const slotId = searchParams.get('slotId');
    const teacherId = searchParams.get('teacherId');
    const serviceTypeId = searchParams.get('serviceTypeId');
    const venueId = searchParams.get('venueId');
    const date = searchParams.get('date');
    const time = searchParams.get('time');

    if (slotId && teacherId && serviceTypeId && venueId && date && time) {
      setInitialSlotData({
        slotId,
        teacherId,
        serviceTypeId,
        venueId,
        date,
        time
      });

      // Add a single session package to cart for this booking
      addItem({
        id: `single-session-${slotId}`,
        name: 'Single Session',
        price: 50, // Default price, should be fetched from API
        image: '/placeholder-session.jpg',
        currency: 'PEN',
        type: 'package',
        sessions: 1,
        duration: 60,
        packageType: 'single',
        maxGroupSize: 1,
        bookingDetails: [{
          selectedDate: date,
          selectedTime: time,
          teacher: 'Teacher Name', // Should be fetched from API
          dayOfWeek: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
          serviceType: 'Yoga Session', // Should be fetched from API
          venue: 'Studio', // Should be fetched from API
          scheduleSlotId: parseInt(slotId)
        }]
      });

      // Navigate to direct checkout since we have a single session ready
      router.push('/booking/customer-info?isDirectCheckout=true');
    }
  }, [searchParams, addItem, router]);

  const handleDataSaved = (_data: any) => {
    // Navigate to shipping step for direct checkout
    router.push('/booking/shipping?isDirectCheckout=true');
  };

  // Show loading while processing slot data
  if (!initialSlotData) {
    return (
      <AppShell>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#FFD700] text-lg font-semibold">Preparing your booking...</p>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <BookingLayout>
        <CustomerInfoStep onDataSaved={handleDataSaved} />
      </BookingLayout>
    </AppShell>
  );
}
