
import { useEffect, useState, useRef } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { useToast } from '@/hooks/use-toast';
import { DynamicKeyframes } from './DynamicKeyframes';
import { SiteThemeProvider } from './SiteThemeProvider';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { ThemeLoadingState } from './info/ThemeLoadingState';
import { ThemeErrorState } from './info/ThemeErrorState';
import { getTheme, ensureDefaultTheme } from '@/services/themeService';
import { Theme } from '@/types/theme';

interface ThemeInitializerProps {
  children: React.ReactNode;
}

export function ThemeInitializer({ children }: ThemeInitializerProps) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { setTheme, isLoading, currentTheme } = useThemeStore();
  const { toast } = useToast();
  const logger = useLogger('ThemeInitializer', LogCategory.UI);
  const initAttemptedRef = useRef<boolean>(false);

  useEffect(() => {
    // Prevent multiple initialization attempts
    if (initAttemptedRef.current) {
      return;
    }
    
    async function initialize() {
      try {
        initAttemptedRef.current = true;
        logger.info('Initializing theme');
        
        // First attempt to get the default theme directly using the service role
        try {
          const { theme, isFallback } = await getTheme();
          
          if (theme) {
            // Use the theme returned from the service (could be actual or fallback)
            await setTheme(theme.id);
            
            if (isFallback) {
              logger.info('Using fallback theme');
              toast({
                title: 'Theme Notice',
                description: 'Using fallback theme. Some styles may be limited.',
                variant: "default",
              });
              
              // Try to ensure a real default theme exists in the background
              ensureDefaultTheme().catch(err => {
                logger.error('Error ensuring default theme', { details: err });
              });
            } else {
              logger.info('Theme initialized successfully with ID:', { details: { themeId: theme.id } });
            }
            
            return;
          }
        } catch (error) {
          logger.error('Error from theme service:', { details: error });
          setError(error instanceof Error ? error : new Error(String(error)));
        }
        
        // Fallback: If the above fails, try to ensure a default theme exists
        try {
          const themeId = await ensureDefaultTheme();
          
          if (themeId) {
            // Then set the theme using the ID via the store (which will now use our service)
            const { theme } = await getTheme(themeId);
            await setTheme(theme.id);
            logger.info('Theme initialized successfully with ID:', { details: { themeId } });
          } else {
            // Use the fallback theme as last resort
            const { theme } = await getTheme();
            await setTheme(theme.id);
            logger.info('Using fallback theme after failed initialization');
            toast({
              title: 'Theme Notice',
              description: 'Using fallback theme. Some styles may be limited.',
              variant: "default",
            });
          }
        } catch (secondError) {
          logger.error('Failed in fallback initialization:', { details: secondError });
          setError(secondError instanceof Error ? secondError : new Error(String(secondError)));
          
          toast({
            title: 'Theme Error',
            description: 'Failed to load theme. Using default styling.',
            variant: "destructive",
          });
        }
      } catch (finalError) {
        logger.error('Error initializing theme:', { details: finalError });
        setError(finalError instanceof Error ? finalError : new Error(String(finalError)));
        
        // Despite errors, don't block the app - use basic styling
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
  }, [setTheme, toast, logger]);

  // Render content or loading state
  const showLoadingState = isInitializing || isLoading;
  
  // Handle retry
  const handleRetry = () => {
    setError(null);
    setIsInitializing(true);
    initAttemptedRef.current = false;
  };
  
  // Always render the app - the SiteThemeProvider will handle showing loading states if needed
  return (
    <SiteThemeProvider isInitializing={showLoadingState}>
      <DynamicKeyframes />
      {error ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <ThemeErrorState error={error} onRetry={handleRetry} />
        </div>
      ) : showLoadingState ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <ThemeLoadingState />
        </div>
      ) : children}
    </SiteThemeProvider>
  );
}
