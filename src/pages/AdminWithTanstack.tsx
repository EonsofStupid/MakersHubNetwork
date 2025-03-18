
import { adminRouter } from '@/admin/router';
import { RouterProvider } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Production-ready loading component
const RouterFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 text-center max-w-md"
    >
      <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
      <h1 className="text-2xl font-bold text-primary">Loading Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Initializing the admin interface...
      </p>
    </motion.div>
  </div>
);

// Error state component
const RouterError = ({ error, resetFn }: { error: Error, resetFn: () => void }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 text-center max-w-md"
    >
      <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
      <h1 className="text-2xl font-bold text-destructive">Admin Dashboard Error</h1>
      <p className="text-muted-foreground">
        {error.message || "Failed to load the admin interface"}
      </p>
      <button 
        onClick={resetFn}
        className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
      >
        Retry Loading
      </button>
    </motion.div>
  </div>
);

export default function AdminWithTanstack() {
  const isDev = process.env.NODE_ENV === 'development';
  const { toast } = useToast();
  const [routerError, setRouterError] = useState<Error | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    
    const initializeRouter = async () => {
      try {
        if (!isMounted) return;
        
        console.log("Initializing admin router...");
        setIsInitializing(true);
        
        // Pre-initialize the router and load its initial data
        await adminRouter.load();
        
        if (isMounted) {
          // Success message
          toast({
            title: "Admin Dashboard",
            description: "Admin interface loaded successfully",
          });
          
          // Short delay to ensure everything is ready
          setTimeout(() => {
            if (isMounted) {
              setIsInitializing(false);
            }
          }, 300);
        }
      } catch (error) {
        console.error("Admin router initialization error:", error);
        
        if (isMounted) {
          setRouterError(error instanceof Error ? error : new Error("Failed to initialize admin interface"));
          setIsInitializing(false);
          
          toast({
            variant: "destructive",
            title: "Admin Dashboard Error",
            description: "There was an error loading the admin interface."
          });
        }
      }
    };
    
    initializeRouter();
    
    return () => {
      isMounted = false;
    };
  }, [toast]);

  // Handle router errors with retry capability
  const handleRetry = () => {
    setRouterError(null);
    setIsInitializing(true);
    
    // Force reload the router
    window.location.reload();
  };

  // Show error state if there's an error
  if (routerError) {
    return <RouterError error={routerError} resetFn={handleRetry} />;
  }
  
  // Show loading state while initializing
  if (isInitializing) {
    return <RouterFallback />;
  }
  
  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="admin-tanstack-wrapper"
      >
        <RouterProvider router={adminRouter} />
        {isDev && <ReactQueryDevtools initialIsOpen={false} position="bottom" />}
      </motion.div>
    </ErrorBoundary>
  );
}
