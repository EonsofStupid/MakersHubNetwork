
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { layoutSkeletonService } from '@/admin/services/layoutSkeleton.service';
import { Layout, LayoutSkeleton } from '@/shared/types';
import { toast } from 'sonner';

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
        let defaultLayout: Layout;
        
        if (type === 'dashboard') {
          defaultLayout = createDefaultDashboardLayout();
        } else if (type === 'sidebar') {
          defaultLayout = createDefaultSidebarLayout();
        } else if (type === 'topnav') {
          defaultLayout = createDefaultTopNavLayout();
        } else {
          defaultLayout = {
            id: `default-${type}-${Date.now()}`,
            name: `Default ${type}`,
            components: {
              root: {
                id: 'root',
                type: 'AdminSection',
                props: {}
              },
              title: {
                id: 'title',
                type: 'heading',
                props: {
                  level: 1,
                  className: 'text-2xl font-bold',
                  children: `${type} Layout`
                }
              }
            },
            layout: [
              {
                id: 'root-layout',
                position: 0,
                componentId: 'root'
              },
              {
                id: 'title-layout',
                position: 1,
                componentId: 'title',
                parentId: 'root-layout'
              }
            ],
            type,
            scope
          };
        }
        
        // Save to database
        return await layoutSkeletonService.create({
          name: defaultLayout.name,
          type: defaultLayout.type || type,
          scope: defaultLayout.scope || scope,
          layout_json: {
            components: defaultLayout.components,
            layout: defaultLayout.layout,
            version: 1
          },
          is_active: true,
          is_locked: false,
          version: 1,
          description: `Default ${type} layout`
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

  // Helper functions to create default layouts
  const createDefaultDashboardLayout = (): Layout => {
    return {
      id: `dashboard-${Date.now()}`,
      name: 'Default Dashboard',
      components: {
        root: { id: 'root', type: 'DashboardLayout', props: {} },
        header: { id: 'header', type: 'DashboardHeader', props: { title: 'Dashboard' } }
      },
      layout: [
        { id: 'root-layout', position: 0, componentId: 'root' },
        { id: 'header-layout', position: 0, componentId: 'header', parentId: 'root-layout' }
      ],
      type: 'dashboard',
      scope: 'admin'
    };
  };

  const createDefaultSidebarLayout = (): Layout => {
    return {
      id: `sidebar-${Date.now()}`,
      name: 'Default Sidebar',
      components: {
        root: { id: 'root', type: 'SidebarLayout', props: {} },
        nav: { id: 'nav', type: 'SidebarNav', props: {} }
      },
      layout: [
        { id: 'root-layout', position: 0, componentId: 'root' },
        { id: 'nav-layout', position: 0, componentId: 'nav', parentId: 'root-layout' }
      ],
      type: 'sidebar',
      scope: 'admin'
    };
  };

  const createDefaultTopNavLayout = (): Layout => {
    return {
      id: `topnav-${Date.now()}`,
      name: 'Default Top Navigation',
      components: {
        root: { id: 'root', type: 'TopNavLayout', props: {} },
        nav: { id: 'nav', type: 'TopNav', props: {} }
      },
      layout: [
        { id: 'root-layout', position: 0, componentId: 'root' },
        { id: 'nav-layout', position: 0, componentId: 'nav', parentId: 'root-layout' }
      ],
      type: 'topnav',
      scope: 'admin'
    };
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
