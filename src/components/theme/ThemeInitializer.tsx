
import { useEffect, useState } from 'react';
import { ensureDefaultTheme } from '@/utils/themeInitializer';
import { useThemeStore } from '@/stores/theme/store';
import { useToast } from '@/hooks/use-toast';
import { DynamicKeyframes } from './DynamicKeyframes';
import { SiteThemeProvider } from './SiteThemeProvider';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface ThemeInitializerProps {
  children: React.ReactNode;
}

export function ThemeInitializer({ children }: ThemeInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationAttempted, setInitializationAttempted] = useState(false);
  const { setTheme, isLoading } = useThemeStore();
  const { toast } = useToast();
  const logger = useLogger('ThemeInitializer', LogCategory.SYSTEM);

  useEffect(() => {
    let isMounted = true;
    
    async function initialize() {
      if (initializationAttempted) return;
      
      try {
        logger.info('Starting theme initialization');
        setInitializationAttempted(true);
        
        // First, ensure the default theme exists in the database
        const themeId = await ensureDefaultTheme();
        
        if (!isMounted) return;
        
        if (themeId) {
          // Then sync CSS using the ensureDefaultTheme's built-in sync capability
          await setTheme(themeId);
          logger.info('Theme initialized successfully', { details: { themeId } });
          
          if (isMounted) {
            setIsInitialized(true);
          }
        } else {
          logger.warn('Failed to initialize theme, falling back to default styles');
          
          if (isMounted) {
            toast({
              title: 'Theme Warning',
              description: 'Could not find or create theme. Using default styling.',
              variant: "destructive",
            });
            setIsInitialized(true); // Continue with default styles
          }
        }
      } catch (error) {
        logger.error('Error initializing theme', { details: error });
        
        if (isMounted) {
          toast({
            title: 'Theme Error',
            description: 'Failed to load theme. Using default styling.',
            variant: "destructive",
          });
          setIsInitialized(true); // Continue with default styles
        }
      }
    }
    
    initialize();
    
    return () => {
      isMounted = false;
    };
  }, [setTheme, toast, logger, initializationAttempted]);

  // Instead of blocking the entire app while theme loads,
  // we'll continue rendering with a default theme
  return (
    <SiteThemeProvider>
      <DynamicKeyframes />
      {children}
    </SiteThemeProvider>
  );
}
