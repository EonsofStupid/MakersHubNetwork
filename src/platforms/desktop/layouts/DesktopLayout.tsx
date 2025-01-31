import { ReactNode } from 'react';
import { MainNav } from '@/components/MainNav';
import { Footer } from '@/components/Footer';

interface DesktopLayoutProps {
  children: ReactNode;
}

export function DesktopLayout({ children }: DesktopLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MainNav />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}