
import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeInitializer } from '@/components/theme/ThemeInitializer';

export function RootLayout({ children }: { children?: React.ReactNode }) {
  return (
    <ThemeInitializer>
      <div className="bg-background text-foreground min-h-screen">
        {children}
      </div>
    </ThemeInitializer>
  );
}

export function SiteLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}
