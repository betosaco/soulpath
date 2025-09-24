import { AppShell } from '@/components/AppShell';
import { BookingLayout } from '@/components/booking/layout/BookingLayout';
import { GroupBookingSelectionStep } from '@/components/booking/steps/GroupBookingSelectionStep';

export default function GroupSelectionPage() {
  return (
    <AppShell>
      <BookingLayout showStepIndicator={false}>
        <GroupBookingSelectionStep />
      </BookingLayout>
    </AppShell>
  );
}
