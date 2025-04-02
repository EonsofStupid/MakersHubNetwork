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
    
    async function initLayouts() {
      try {
        if (isMounted) {
          setIsLoading(true);
          setError(null);
        }

        logger.info('Initializing core layouts');
        
        await layoutSeederService.ensureCoreLayoutsExist();
        
        logger.info('Core layouts ensured, loading layouts now');

        const topNavResponse = await layoutSkeletonService.getByTypeAndScope('topnav', 'site');
        logger.info('Loaded topnav layout', { details: { success: !!topNavResponse.data, id: topNavResponse.data?.id } });
        
        if (topNavResponse.data && isMounted) {
          setTopNavLayout(layoutSkeletonService.convertToLayout(topNavResponse.data));
        } else {
          logger.warn('Topnav layout not found', { details: { error: topNavResponse.error } });
        }

        const footerResponse = await layoutSkeletonService.getByTypeAndScope('footer', 'site');
        logger.info('Loaded footer layout', { details: { success: !!footerResponse.data, id: footerResponse.data?.id } });
        
        if (footerResponse.data && isMounted) {
          setFooterLayout(layoutSkeletonService.convertToLayout(footerResponse.data));
        } else {
          logger.warn('Footer layout not found', { details: { error: footerResponse.error } });
        }

        const userMenuResponse = await layoutSkeletonService.getByTypeAndScope('usermenu', 'site');
        logger.info('Loaded usermenu layout', { details: { success: !!userMenuResponse.data, id: userMenuResponse.data?.id } });
        
        if (userMenuResponse.data && isMounted) {
          setUserMenuLayout(layoutSkeletonService.convertToLayout(userMenuResponse.data));
        } else {
          logger.warn('User menu layout not found', { details: { error: userMenuResponse.error } });
        }
        
        if (isMounted) {
          logger.info('Core layouts loaded successfully', {
            details: {
              hasTopNav: !!topNavResponse.data,
              hasFooter: !!footerResponse.data,
              hasUserMenu: !!userMenuResponse.data
            }
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        logger.error('Error loading core layouts', { details: safeDetails(err) });
        
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load core layouts'));
          
          toast({
            title: "Layout loading issue",
            description: errorMessage,
            variant: "destructive"
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initLayouts();
    
    return () => {
      isMounted = false;
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
