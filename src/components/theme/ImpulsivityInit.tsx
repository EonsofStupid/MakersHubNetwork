
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
  
  // Apply the theme if autoApply is true
  useEffect(() => {
    // Skip if we've already applied or attempted to apply the theme
    if ((autoApply && !isApplied && !applyAttempted.current) || 
        (autoApply && !isApplied && loadStatus === 'loaded' && !applyAttempted.current)) {
      
      applyAttempted.current = true;
      setIsApplying(true);
      
      const applyWithPriority = async () => {
        try {
          // If priority is high, apply immediately
          // Otherwise, use a timeout to not block rendering
          if (priority) {
            await applyToMainSite();
            setIsApplied(true);
          } else {
            setTimeout(async () => {
              await applyToMainSite();
              setIsApplied(true);
              setIsApplying(false);
            }, 100);
          }
          
          logger.info('Impulsivity theme auto-applied', {
            details: {
              priority,
              success: true,
              themePresent: !!currentTheme,
              loadStatus
            }
          });
        } catch (error) {
          logger.error('Failed to auto-apply Impulsivity theme', { 
            details: { 
              error: error instanceof Error ? error.message : String(error),
              priority,
              themePresent: !!currentTheme,
              loadStatus
            }
          });
          
          // Mark as applied to prevent retries
          setIsApplied(true);
          setIsApplying(false);
        }
      };
      
      applyWithPriority();
    }
  }, [autoApply, applyToMainSite, priority, logger, isApplied, loadStatus, currentTheme]);
  
  // Force apply the theme after a delay if it's still not applied
  useEffect(() => {
    if (autoApply && !isApplied && loadStatus === 'loaded') {
      const timer = setTimeout(async () => {
        if (!isApplied) {
          setIsApplying(true);
          try {
            await applyToMainSite();
            setIsApplied(true);
            logger.info('Forced Impulsivity theme application after delay');
          } catch (error) {
            logger.error('Failed to force-apply Impulsivity theme', { 
              details: { error: error instanceof Error ? error.message : String(error) }
            });
            setIsApplied(true); // Mark as applied anyway to prevent retries
          } finally {
            setIsApplying(false);
          }
        }
      }, 1000); // Wait 1 second before forcing theme application
      
      return () => clearTimeout(timer);
    }
  }, [autoApply, isApplied, loadStatus, applyToMainSite, logger]);
  
  // Show loading state if requested and still applying theme
  if (showLoadingState && isApplying) {
    return <ThemeLoadingState message="Applying Impulsivity Theme..." subMessage="Please wait while we finalize your experience" />;
  }
  
  // Always render children - the theme is applied in the background
  return <>{children}</>;
}
