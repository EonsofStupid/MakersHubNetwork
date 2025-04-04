import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './components/ui/theme-provider';
import { LoggingProvider } from './logging/context/LoggingContext';
import { initializeLogger } from './logging';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './auth/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';

// Initialize the logger
initializeLogger();

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <LoggingProvider>
          <AuthProvider>
            <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
              <BrowserRouter>
                <App />
                <Toaster />
              </BrowserRouter>
            </ThemeProvider>
          </AuthProvider>
        </LoggingProvider>
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
