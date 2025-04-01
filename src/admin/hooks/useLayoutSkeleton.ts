
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LayoutSkeletonService } from '@/admin/services/layoutSkeleton.service';
import { Layout, LayoutSkeleton } from '@/admin/types/layout.types';
import { toast } from 'sonner';

/**
 * Hook for fetching and managing layout skeletons from the database
 */
export function useLayoutSkeleton() {
  const queryClient = useQueryClient();

  /**
   * Load a specific layout by ID
   */
  const useLayoutById = (id?: string) => {
    return useQuery({
      queryKey: ['layout', id],
      queryFn: async () => {
        if (!id) return null;
        const skeleton = await LayoutSkeletonService.getById(id);
        if (!skeleton) return null;
        return LayoutSkeletonService.convertToLayout(skeleton);
      },
      enabled: !!id,
    });
  };

  /**
   * Load active layout by type and scope
   */
  const useActiveLayout = (type: string, scope: string) => {
    return useQuery({
      queryKey: ['layout', type, scope, 'active'],
      queryFn: async () => {
        const skeleton = await LayoutSkeletonService.getActiveLayout(type, scope);
        if (!skeleton) return null;
        return LayoutSkeletonService.convertToLayout(skeleton);
      },
    });
  };

  /**
   * Save a layout mutation
   */
  const useSaveLayout = () => {
    return useMutation({
      mutationFn: async (layout: Partial<LayoutSkeleton>) => {
        return await LayoutSkeletonService.saveLayout(layout);
      },
      onSuccess: (data, variables) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['layout'] });
        
        if (data.success) {
          toast.success('Layout saved successfully');
        } else {
          toast.error('Failed to save layout', { description: data.error });
        }
      },
      onError: (error: any) => {
        toast.error('Error saving layout', { description: error.message });
      }
    });
  };

  /**
   * Delete a layout mutation
   */
  const useDeleteLayout = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        return await LayoutSkeletonService.deleteLayout(id);
      },
      onSuccess: (data, variables) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['layout'] });
        
        if (data.success) {
          toast.success('Layout deleted successfully');
        } else {
          toast.error('Failed to delete layout', { description: data.error });
        }
      },
      onError: (error: any) => {
        toast.error('Error deleting layout', { description: error.message });
      }
    });
  };

  return {
    useLayoutById,
    useActiveLayout,
    useSaveLayout,
    useDeleteLayout,
  };
}
