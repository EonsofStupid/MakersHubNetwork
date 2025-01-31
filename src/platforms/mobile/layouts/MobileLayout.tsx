import { ReactNode } from 'react';
import { MainNav } from '@/components/MainNav';
import { Footer } from '@/components/Footer';

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MainNav />
      <main className="flex-1 container mx-auto px-2 py-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}