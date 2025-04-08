
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoggingProvider } from '@/logging/context/LoggingContext';
import { LogConsole } from '@/logging/components/LogConsole';
import { LogToggleButton } from '@/logging/components/LogToggleButton';
import { ThemeInitializer } from '@/components/theme/ThemeInitializer';
import { ThemeEffectProvider } from '@/components/theme/effects/ThemeEffectProvider';
import { SiteThemeProvider } from '@/components/theme/SiteThemeProvider';
import { NoHydrationMismatch } from '@/components/util/NoHydrationMismatch';
import { getLogger } from '@/logging';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load route components
const Index = React.lazy(() => import('@/pages/Index'));
const Login = React.lazy(() => import('@/pages/Login'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const ChatLayout = React.lazy(() => import('@/chat/components/layouts/ChatLayout'));
const ChatHome = React.lazy(() => import('@/chat/pages/ChatHome'));
const ChatSession = React.lazy(() => import('@/chat/pages/ChatSession'));
const AdminRoutes = React.lazy(() => import('@/admin/routes/AdminRoutes').then(module => ({ default: module.AdminRoutes })));

// Common loading component for lazy-loaded routes
const SuspenseLoading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

const logger = getLogger('Router');

export function AppRouter() {
  // Default fallback theme to use if theme loading fails
  const defaultFallbackTheme = {
    primary: "186 100% 50%",
    secondary: "334 100% 59%",
    background: "228 47% 8%",
    foreground: "210 40% 98%",
    card: "228 47% 11%",
    effectColor: "#00F0FF",
    effectSecondary: "#FF2D6E",
  };

  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center h-screen flex-col">
          <h1 className="text-2xl font-bold mb-4">Something went wrong with the router</h1>
          <p className="text-lg mb-4">Please try refreshing the page</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Refresh
          </button>
        </div>
      }
    >
      <LoggingProvider>
        <ThemeInitializer 
          fallbackTheme={defaultFallbackTheme}
          applyImmediately={true}
        >
          <ThemeEffectProvider>
            <SiteThemeProvider>
              <NoHydrationMismatch
                fallback={<SuspenseLoading />}
              >
                <Routes>
                  {/* Site Routes */}
                  <Route path="/" element={
                    <React.Suspense fallback={<SuspenseLoading />}>
                      <Index />
                    </React.Suspense>
                  } />
                  <Route path="/login" element={
                    <React.Suspense fallback={<SuspenseLoading />}>
                      <Login />
                    </React.Suspense>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/*" element={
                    <React.Suspense fallback={<SuspenseLoading />}>
                      <AdminRoutes />
                    </React.Suspense>
                  } />
                  
                  {/* Chat Routes */}
                  <Route path="/chat" element={
                    <React.Suspense fallback={<SuspenseLoading />}>
                      <ChatLayout />
                    </React.Suspense>
                  }>
                    <Route index element={
                      <React.Suspense fallback={<SuspenseLoading />}>
                        <ChatHome />
                      </React.Suspense>
                    } />
                    <Route path="session/:sessionId" element={
                      <React.Suspense fallback={<SuspenseLoading />}>
                        <ChatSession />
                      </React.Suspense>
                    } />
                  </Route>
                  
                  {/* 404 Page */}
                  <Route path="*" element={
                    <React.Suspense fallback={<SuspenseLoading />}>
                      <NotFound />
                    </React.Suspense>
                  } />
                </Routes>
                
                {/* Floating UI elements */}
                <LogConsole />
                <LogToggleButton />
              </NoHydrationMismatch>
            </SiteThemeProvider>
          </ThemeEffectProvider>
        </ThemeInitializer>
      </LoggingProvider>
    </ErrorBoundary>
  );
}

// Simple hook to access the current router path
export function useCurrentPath() {
  return window.location.pathname;
}

export default AppRouter;
