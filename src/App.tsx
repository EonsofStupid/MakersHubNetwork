
import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { MainNav } from '@/components/MainNav';
import { AuthProvider } from '@/auth/components/AuthProvider';
import { ThemeInitializer } from '@/components/theme/ThemeInitializer';
import { KeyboardNavigation } from '@/components/KeyboardNavigation';
import { getLogger, initializeLogger, LogCategory } from '@/logging';
import { LoggingProvider } from '@/logging/context/LoggingContext';
import { initializeAuthBridge } from '@/auth/bridge';
import { usePerformanceLogger } from '@/hooks/use-performance-logger';

// Lazy load routes for better performance
const Index = lazy(() => import('@/pages/Index'));
const AdminRoutes = lazy(() => import('@/admin/routes').then(mod => ({ default: mod.AdminRoutes })));
const BuildRoutes = lazy(() => import('@/build/routes').then(mod => ({ default: mod.BuildRoutes })));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

export default function App() {
  const logger = getLogger('App');
  const performance = usePerformanceLogger('App');
  
  // Initialize the application
  useEffect(() => {
    performance.measure('app-initialization', () => {
      // Initialize the logging system
      initializeLogger();
      
      logger.info('Application initialized', { 
        category: LogCategory.SYSTEM,
        details: {
          version: import.meta.env.VITE_APP_VERSION || 'dev',
          environment: import.meta.env.MODE
        }
      });
      
      // Initialize auth bridge for event system
      initializeAuthBridge();
    });
    
    // Return cleanup function for when the app unmounts
    return () => {
      logger.info('Application shutting down', { 
        category: LogCategory.SYSTEM 
      });
    };
  }, []);
  
  return (
    <LoggingProvider>
      <ThemeInitializer>
        <AuthProvider>
          <MainNav />
          
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
              <Route path="/build/*" element={<BuildRoutes />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          
          <KeyboardNavigation options={{ enabled: true, showToasts: false }} />
          <Toaster />
        </AuthProvider>
      </ThemeInitializer>
    </LoggingProvider>
  );
}
