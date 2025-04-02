
import { useEffect, useState } from 'react';
import { Layout } from '@/admin/types/layout.types';
import { layoutSkeletonService } from '@/admin/services/layoutSkeleton.service';
import { layoutSeederService } from '@/admin/services/layoutSeeder.service';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export function useCoreLayouts() {
  const [topNavLayout, setTopNavLayout] = useState<Layout | null>(null);
  const [footerLayout, setFooterLayout] = useState<Layout | null>(null);
  const [userMenuLayout, setUserMenuLayout] = useState<Layout | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const logger = useLogger('useCoreLayouts', LogCategory.UI);

  // Initialize layouts
  useEffect(() => {
    async function initLayouts() {
      try {
        setIsLoading(true);
        setError(null);

        logger.info('Initializing core layouts');
        
        // Ensure core layouts exist in the database
        await layoutSeederService.ensureCoreLayoutsExist();
        
        logger.info('Core layouts ensured, loading layouts now');

        // Load topnav layout
        const topNavResponse = await layoutSkeletonService.getByTypeAndScope('topnav', 'site');
        logger.info('Loaded topnav layout', { details: { success: !!topNavResponse.data, id: topNavResponse.data?.id } });
        
        if (topNavResponse.data) {
          setTopNavLayout(layoutSkeletonService.convertToLayout(topNavResponse.data));
        } else {
          logger.warn('Topnav layout not found', { details: { error: topNavResponse.error } });
        }

        // Load footer layout
        const footerResponse = await layoutSkeletonService.getByTypeAndScope('footer', 'site');
        logger.info('Loaded footer layout', { details: { success: !!footerResponse.data, id: footerResponse.data?.id } });
        
        if (footerResponse.data) {
          setFooterLayout(layoutSkeletonService.convertToLayout(footerResponse.data));
        } else {
          logger.warn('Footer layout not found', { details: { error: footerResponse.error } });
        }

        // Load usermenu layout
        const userMenuResponse = await layoutSkeletonService.getByTypeAndScope('usermenu', 'site');
        logger.info('Loaded usermenu layout', { details: { success: !!userMenuResponse.data, id: userMenuResponse.data?.id } });
        
        if (userMenuResponse.data) {
          setUserMenuLayout(layoutSkeletonService.convertToLayout(userMenuResponse.data));
        } else {
          logger.warn('User menu layout not found', { details: { error: userMenuResponse.error } });
        }
        
        logger.info('Core layouts loaded successfully', {
          details: {
            hasTopNav: !!topNavResponse.data,
            hasFooter: !!footerResponse.data,
            hasUserMenu: !!userMenuResponse.data
          }
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        logger.error('Error loading core layouts', { details: err });
        setError(err instanceof Error ? err : new Error('Failed to load core layouts'));
        
        // Only show toast for actual errors, not just missing layouts
        toast({
          title: "Layout loading issue",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }

    initLayouts();
  }, [toast, logger]);

  return {
    topNavLayout,
    footerLayout,
    userMenuLayout,
    isLoading,
    error
  };
}
