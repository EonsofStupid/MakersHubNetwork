
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
  const [isInitializing, setIsInitializing] = useState(true);
  const { setTheme, isLoading } = useThemeStore();
  const { toast } = useToast();
  const logger = useLogger('ThemeInitializer', LogCategory.UI);

  useEffect(() => {
    async function initialize() {
      try {
        // First, ensure the default theme exists in the database
        const themeId = await ensureDefaultTheme();
        
        if (themeId) {
          // Then sync CSS using the ensureDefaultTheme's built-in sync capability
          await setTheme(themeId);
          logger.info('Theme initialized successfully with ID:', { details: { themeId } });
        } else {
          logger.warn('Failed to initialize theme, falling back to default styles');
          toast({
            title: 'Theme Warning',
            description: 'Could not find or create theme. Using default styling.',
            variant: "destructive",
          });
        }
      } catch (error) {
        logger.error('Error initializing theme:', { details: error });
        toast({
          title: 'Theme Error',
          description: 'Failed to load theme. Using default styling.',
          variant: "destructive",
        });
      } finally {
        setIsInitializing(false);
      }
    }
    
    // Use a small timeout to prevent blocking the initial render
    const timer = setTimeout(() => {
      initialize();
    }, 10);
    
    return () => clearTimeout(timer);
  }, [setTheme, toast, logger]);

  // Always render the app - the SiteThemeProvider will handle showing loading states if needed
  return (
    <SiteThemeProvider isInitializing={isInitializing || isLoading}>
      <DynamicKeyframes />
      {children}
    </SiteThemeProvider>
  );
}
