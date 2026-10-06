import { Outlet } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import RepentanceModal from '@/components/mizan/RepentanceModal';
import BadgeUnlockToast from '@/components/mizan/BadgeUnlockToast';

export default function AppLayout() {
  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <main className="pb-24">
        <Outlet />
      </main>
      <BottomNav />
      <RepentanceModal />
      <BadgeUnlockToast />
    </div>
  );
}