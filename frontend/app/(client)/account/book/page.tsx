'use client';

import { MasterBookingFlow } from '@/components/MasterBookingFlow';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/store/appStore';
import { AppShell } from '@/components/AppShell';

export default function BookPage() {
  const searchParams = useSearchParams();
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
    }
  }, [searchParams, addItem]);

  const handleCheckoutComplete = (orderData: any) => {
    console.log('Booking completed:', orderData);
    // Redirect to confirmation or account page
  };

  return (
    <AppShell>
      <div className="container mx-auto p-6">
        <MasterBookingFlow onCheckoutComplete={handleCheckoutComplete} />
      </div>
    </AppShell>
  );
}
