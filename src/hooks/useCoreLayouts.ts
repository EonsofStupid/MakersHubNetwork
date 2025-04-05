
import { useEffect, useState, useCallback } from 'react';
import { Layout } from '@/admin/types/layout.types';
import { layoutSkeletonService } from '@/admin/services/layoutSkeleton.service';
import { layoutSeederService } from '@/admin/services/layoutSeeder.service';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { safeDetails } from '@/logging/utils/safeDetails';

export function useCoreLayouts() {
  const [topNavLayout, setTopNavLayout] = useState<Layout | null>(null);
  const [footerLayout, setFooterLayout] = useState<Layout | null>(null);
  const [userMenuLayout, setUserMenuLayout] = useState<Layout | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const logger = useLogger('useCoreLayouts', LogCategory.UI);

  // Utility function to safely load a layout
  const loadLayout = useCallback(async (type: string, scope: string, setter: (layout: Layout | null) => void) => {
    try {
      const response = await layoutSkeletonService.getByTypeAndScope(type, scope);
      if (response.data) {
        const convertedLayout = layoutSkeletonService.convertToLayout(response.data);
        setter(convertedLayout);
        logger.debug(`Loaded ${type} layout`, { details: { id: response.data.id } });
        return true;
      }
    } catch (err) {
      logger.warn(`Error loading ${type} layout`, { details: safeDetails(err) });
    }
    return false;
  }, [logger]);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    async function initLayouts() {
      try {
        if (isMounted) {
          setIsLoading(true);
          setError(null);
        }

        logger.info('Initializing core layouts');
        
        // Set a shorter timeout to prevent waiting too long for layouts
        timeoutId = setTimeout(() => {
          if (isMounted) {
            logger.warn('Layout loading timed out, continuing with fallbacks');
            setIsLoading(false);
          }
        }, 1000); // Faster timeout for better UX
        
        // Try to ensure core layouts exist without breaking the app if it fails
        try {
          await layoutSeederService.ensureCoreLayoutsExist();
          logger.info('Core layouts ensured');
        } catch (ensureError) {
          logger.warn('Error ensuring core layouts exist, will try to load existing layouts', {
            details: safeDetails(ensureError)
          });
          // Continue despite the error
        }

        // Try to load each layout
        const topNavSuccess = await loadLayout('topnav', 'site', setTopNavLayout);
        const footerSuccess = await loadLayout('footer', 'site', setFooterLayout);
        const userMenuSuccess = await loadLayout('usermenu', 'site', setUserMenuLayout);
        
        // Clear the timeout since we're done (whether successful or not)
        clearTimeout(timeoutId);
        
        if (isMounted) {
          setIsLoading(false);
          logger.info('Core layout loading complete', {
            details: {
              hasTopNav: topNavSuccess,
              hasFooter: footerSuccess,
              hasUserMenu: userMenuSuccess
            }
          });
        }
      } catch (err) {
        clearTimeout(timeoutId);
        logger.error('Unexpected error loading core layouts', { details: safeDetails(err) });
        
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load core layouts'));
          setIsLoading(false);
        }
      }
    }

    initLayouts();
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [loadLayout, logger, toast]);

  return {
    topNavLayout,
    footerLayout,
    userMenuLayout,
    isLoading,
    error
  };
}
