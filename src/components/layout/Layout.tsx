import type { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { AiTriggerButton } from '@/components/features/aiAssistant';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
      <AiTriggerButton />
    </div>
  );
}