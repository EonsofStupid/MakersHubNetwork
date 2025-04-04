
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LayoutSkeleton } from '@/admin/types/layout.types';
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
        const { data, error } = await layoutSkeletonService.getById(id);
        if (error) {
          logger.error('Error fetching layout', { details: { id, error } });
          throw error;
        }
        return data;
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
        const { data, error } = await layoutSkeletonService.getAll(options);
        if (error) {
          logger.error('Error fetching layouts', { details: { options, error } });
          throw error;
        }
        return data || [];
      }
    });
  };

  // Query to fetch a layout by type and scope
  const useLayoutByTypeAndScope = (type: string, scope: string) => {
    return useQuery({
      queryKey: ['layout', type, scope],
      queryFn: async () => {
        const { data, error } = await layoutSkeletonService.getByTypeAndScope(type, scope);
        if (error) {
          logger.error('Error fetching layout by type and scope', { 
            details: { type, scope, error } 
          });
          throw error;
        }
        return data;
      }
    });
  };

  // Mutation to save a layout
  const useSaveLayout = () => {
    return useMutation({
      mutationFn: async (layout: Partial<LayoutSkeleton>) => {
        const result = await layoutSkeletonService.saveLayout(layout);
        return result;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['layouts'] });
        if (data.id) {
          queryClient.invalidateQueries({ queryKey: ['layout', data.id] });
        }
      },
      onError: (error) => {
        logger.error('Error saving layout', { details: { error } });
      }
    });
  };

  // Mutation to delete a layout
  const useDeleteLayout = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const result = await layoutSkeletonService.deleteLayout(id);
        return result;
      },
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['layouts'] });
        queryClient.invalidateQueries({ queryKey: ['layout', id] });
      },
      onError: (error) => {
        logger.error('Error deleting layout', { details: { error } });
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
