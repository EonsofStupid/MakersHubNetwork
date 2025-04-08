
import React, { useEffect, useState, useRef } from "react";
import { AuthProvider } from "@/auth/components/AuthProvider";
import { AdminProvider } from "@/admin/context/AdminContext";
import { initializeLogger, getLogger } from "@/logging";
import { ChatProvider } from '@/chat/context/ChatProvider';
import { safeSSR } from "@/lib/utils/safeSSR";
import { AppInitializer } from "@/components/AppInitializer";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRouter } from "@/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import CircuitBreaker from "@/utils/CircuitBreaker";

// Import styles
import "./App.css";
import "@/theme/site-theme.css";
import "@/components/MainNav/styles/cyber-effects.css";
import "@/logging/styles/logging.css";
import "@/admin/styles/cyber-effects.css";

// Initialize logging system - do this only once
const loggerInitialized = { current: false };

function initLogging(): void {
  if (!loggerInitialized.current) {
    initializeLogger();
    loggerInitialized.current = true;
  }
}

// Initialize immediately
initLogging();

const logger = getLogger('App');

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1
    }
  }
});

// Create a single FloatingChat component reference to avoid multiple instances
const FloatingChatLazy = React.lazy(() => import('@/chat/components/FloatingChatWrapper'));

function App() {
  const [appReady, setAppReady] = useState(false);
  const appReadyRef = useRef(false);
  
  // Mark app as ready to allow progressive rendering, but do this only once
  useEffect(() => {
    // Skip if already marked ready
    if (appReadyRef.current || appReady) return;
    
    // Check circuit breaker to prevent infinite loops
    if (CircuitBreaker.count('app-init')) {
      logger.warn('CircuitBreaker detected potential infinite loop in App initialization');
      return;
    }
    
    appReadyRef.current = true;
    
    // Small delay to ensure initial rendering is complete
    const timer = setTimeout(() => {
      setAppReady(true);
      safeSSR(() => {
        document.documentElement.setAttribute('data-app-ready', 'true');
      }, undefined);
      logger.info('App marked as ready');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []); // Empty dependency array - only run once
  
  return (
    <ErrorBoundary fallback={<div className="p-6">Something went wrong. Please try refreshing.</div>}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <AppInitializer>
              <AdminProvider>
                <ChatProvider>
                  <AppRouter />
                  <Toaster />
                </ChatProvider>
              </AdminProvider>
            </AppInitializer>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
