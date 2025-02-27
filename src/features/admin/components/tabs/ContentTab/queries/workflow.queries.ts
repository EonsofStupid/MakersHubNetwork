
import { useQuery } from '@tanstack/react-query';
import { Workflow } from '../types/content.types';

export const workflowKeys = {
  all: ['workflows'] as const,
  lists: () => [...workflowKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...workflowKeys.lists(), filters] as const,
  details: () => [...workflowKeys.all, 'detail'] as const,
  detail: (id: string) => [...workflowKeys.details(), id] as const,
};

export const useWorkflowList = (filters: Record<string, any>) => {
  return useQuery({
    queryKey: workflowKeys.list(filters),
    queryFn: async (): Promise<Workflow[]> => {
      // TODO: Implement actual API call
      return [];
    },
  });
};
