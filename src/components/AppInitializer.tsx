
import { ReactNode, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface AppInitializerProps {
  children: ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const { toast } = useToast();
  const logger = useLogger('AppInitializer', LogCategory.SYSTEM);
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Log initialization
        logger.info('Initializing application');
        
        // Perform any critical initialization tasks here
        // For example, ensure authentication is initialized
        
        // Mark as initialized
        setInitialized(true);
        
        // Log success
        logger.info('Application initialized successfully');
        
      } catch (error) {
        // Log error
        logger.error('Failed to initialize application', { 
          details: { 
            error: error instanceof Error ? error.message : String(error) 
          }
        });
        
        // Show error toast
        toast({
          title: 'Initialization Failed',
          description: 'Failed to initialize application. Some features may not work properly.',
          variant: 'destructive',
        });
        
        // Still mark as initialized to avoid blocking UI
        setInitialized(true);
      }
    };
    
    // Run initialization
    initializeApp();
  }, [logger, toast]);
  
  // Always render children - we don't block rendering
  return <>{children}</>;
}
