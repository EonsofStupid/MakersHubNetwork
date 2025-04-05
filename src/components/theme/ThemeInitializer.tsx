
import { useEffect, useState, useRef } from 'react';
import { ensureDefaultTheme } from '@/utils/themeInitializer';
import { useThemeStore } from '@/stores/theme/store';
import { useToast } from '@/hooks/use-toast';
import { DynamicKeyframes } from './DynamicKeyframes';
import { SiteThemeProvider } from './SiteThemeProvider';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { ThemeLoadingState } from './info/ThemeLoadingState';
import { useAuth } from '@/hooks/useAuth';

interface ThemeInitializerProps {
  children: React.ReactNode;
}

export function ThemeInitializer({ children }: ThemeInitializerProps) {
  const [isInitializing, setIsInitializing] = useState(true);
  const { setTheme, isLoading } = useThemeStore();
  const { toast } = useToast();
  const logger = useLogger('ThemeInitializer', LogCategory.UI);
  const initAttemptedRef = useRef<boolean>(false);
  const { status: authStatus } = useAuth(); 

  useEffect(() => {
    // Prevent multiple initialization attempts
    if (initAttemptedRef.current) {
      return;
    }
    
    // Only initialize theme after auth is ready
    if (authStatus === 'idle' || authStatus === 'loading') {
      return;
    }
    
    async function initialize() {
      try {
        initAttemptedRef.current = true;
        logger.info('Initializing theme');
        
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
    }, 100);
    
    return () => clearTimeout(timer);
  }, [authStatus, setTheme, toast, logger]);

  // Render content or loading state
  const showLoadingState = isInitializing || isLoading;
  
  // Always render the app - the SiteThemeProvider will handle showing loading states if needed
  return (
    <SiteThemeProvider isInitializing={showLoadingState}>
      <DynamicKeyframes />
      {showLoadingState ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <ThemeLoadingState />
        </div>
      ) : children}
    </SiteThemeProvider>
  );
}
