import { ReactNode } from 'react';
import { MainNav } from '@/components/MainNav';

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}