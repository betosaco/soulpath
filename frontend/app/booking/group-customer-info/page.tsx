import { AppShell } from '@/components/AppShell';
import { BookingLayout } from '@/components/booking/layout/BookingLayout';
import { GroupCustomerInfoStep } from '@/components/booking/steps/GroupCustomerInfoStep';

export default function GroupCustomerInfoPage() {
  return (
    <AppShell>
      <BookingLayout showStepIndicator={false}>
        <GroupCustomerInfoStep />
      </BookingLayout>
    </AppShell>
  );
}
