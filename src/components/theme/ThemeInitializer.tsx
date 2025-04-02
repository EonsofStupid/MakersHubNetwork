
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
  const { setTheme, isLoading } = useThemeStore();
  const { toast } = useToast();
  const logger = useLogger('ThemeInitializer', LogCategory.SYSTEM);

  useEffect(() => {
    let isMounted = true;
    
    async function initialize() {
      try {
        logger.info('Starting theme initialization');
        
        // First, ensure the default theme exists in the database
        const themeId = await ensureDefaultTheme();
        
        if (!isMounted) return;
        
        if (themeId) {
          // Then sync CSS using the ensureDefaultTheme's built-in sync capability
          await setTheme(themeId);
          logger.info('Theme initialized successfully', { details: { themeId } });
        } else {
          logger.warn('Failed to initialize theme, falling back to default styles');
          toast({
            title: 'Theme Warning',
            description: 'Could not find or create theme. Using default styling.',
            variant: "destructive",
          });
        }
      } catch (error) {
        logger.error('Error initializing theme', { details: error });
        
        if (isMounted) {
          toast({
            title: 'Theme Error',
            description: 'Failed to load theme. Using default styling.',
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    }
    
    initialize();
    
    return () => {
      isMounted = false;
    };
  }, [setTheme, toast, logger]);

  // Instead of blocking the entire app while theme loads,
  // we'll continue rendering with a default theme
  return (
    <SiteThemeProvider>
      <DynamicKeyframes />
      {children}
    </SiteThemeProvider>
  );
}
