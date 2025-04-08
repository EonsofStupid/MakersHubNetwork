
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

// Create QueryClient instance with better defaults to avoid excessive retries
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1, // Limit retries
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Skip cache invalidation on unmount and window focus to prevent excess requests
      refetchOnWindowFocus: false,
      refetchOnReconnect: false
    },
    mutations: {
      retry: 1,
    }
  }
});

function App() {
  const [appReady, setAppReady] = useState(false);
  const appReadyRef = useRef(false);
  const [authInitError, setAuthInitError] = useState<string | null>(null);
  
  // Mark app as ready to allow progressive rendering, but do this only once
  useEffect(() => {
    // Initialize circuit breaker to prevent infinite loops
    CircuitBreaker.init('app-init', 5, 1000);
    
    // Skip if already marked ready
    if (appReadyRef.current || appReady) return;
    
    // Check circuit breaker to detect potential render loops
    if (CircuitBreaker.isTripped('app-init')) {
      logger.warn('CircuitBreaker detected potential infinite loop in App initialization');
      return;
    }
    
    // Mark as ready to avoid repeated initialization
    appReadyRef.current = true;
    
    // Small delay to ensure initial rendering is complete
    const timer = setTimeout(() => {
      setAppReady(true);
      safeSSR(() => {
        document.documentElement.setAttribute('data-app-ready', 'true');
      }, undefined); // Fixed by passing undefined as fallback
      logger.info('App marked as ready');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []); // Empty dependency array - only run once
  
  // Handle auth initialization errors gracefully
  const handleAuthError = (error: Error) => {
    logger.error('Auth initialization error:', { error: error.message });
    setAuthInitError(error.message);
  };
  
  return (
    <ErrorBoundary fallback={<div className="p-6">Something went wrong. Please try refreshing.</div>}>
      <QueryClientProvider client={queryClient}>
        <Router>
          {/* 
            Bridge Architecture:
            AuthProvider -> AdminProvider -> ChatProvider -> AppRouter
            Each provider should only consume from providers above it
            
            We've configured AuthProvider to not block rendering of public routes,
            so users can see content even if auth is still initializing
          */}
          <AuthProvider onError={handleAuthError}>
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
