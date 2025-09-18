'use client';

import { CustomerBookingFlow } from '@/components/CustomerBookingFlow';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BookPage() {
  const searchParams = useSearchParams();
  const [initialSlotData, setInitialSlotData] = useState<any>(null);

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
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto p-6">
      <CustomerBookingFlow initialSlotData={initialSlotData} />
    </div>
  );
}
