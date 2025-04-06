
import { useEffect, useState } from 'react';
import { useImpulsivityTheme } from '@/hooks/useImpulsivityTheme';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

interface ImpulsivityInitProps {
  children: React.ReactNode;
  priority?: boolean;
  autoApply?: boolean;
}

export function ImpulsivityInit({ 
  children, 
  priority = false, 
  autoApply = false 
}: ImpulsivityInitProps) {
  const { applyToMainSite } = useImpulsivityTheme();
  const logger = useLogger('ImpulsivityInit', LogCategory.UI);
  const [isApplied, setIsApplied] = useState(false);
  
  // Apply the theme if autoApply is true
  useEffect(() => {
    if (autoApply && !isApplied) {
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
            }, 100);
          }
          
          logger.info('Impulsivity theme auto-applied', {
            details: {
              priority,
              success: true
            }
          });
        } catch (error) {
          logger.error('Failed to auto-apply Impulsivity theme', { 
            details: { 
              error: error instanceof Error ? error.message : String(error),
              priority
            }
          });
          
          // Mark as applied to prevent retries
          setIsApplied(true);
        }
      };
      
      applyWithPriority();
    }
  }, [autoApply, applyToMainSite, priority, logger, isApplied]);
  
  // Always render children - the theme is applied in the background
  return <>{children}</>;
}
