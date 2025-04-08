
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoggingProvider } from '@/logging/context/LoggingContext';
import { NoHydrationMismatch } from '@/components/util/NoHydrationMismatch';
import { getLogger } from '@/logging';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeInitializer } from '@/components/theme/ThemeInitializer';
import CircuitBreaker from '@/utils/CircuitBreaker';

// Initialize router circuit breaker
CircuitBreaker.init('router-renders', 10, 1000);

// Lazy load route components
const Index = React.lazy(() => import('@/pages/Index'));
const Login = React.lazy(() => import('@/pages/Login'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const Admin = React.lazy(() => import('@/pages/Admin')); 
const ChatLayout = React.lazy(() => import('@/chat/components/layouts/ChatLayout'));
const ChatHome = React.lazy(() => import('@/chat/pages/ChatHome'));
const ChatSession = React.lazy(() => import('@/chat/pages/ChatSession'));

// Common loading component for lazy-loaded routes
const SuspenseLoading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

const logger = getLogger('Router');

// Default fallback theme to use if theme loading fails
const fallbackTheme = {
  primary: "186 100% 50%",
  secondary: "334 100% 59%",
  background: "228 47% 8%",
  foreground: "210 40% 98%",
  card: "228 47% 11%",
  effectColor: "#00F0FF",
  effectSecondary: "#FF2D6E",
};

export function AppRouter() {
  // Check for excessive re-rendering
  if (CircuitBreaker.count('router-renders')) {
    logger.warn('Circuit breaker triggered in AppRouter - too many renders');
    return (
      <div className="p-4 text-center">
        <h2 className="text-lg font-bold">Loading error</h2>
        <p>Please refresh the page</p>
      </div>
    );
  }
  
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
      <ThemeInitializer fallbackTheme={fallbackTheme} applyImmediately={true}>
        <NoHydrationMismatch fallback={<SuspenseLoading />}>
          <Routes>
            {/* Site Routes */}
            <Route path="/" element={
              <Suspense fallback={<SuspenseLoading />}>
                <Index />
              </Suspense>
            } />
            <Route path="/login" element={
              <Suspense fallback={<SuspenseLoading />}>
                <Login />
              </Suspense>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <Suspense fallback={<SuspenseLoading />}>
                <Admin />
              </Suspense>
            } />
            
            {/* Chat Routes */}
            <Route path="/chat" element={
              <Suspense fallback={<SuspenseLoading />}>
                <ChatLayout />
              </Suspense>
            }>
              <Route index element={
                <Suspense fallback={<SuspenseLoading />}>
                  <ChatHome />
                </Suspense>
              } />
              <Route path="session/:sessionId" element={
                <Suspense fallback={<SuspenseLoading />}>
                  <ChatSession />
                </Suspense>
              } />
            </Route>
            
            {/* 404 Page */}
            <Route path="*" element={
              <Suspense fallback={<SuspenseLoading />}>
                <NotFound />
              </Suspense>
            } />
          </Routes>
        </NoHydrationMismatch>
      </ThemeInitializer>
    </ErrorBoundary>
  );
}

// Simple hook to access the current router path
export function useCurrentPath() {
  return window.location.pathname;
}

export default AppRouter;
