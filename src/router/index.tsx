
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { useRouteCircuitBreaker } from '@/hooks/useRouteCircuitBreaker';
import { SiteLayout, RootLayout } from '@/router/routes/site';
import FloatingChatWrapper from '@/chat/components/FloatingChatWrapper';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { AuthGuard } from '@/components/AuthGuard';

export function AppRouter() {
  // Use the route circuit breaker to reset circuit breakers on route changes
  useRouteCircuitBreaker();
  const logger = useLogger('AppRouter', LogCategory.SYSTEM);
  
  // Log router initialization
  React.useEffect(() => {
    logger.info('AppRouter initialized');
  }, [logger]);
  
  return (
    <RootLayout>
      <Routes>
        <Route element={<SiteLayout />}>
          {/* Main site routes - marked as public to render even if auth isn't initialized */}
          <Route path="/" element={
            <AuthGuard publicRoute={true}>
              <HomePage />
            </AuthGuard>
          } />
          
          {/* Add all your routes above this line */}
          <Route path="*" element={
            <AuthGuard publicRoute={true}>
              <NotFoundPage />
            </AuthGuard>
          } />
        </Route>
      </Routes>
      
      {/* Floating chat is rendered outside the routes */}
      <FloatingChatWrapper />
    </RootLayout>
  );
}
