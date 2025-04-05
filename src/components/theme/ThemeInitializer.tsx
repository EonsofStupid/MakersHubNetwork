
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
  const themeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleCountRef = useRef<number>(0);

  // Initialize theme only once
  useEffect(() => {
    // Cycle detection to prevent infinite loops
    cycleCountRef.current += 1;
    if (cycleCountRef.current > 10) {
      logger.warn('Possible theme initialization cycle detected', {
        details: { cycleCount: cycleCountRef.current }
      });
      return; // Stop execution to break the loop
    }
    
    // Prevent multiple initialization attempts
    if (initAttemptedRef.current) {
      return;
    }
    
    async function initialize() {
      try {
        // Mark initialization as attempted immediately
        initAttemptedRef.current = true;
        logger.info('Initializing theme');
        
        // Try to get the theme directly - simplifies the call chain
        const fallbackTheme = await getTheme();
        
        if (!fallbackTheme.theme) {
          throw new Error('Failed to load theme: No theme data');
        }
        
        // Set the theme using the ID
        await setTheme(fallbackTheme.theme.id);
        
        if (fallbackTheme.isFallback) {
          logger.info('Using fallback theme - attempting to ensure default exists');
          
          // Try to ensure a real default theme exists in the background
          try {
            const defaultThemeId = await ensureDefaultTheme();
            
            if (defaultThemeId) {
              logger.info('Default theme ensured', { details: { themeId: defaultThemeId } });
            }
          } catch (defaultThemeError) {
            // Just log this error, don't set it as the main error
            logger.error('Error ensuring default theme', { details: defaultThemeError });
          }
        } else {
          logger.info('Theme initialized successfully with ID:', { details: { themeId: fallbackTheme.theme.id } });
        }
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        logger.error('Error initializing theme:', { details: errorObj });
        setError(errorObj);
        
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
    themeTimeoutRef.current = setTimeout(() => {
      initialize();
    }, 100);
    
    return () => {
      if (themeTimeoutRef.current) {
        clearTimeout(themeTimeoutRef.current);
      }
    };
  }, [setTheme, toast, logger]);

  // Handle retry
  const handleRetry = () => {
    setError(null);
    setIsInitializing(true);
    initAttemptedRef.current = false;
  };
  
  // Show loading state or error state if needed, otherwise render children
  const showLoadingState = isInitializing || isLoading;
  
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
