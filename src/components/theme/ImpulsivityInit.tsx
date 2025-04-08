
import { useEffect, useState, useRef } from 'react';
import { useImpulsivityTheme } from '@/hooks/useImpulsivityTheme';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useThemeStore } from '@/stores/theme/themeStore';
import { ThemeLoadingState } from './info/ThemeLoadingState';

interface ImpulsivityInitProps {
  children: React.ReactNode;
  priority?: boolean;
  autoApply?: boolean;
  showLoadingState?: boolean;
}

export function ImpulsivityInit({ 
  children, 
  priority = false, 
  autoApply = false,
  showLoadingState = false
}: ImpulsivityInitProps) {
  const { applyToMainSite } = useImpulsivityTheme();
  const logger = useLogger('ImpulsivityInit', LogCategory.UI);
  const [isApplied, setIsApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const { loadStatus, currentTheme } = useThemeStore();
  const applyAttempted = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Apply the theme if autoApply is true - using refs to track state
  useEffect(() => {
    // Skip if we've already applied or are currently applying
    if (isApplied || isApplying || !autoApply || applyAttempted.current) {
      return;
    }
    
    // Only apply theme when we have a successful load status or after a timeout
    if ((autoApply && loadStatus === 'success') || 
        (autoApply && !applyAttempted.current)) {
      
      // Mark as attempted to prevent multiple attempts
      applyAttempted.current = true;
      setIsApplying(true);
      
      const applyWithPriority = async () => {
        try {
          // Apply default theme immediately to ensure basic styling
          const root = document.documentElement;
          root.style.setProperty('--site-effect-color', '#00F0FF');
          root.style.setProperty('--site-effect-secondary', '#FF2D6E');
          root.style.setProperty('--site-effect-tertiary', '#8B5CF6');
          
          // If priority is high, apply immediately
          // Otherwise, use a small timeout to not block rendering
          if (priority) {
            await applyToMainSite();
            setIsApplied(true);
            setIsApplying(false);
          } else {
            // Use ref to track timeout and clean up
            timeoutRef.current = setTimeout(async () => {
              await applyToMainSite();
              setIsApplied(true);
              setIsApplying(false);
            }, 100);
          }
          
          logger.info('Impulsivity theme applied', {
            details: {
              priority,
              success: true,
              themePresent: !!currentTheme,
              loadStatus
            }
          });
        } catch (error) {
          logger.error('Failed to apply Impulsivity theme', { 
            details: { 
              error: error instanceof Error ? error.message : String(error),
              priority,
              themePresent: !!currentTheme,
              loadStatus
            }
          });
          
          // Mark as applied to prevent retries but ensure basic styling
          const root = document.documentElement;
          root.style.setProperty('--site-effect-color', '#00F0FF');
          root.style.setProperty('--site-effect-secondary', '#FF2D6E');
          root.style.setProperty('--site-background', '#080F1E');
          root.style.setProperty('--site-foreground', '#F9FAFB');
          
          setIsApplied(true);
          setIsApplying(false);
        }
      };
      
      applyWithPriority();
    }
    
    // Cleanup timeout to prevent memory leaks
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [autoApply, applyToMainSite, priority, logger, isApplied, isApplying, loadStatus, currentTheme]);
  
  // Show loading state if requested and still applying theme
  if (showLoadingState && isApplying) {
    return <ThemeLoadingState message="Applying Impulsivity Theme..." subMessage="Please wait while we finalize your experience" />;
  }
  
  // Always render children - the theme is applied in the background
  return <>{children}</>;
}
