
import React from 'react';
import { Footer } from './Footer';
import { MainNav } from './MainNav';
import { SystemToaster } from './ui/toaster';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell = ({ children }: ShellProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 pt-16">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          {children}
        </div>
      </main>
      <Footer />
      <SystemToaster />
    </div>
  );
};
