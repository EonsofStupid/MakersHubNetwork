
import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { layoutSkeletonService } from '@/admin/services/layoutSkeleton.service';
import { Layout, LayoutSkeleton, layoutToJson } from '@/admin/types/layout.types';
import { toast } from 'sonner';

interface UseLayoutSkeletonResult {
  useGetLayout: (id: string) => {
    data: Layout | null;
    isLoading: boolean;
    error: Error | null;
  };
  useGetLayoutByTypeAndScope: (type: string, scope: string) => {
    data: Layout | null;
    isLoading: boolean;
    error: Error | null;
  };
  useGetAllLayouts: (options?: {
    type?: string;
    scope?: string;
    isActive?: boolean;
  }) => {
    data: LayoutSkeleton[] | null;
    isLoading: boolean;
    error: Error | null;
  };
  useCreateLayout: () => {
    mutate: (layout: Partial<LayoutSkeleton>, options?: {
      onSuccess?: (data: any) => void;
      onError?: (error: any) => void;
    }) => void;
    isPending: boolean;
  };
  useUpdateLayout: () => {
    mutate: (layout: Partial<LayoutSkeleton>, options?: {
      onSuccess?: (data: any) => void;
      onError?: (error: any) => void;
    }) => void;
    isPending: boolean;
  };
  useDeleteLayout: () => {
    mutate: (id: string, options?: {
      onSuccess?: (data: any) => void;
      onError?: (error: any) => void;
    }) => void;
    isPending: boolean;
  };
  useSaveLayout: () => {
    mutate: (layout: Partial<LayoutSkeleton>, options?: {
      onSuccess?: (data: any) => void;
      onError?: (error: any) => void;
    }) => void;
    isPending: boolean;
  };
  useDeleteLayoutById: () => {
    mutate: (id: string, options?: {
      onSuccess?: (data: any) => void;
      onError?: (error: any) => void;
    }) => void;
    isPending: boolean;
  };
}

export const useLayoutSkeleton = (): UseLayoutSkeletonResult => {
  const queryClient = useQueryClient();

  // Hook to get a single layout by ID
  const useGetLayout = useCallback((id: string) => {
    const [data, setData] = useState<Layout | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useState(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await layoutSkeletonService.getById(id);
          if (result.data) {
            setData(layoutSkeletonService.convertToLayout(result.data));
            setError(null);
          } else {
            setData(null);
            // Fix error handling
            const errorMessage = typeof result.error === 'string' ? result.error : 'Failed to fetch layout';
            setError(new Error(errorMessage));
          }
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to fetch layout'));
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    });

    return { data, isLoading, error };
  }, []);

  // Hook to get a layout by type and scope
  const useGetLayoutByTypeAndScope = useCallback((type: string, scope: string) => {
    const [data, setData] = useState<Layout | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useState(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await layoutSkeletonService.getByTypeAndScope(type, scope);
          if (result.data) {
            setData(layoutSkeletonService.convertToLayout(result.data));
            setError(null);
          } else {
            setData(null);
            // Fix error handling
            const errorMessage = typeof result.error === 'string' ? result.error : 'Failed to fetch layout';
            setError(new Error(errorMessage));
          }
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to fetch layout'));
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    });

    return { data, isLoading, error };
  }, []);

  // Hook to get all layouts with optional filtering
  const useGetAllLayouts = useCallback((options?: {
    type?: string;
    scope?: string;
    isActive?: boolean;
  }) => {
    const [data, setData] = useState<LayoutSkeleton[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useState(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await layoutSkeletonService.getAll(options);
          if (result.data) {
            setData(result.data);
            setError(null);
          } else {
            setData(null);
            // Fix error handling
            const errorMessage = typeof result.error === 'string' ? result.error : 'Failed to fetch layouts';
            setError(new Error(errorMessage));
          }
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to fetch layouts'));
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    });

    return { data, isLoading, error };
  }, []);

  // Hook to create a new layout
  const useCreateLayout = () => {
    const mutation = useMutation({
      mutationFn: async (layout: Partial<LayoutSkeleton>) => {
        const result = await layoutSkeletonService.create(layout);
        if (!result.success) {
          throw new Error(result.error || 'Failed to create layout');
        }
        return result.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['layouts'] });
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to create layout');
      },
    });

    return {
      mutate: (layout: Partial<LayoutSkeleton>, options?: { onSuccess?: (data: any) => void, onError?: (error: any) => void }) => {
        mutation.mutate(layout, {
          onSuccess: (data) => {
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            options?.onError?.(error);
          },
        });
      },
      isPending: mutation.isPending,
    };
  };

  // Hook to update an existing layout
  const useUpdateLayout = () => {
    const mutation = useMutation({
      mutationFn: async (layout: Partial<LayoutSkeleton>) => {
        if (!layout.id) {
          throw new Error('Layout ID is required for updating');
        }
        const result = await layoutSkeletonService.update(layout.id, layout);
        if (!result.success) {
          throw new Error(result.error || 'Failed to update layout');
        }
        return result.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['layouts'] });
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to update layout');
      },
    });

    return {
      mutate: (layout: Partial<LayoutSkeleton>, options?: { onSuccess?: (data: any) => void, onError?: (error: any) => void }) => {
        mutation.mutate(layout, {
          onSuccess: (data) => {
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            options?.onError?.(error);
          },
        });
      },
      isPending: mutation.isPending,
    };
  };

  // Hook to delete a layout
  const useDeleteLayout = () => {
    const mutation = useMutation({
      mutationFn: async (id: string) => {
        const result = await layoutSkeletonService.delete(id);
        if (!result.success) {
          throw new Error(result.error || 'Failed to delete layout');
        }
        return result.success;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['layouts'] });
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to delete layout');
      },
    });

    return {
      mutate: (id: string, options?: { onSuccess?: (data: any) => void, onError?: (error: any) => void }) => {
        mutation.mutate(id, {
          onSuccess: (data) => {
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            options?.onError?.(error);
          },
        });
      },
      isPending: mutation.isPending,
    };
  };

  // Hook to save a layout (create or update)
  const useSaveLayout = () => {
    const mutation = useMutation({
      mutationFn: async (layout: Partial<LayoutSkeleton>) => {
        const result = await layoutSkeletonService.saveLayout(layout);
        if (!result.success) {
          throw new Error(result.error || 'Failed to save layout');
        }
        return result;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['layouts'] });
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to save layout');
      },
    });

    return {
      mutate: (layout: Partial<LayoutSkeleton>, options?: { onSuccess?: (data: any) => void, onError?: (error: any) => void }) => {
        mutation.mutate(layout, {
          onSuccess: (data) => {
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            options?.onError?.(error);
          },
        });
      },
      isPending: mutation.isPending,
    };
  };

  // Hook to delete a layout by ID
  const useDeleteLayoutById = () => {
    const mutation = useMutation({
      mutationFn: async (id: string) => {
        const result = await layoutSkeletonService.delete(id);
        if (!result.success) {
          throw new Error(result.error || 'Failed to delete layout');
        }
        return result.success;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['layouts'] });
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to delete layout');
      },
    });

    return {
      mutate: (id: string, options?: { onSuccess?: (data: any) => void, onError?: (error: any) => void }) => {
        mutation.mutate(id, {
          onSuccess: (data) => {
            options?.onSuccess?.(data);
          },
          onError: (error) => {
            options?.onError?.(error);
          },
        });
      },
      isPending: mutation.isPending,
    };
  };

  return {
    useGetLayout,
    useGetLayoutByTypeAndScope,
    useGetAllLayouts,
    useCreateLayout,
    useUpdateLayout,
    useDeleteLayout,
    useSaveLayout,
    useDeleteLayoutById
  };
};
