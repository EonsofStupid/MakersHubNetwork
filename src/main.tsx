
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'
import { initializeLogger, getLogger } from '@/logging'
import { LogCategory } from '@/logging/types'
import { initializeAllComponentRegistries } from '@/components/registry/ComponentRegistryInitializer'

// Initialize logging system first
initializeLogger();

const logger = getLogger('main');
logger.info('Application starting', { category: LogCategory.SYSTEM });

// Initialize component registries before rendering
try {
  logger.info('Initializing component registries', { category: LogCategory.SYSTEM });
  initializeAllComponentRegistries();
  logger.info('Component registries initialized successfully', { category: LogCategory.SYSTEM });
} catch (error) {
  logger.error('Failed to initialize component registries', { 
    category: LogCategory.SYSTEM,
    details: error
  });
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      onError: (error) => {
        logger.error('Query error', { 
          category: LogCategory.DATA,
          details: error
        });
      }
    },
  },
});

// Log app initialization
logger.info('Mounting React application', { category: LogCategory.SYSTEM });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
