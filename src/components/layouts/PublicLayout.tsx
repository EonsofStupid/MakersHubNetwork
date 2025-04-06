
import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicHeader } from '@/components/navigation/PublicHeader';

interface PublicLayoutProps {
  className?: string;
}

export function PublicLayout({ className }: PublicLayoutProps) {
  return (
    <div className={`flex flex-col min-h-screen bg-background ${className || ''}`}>
      <PublicHeader />
      
      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          © {new Date().getFullYear()} Impulsivity. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
