
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

// This component handles global app initialization
export function AppInitializer({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        logger.info('Application initializing');
        
        // Initialize the application
        // Note: We're allowing the theme to load first, without waiting for auth
        
        // Small delay for UX purposes to ensure themes and styles are applied
        await new Promise(resolve => setTimeout(resolve, 100));
        
        logger.info('Application initialized successfully');
        setIsInitialized(true);
      } catch (error) {
        logger.error('Application initialization failed', { 
          details: { error } 
        });
        toast({
          title: 'Initialization Error',
          description: 'Failed to initialize the application. Please refresh and try again.',
          variant: 'destructive'
        });
        // Still mark as initialized to prevent eternal loading state
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, [logger, toast]);

  // Always render children regardless of auth state
  // This allows theme to load without auth checks
  return <>{children}</>;
}
