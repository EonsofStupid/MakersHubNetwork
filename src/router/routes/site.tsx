
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { z } from 'zod';

import { MainNav } from '@/components/MainNav';
import { Footer } from '@/components/Footer';
import { LogToggleButton } from '@/logging/components/LogToggleButton';
import { LogConsole } from '@/logging/components/LogConsole';
import { useLoggingContext } from '@/logging/context/LoggingContext';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

// Login search params schema
export const loginSearchSchema = z.object({
  redirectTo: z.string().optional(),
  error: z.string().optional(),
});

// Root layout component that includes site-wide UI elements
export function RootLayout({ children }: { children: ReactNode }) {
  const logger = useLogger('RootLayout', LogCategory.UI);
  
  React.useEffect(() => {
    logger.info('RootLayout mounted');
  }, [logger]);
  
  return (
    <div className="app-root w-full max-w-full min-h-screen flex flex-col">
      {children}
      <LoggingComponents />
    </div>
  );
}

// Logging components wrapper to avoid context issues
function LoggingComponents() {
  const { showLogConsole } = useLoggingContext();
  
  return (
    <>
      {showLogConsole && <LogConsole />}
      <LogToggleButton />
    </>
  );
}

// Site layout with nav and footer
export function SiteLayout() {
  const logger = useLogger('SiteLayout', LogCategory.UI);
  
  React.useEffect(() => {
    logger.info('SiteLayout mounted - this should wrap all public site pages');
  }, [logger]);
  
  return (
    <>
      <MainNav />
      <main className="flex-grow w-full pt-16">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

// Export React Router DOM Outlet
export { Outlet } from 'react-router-dom';

// Export route paths for reference
export const siteRoutes = {
  index: '/',
  login: '/login',
};
