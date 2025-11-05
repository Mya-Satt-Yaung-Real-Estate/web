import { Outlet } from 'react-router-dom';
import { Navigation } from '../../components/layout/Navigation';
import { Footer } from '../../components/layout/Footer';
import { AiTriggerButton } from '@/components/features/aiAssistant';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AiTriggerButton />
    </div>
  );
}
