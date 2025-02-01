import { ReactNode } from 'react';
import { Footer } from '../components/Footer';
import { MainNav } from '../components/nav/MainNav';

interface DesktopLayoutProps {
  children: ReactNode;
}

export function DesktopLayout({ children }: DesktopLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}