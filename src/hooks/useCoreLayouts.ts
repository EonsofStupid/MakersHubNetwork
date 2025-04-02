
import { useEffect, useState } from 'react';
import { Layout } from '@/admin/types/layout.types';
import { layoutSkeletonService } from '@/admin/services/layoutSkeleton.service';
import { layoutSeederService } from '@/admin/services/layoutSeeder.service';
import { useToast } from '@/hooks/use-toast';

export function useCoreLayouts() {
  const [topNavLayout, setTopNavLayout] = useState<Layout | null>(null);
  const [footerLayout, setFooterLayout] = useState<Layout | null>(null);
  const [userMenuLayout, setUserMenuLayout] = useState<Layout | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Initialize layouts
  useEffect(() => {
    async function initLayouts() {
      try {
        setIsLoading(true);
        setError(null);

        // Ensure core layouts exist in the database
        await layoutSeederService.ensureCoreLayoutsExist();

        // Load topnav layout
        const topNavResponse = await layoutSkeletonService.getByTypeAndScope('topnav', 'main');
        if (topNavResponse.data) {
          setTopNavLayout(layoutSkeletonService.convertToLayout(topNavResponse.data));
        }

        // Load footer layout
        const footerResponse = await layoutSkeletonService.getByTypeAndScope('footer', 'main');
        if (footerResponse.data) {
          setFooterLayout(layoutSkeletonService.convertToLayout(footerResponse.data));
        }

        // Load usermenu layout
        const userMenuResponse = await layoutSkeletonService.getByTypeAndScope('usermenu', 'main');
        if (userMenuResponse.data) {
          setUserMenuLayout(layoutSkeletonService.convertToLayout(userMenuResponse.data));
        }
      } catch (err) {
        console.error('Error loading core layouts:', err);
        setError(err instanceof Error ? err : new Error('Failed to load core layouts'));
        toast({
          title: "Error loading layouts",
          description: "There was a problem loading the application layouts.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }

    initLayouts();
  }, [toast]);

  return {
    topNavLayout,
    footerLayout,
    userMenuLayout,
    isLoading,
    error
  };
}
