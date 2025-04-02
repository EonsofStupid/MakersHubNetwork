
import { useEffect, useState } from 'react';
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
        
        // Set a timeout to prevent waiting too long for layouts
        timeoutId = setTimeout(() => {
          if (isMounted) {
            logger.warn('Layout loading timed out, continuing with fallbacks');
            setIsLoading(false);
          }
        }, 2000);
        
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

        // Try to load the topnav layout
        try {
          const topNavResponse = await layoutSkeletonService.getByTypeAndScope('topnav', 'site');
          if (topNavResponse.data && isMounted) {
            setTopNavLayout(layoutSkeletonService.convertToLayout(topNavResponse.data));
            logger.info('Loaded topnav layout', {
              details: { id: topNavResponse.data.id }
            });
          }
        } catch (topNavError) {
          logger.warn('Error loading topnav layout', {
            details: safeDetails(topNavError)
          });
          // Continue with next layout
        }

        // Try to load the footer layout
        try {
          const footerResponse = await layoutSkeletonService.getByTypeAndScope('footer', 'site');
          if (footerResponse.data && isMounted) {
            setFooterLayout(layoutSkeletonService.convertToLayout(footerResponse.data));
            logger.info('Loaded footer layout', {
              details: { id: footerResponse.data.id }
            });
          }
        } catch (footerError) {
          logger.warn('Error loading footer layout', {
            details: safeDetails(footerError)
          });
          // Continue with next layout
        }

        // Try to load the user menu layout
        try {
          const userMenuResponse = await layoutSkeletonService.getByTypeAndScope('usermenu', 'site');
          if (userMenuResponse.data && isMounted) {
            setUserMenuLayout(layoutSkeletonService.convertToLayout(userMenuResponse.data));
            logger.info('Loaded usermenu layout', {
              details: { id: userMenuResponse.data.id }
            });
          }
        } catch (userMenuError) {
          logger.warn('Error loading usermenu layout', {
            details: safeDetails(userMenuError)
          });
        }
        
        // Clear the timeout since we're done (whether successful or not)
        clearTimeout(timeoutId);
        
        if (isMounted) {
          setIsLoading(false);
          logger.info('Core layout loading complete', {
            details: {
              hasTopNav: !!topNavLayout,
              hasFooter: !!footerLayout,
              hasUserMenu: !!userMenuLayout
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
  }, [toast, logger]);

  return {
    topNavLayout,
    footerLayout,
    userMenuLayout,
    isLoading,
    error
  };
}
