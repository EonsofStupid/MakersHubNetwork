
import { AuthProvider } from "@/auth/components/AuthProvider";
import { AdminProvider } from "@/admin/context/AdminContext";
import { useEffect, useState, useRef } from "react";
import { initializeLogger, getLogger } from "@/logging";
import { ChatProvider } from '@/chat/context/ChatProvider';
import { FloatingChat } from '@/chat/components/FloatingChat';
import { safeSSR } from "@/lib/utils/safeSSR";
import { AppInitializer } from "@/components/AppInitializer";
import { AppRouter } from "@/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

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

function App() {
  const [appReady, setAppReady] = useState(false);
  const appReadyRef = useRef(false);
  
  // Mark app as ready to allow progressive rendering, but do this only once
  useEffect(() => {
    // Skip if already marked ready
    if (appReadyRef.current || appReady) return;
    
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppInitializer>
          <AdminProvider>
            <ChatProvider>
              <AppRouter />
              <FloatingChat />
              <Toaster />
            </ChatProvider>
          </AdminProvider>
        </AppInitializer>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
