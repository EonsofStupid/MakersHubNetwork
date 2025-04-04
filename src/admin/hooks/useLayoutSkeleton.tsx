
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LayoutSkeleton, Layout, layoutToJson, CreateLayoutResponse } from '@/admin/types/layout.types';
import { layoutSkeletonService } from '@/admin/services/layoutSkeleton.service';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';

/**
 * Hook for working with layout skeletons
 */
export function useLayoutSkeleton() {
  const queryClient = useQueryClient();
  const logger = useLogger('useLayoutSkeleton', { category: LogCategory.ADMIN });

  // Query to fetch a layout by ID
  const useLayoutById = (id: string | null) => {
    return useQuery({
      queryKey: ['layout', id],
      queryFn: async () => {
        if (!id) return null;
        const result = await layoutSkeletonService.getById(id);
        if (!result.data) {
          const errorMsg = result.error || 'Failed to fetch layout';
          logger.error('Error fetching layout', { details: { id, error: errorMsg } });
          throw new Error(errorMsg);
        }
        return result.data;
      },
      enabled: !!id
    });
  };

  // Query to fetch all layouts with optional filtering
  const useLayouts = (options?: {
    type?: string;
    scope?: string;
    isActive?: boolean;
  }) => {
    return useQuery({
      queryKey: ['layouts', options],
      queryFn: async () => {
        const result = await layoutSkeletonService.getAll(options);
        if (!result.data) {
          const errorMsg = result.error || 'Failed to fetch layouts';
          logger.error('Error fetching layouts', { details: { options, error: errorMsg } });
          throw new Error(errorMsg);
        }
        return result.data || [];
      }
    });
  };

  // Query to fetch a layout by type and scope
  const useLayoutByTypeAndScope = (type: string, scope: string) => {
    return useQuery({
      queryKey: ['layout', type, scope],
      queryFn: async () => {
        const result = await layoutSkeletonService.getByTypeAndScope(type, scope);
        if (!result.data) {
          const errorMsg = result.error || 'Failed to fetch layout by type and scope';
          logger.error('Error fetching layout by type and scope', { 
            details: { type, scope, error: errorMsg } 
          });
          throw new Error(errorMsg);
        }
        return result.data;
      }
    });
  };

  // Mutation to save a layout
  const useSaveLayout = () => {
    return useMutation({
      mutationFn: async (layout: Partial<LayoutSkeleton>) => {
        const result = await layoutSkeletonService.saveLayout(layout);
        if (!result.success) {
          throw new Error(result.error || 'Failed to save layout');
        }
        return result;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['layouts'] });
        if (data.id) {
          queryClient.invalidateQueries({ queryKey: ['layout', data.id] });
        }
      },
      onError: (error: Error) => {
        logger.error('Error saving layout', { details: { error: error.message } });
      }
    });
  };

  // Mutation to delete a layout
  const useDeleteLayout = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const result = await layoutSkeletonService.deleteLayout(id);
        if (!result.success) {
          throw new Error(result.error || 'Failed to delete layout');
        }
        return result;
      },
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['layouts'] });
        queryClient.invalidateQueries({ queryKey: ['layout', id] });
      },
      onError: (error: Error) => {
        logger.error('Error deleting layout', { details: { error: error.message } });
      }
    });
  };

  return {
    useLayoutById,
    useLayouts,
    useLayoutByTypeAndScope,
    useSaveLayout,
    useDeleteLayout,
    convertToLayout: layoutSkeletonService.convertToLayout
  };
}
