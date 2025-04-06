
import { useEffect, useState, useRef } from 'react';
import { useImpulsivityTheme } from '@/hooks/useImpulsivityTheme';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { Loader } from 'lucide-react';
import { useThemeStore } from '@/stores/theme/store';
import { ThemeLogDetails } from '@/types/theme';

interface ImpulsivityInitProps {
  autoApply?: boolean;
  children?: React.ReactNode;
  showLoader?: boolean;
  priority?: boolean;
}

export function ImpulsivityInit({ 
  autoApply = true, 
  children, 
  showLoader = false,
  priority = false
}: ImpulsivityInitProps) {
  const { applyTheme, applyToMainSite, isSyncing } = useImpulsivityTheme();
  const { isLoading: themeStoreLoading } = useThemeStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isError, setIsError] = useState(false);
  const logger = useLogger('ImpulsivityInit', LogCategory.UI);
  const initAttempted = useRef(false);
  
  useEffect(() => {
    // Apply immediate styles to ensure something is visible
    const applyImmediateStyles = () => {
      // Set essential CSS variables directly for fast visual feedback
      const rootElement = document.documentElement;
      rootElement.style.setProperty('--site-primary', '186 100% 50%'); // #00F0FF in HSL  
      rootElement.style.setProperty('--site-secondary', '334 100% 59%'); // #FF2D6E in HSL
      rootElement.style.setProperty('--site-effect-color', '#00F0FF');
      rootElement.style.setProperty('--site-effect-secondary', '#FF2D6E');
      rootElement.style.setProperty('--site-background', '#080F1E');
      rootElement.style.setProperty('--site-foreground', '#F9FAFB');
    };
    
    // Apply immediate styles regardless of theme system state
    applyImmediateStyles();
    applyToMainSite().catch(e => 
      logger.warn('Failed to apply immediate styles', { 
        errorMessage: e instanceof Error ? e.message : String(e) 
      } as ThemeLogDetails)
    );
    
    // Mark as initialized immediately to not block rendering
    setIsInitialized(true);
    
    // Only initialize once to prevent infinite loops
    if (autoApply && !initAttempted.current) {
      initAttempted.current = true;
      logger.info('Initializing Impulsivity theme');
      
      // Run in background without blocking rendering
      const initPromise = priority 
        ? Promise.resolve().then(() => applyTheme()) 
        : setTimeout(() => applyTheme(), 0);
    }
  }, [autoApply, applyTheme, applyToMainSite, logger, priority]);
  
  // Skip loader - always render children to avoid blocking UI
  return <>{children}</>;
}
