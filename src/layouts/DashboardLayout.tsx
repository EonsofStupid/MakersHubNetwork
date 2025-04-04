
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';

export function DashboardLayout() {
  const logger = useLogger('DashboardLayout', { category: LogCategory.SYSTEM });
  
  logger.debug('Dashboard layout rendered');
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4">
          <h1 className="text-2xl font-bold">MakersImpulse Dashboard</h1>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container mx-auto py-6">
          <Outlet />
        </div>
      </main>
      
      <footer className="border-t">
        <div className="container mx-auto py-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} MakersImpulse. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
