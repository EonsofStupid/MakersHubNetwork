import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { layoutSkeletonService } from '@/admin/services/layoutSkeleton.service';
import { Layout, LayoutSkeleton } from '@/admin/types/layout.types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook for fetching and managing layout skeletons from the database
 */
export function useLayoutSkeleton() {
  const queryClient = useQueryClient();

  /**
   * Get all layouts
   */
  const useAllLayouts = () => {
    return useQuery({
      queryKey: ['layouts', 'all'],
      queryFn: async () => {
        return await layoutSkeletonService.getAll();
      },
    });
  };

  /**
   * Load a specific layout by ID
   */
  const useLayoutById = (id?: string) => {
    return useQuery({
      queryKey: ['layout', id],
      queryFn: async () => {
        if (!id) return null;
        const skeleton = await layoutSkeletonService.getById(id);
        if (!skeleton?.data) return null;
        return skeleton.data;
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
        const response = await layoutSkeletonService.getByTypeAndScope(type, scope);
        if (!response?.data) return null;
        return response.data;
      },
    });
  };

  /**
   * Create a default layout if none exists
   */
  const useCreateDefaultLayout = () => {
    return useMutation({
      mutationFn: async ({ type, scope }: { type: string, scope: string }) => {
        // Check if a layout already exists
        const existingLayout = await layoutSkeletonService.getByTypeAndScope(type, scope);
        if (existingLayout?.data) return { success: false, error: 'Layout already exists' };
        
        // Create a default layout based on type
        const now = new Date().toISOString();
        let defaultLayout: Layout = {
          id: uuidv4(),
          name: `Default ${type}`,
          type,
          scope,
          components: [],
          version: 1,
          created_at: now,
          updated_at: now,
          is_active: true,
          is_locked: false
        };
        
        if (type === 'dashboard') {
          defaultLayout.components = [
            {
              id: 'root',
              type: 'AdminSection',
              children: [
                {
                  id: 'title',
                  type: 'heading',
                  props: {
                    level: 1,
                    className: 'text-2xl font-bold',
                    children: 'Dashboard'
                  }
                }
              ]
            }
          ];
        } else if (type === 'sidebar') {
          defaultLayout.components = [
            {
              id: 'root',
              type: 'AdminSidebar',
              children: [
                {
                  id: 'title',
                  type: 'heading',
                  props: {
                    level: 2,
                    className: 'text-xl font-bold',
                    children: 'Admin'
                  }
                }
              ]
            }
          ];
        } else if (type === 'topnav') {
          defaultLayout.components = [
            {
              id: 'root',
              type: 'AdminTopNav',
              children: [
                {
                  id: 'title',
                  type: 'heading',
                  props: {
                    level: 2,
                    className: 'text-xl font-bold',
                    children: 'MakersImpulse'
                  }
                }
              ]
            }
          ];
        }
        
        // Save to database
        return await layoutSkeletonService.create({
          name: defaultLayout.name,
          type: defaultLayout.type,
          scope: defaultLayout.scope,
          layout_json: {
            components: defaultLayout.components,
            version: 1
          },
          is_active: true,
          is_locked: false,
          version: 1
        });
      },
      onSuccess: (data, variables) => {
        if (data.success) {
          queryClient.invalidateQueries({ queryKey: ['layout', variables.type, variables.scope] });
          toast.success('Default layout created successfully');
        } else if (data.error !== 'Layout already exists') {
          toast.error('Failed to create default layout', { description: data.error });
        }
      },
      onError: (error: any) => {
        toast.error('Error creating default layout', { description: error.message });
      }
    });
  };

  /**
   * Save a layout mutation
   */
  const useSaveLayout = () => {
    return useMutation({
      mutationFn: async (layout: Partial<LayoutSkeleton>) => {
        if (layout.id) {
          return await layoutSkeletonService.update(layout.id, layout);
        } else {
          return await layoutSkeletonService.create(layout);
        }
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
        return await layoutSkeletonService.delete(id);
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
    useAllLayouts,
    useLayoutById,
    useActiveLayout,
    useCreateDefaultLayout,
    useSaveLayout,
    useDeleteLayout
  };
}
