
import { adminRouter } from '@/admin/router';
import { RouterProvider } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { RouterErrorBoundary } from '@/components/routing/RouterErrorBoundary';
import { useRouterBridge } from '@/components/routing/RouterBridge';
import { useRouteTransition } from '@/hooks/useRouteTransition';

// Fallback component in case TanStack Router fails to initialize
const RouterFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4">
    <div className="space-y-4 text-center max-w-md">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
      <h1 className="text-2xl font-bold">Loading Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Please wait while we prepare the admin interface...
      </p>
    </div>
  </div>
);

export default function AdminWithTanstack() {
  const isDev = process.env.NODE_ENV === 'development';
  const { toast } = useToast();
  const [showDevTools, setShowDevTools] = useState(false);
  const [routerError, setRouterError] = useState<Error | null>(null);
  const { navigateTo } = useRouterBridge();
  const { isTransitioning } = useRouteTransition();
  
  useEffect(() => {
    // Welcome toast for admin panel
    toast({
      title: "Admin Panel",
      description: "Welcome to the MakersImpulse admin dashboard",
    });
    
    // Add console logs to help with debugging
    console.log("AdminWithTanstack mounted");
    console.log("Current router:", adminRouter);
    
    // Delay loading dev tools to ensure router is initialized
    if (isDev) {
      const timer = setTimeout(() => {
        setShowDevTools(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    // Prepare the router for initialization
    const init = async () => {
      try {
        // Initialize router if needed
        if (adminRouter && !adminRouter.state.status === 'pending') {
          await adminRouter.load();
        }
      } catch (error) {
        console.error("Router initialization error:", error);
      }
    };
    
    init();
  }, [toast, isDev]);

  // Handle router errors
  const handleRouterError = (error: unknown) => {
    console.error("TanStack Router error:", error);
    setRouterError(error instanceof Error ? error : new Error("Failed to initialize admin router"));
    
    toast({
      variant: "destructive",
      title: "Admin Dashboard Error",
      description: "There was an error loading the admin interface. Trying to recover..."
    });
    
    // After a short delay, try to navigate to the overview page as a recovery mechanism
    setTimeout(() => {
      navigateTo('/admin/overview');
    }, 2000);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="admin-tanstack-wrapper"
    >
      <RouterErrorBoundary 
        resetRoute="/admin/overview"
        onError={handleRouterError}
      >
        <AnimatePresence mode="wait">
          {routerError ? (
            <motion.div
              key="fallback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RouterFallback />
            </motion.div>
          ) : (
            <motion.div
              key="router"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Suspense fallback={<RouterFallback />}>
                <RouterProvider router={adminRouter} />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </RouterErrorBoundary>
      {isDev && showDevTools && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </motion.div>
  );
}
