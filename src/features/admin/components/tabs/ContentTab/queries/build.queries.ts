
import { useQuery } from '@tanstack/react-query';
import { BuildSubmission } from '../types/content.types';

export const buildKeys = {
  all: ['builds'] as const,
  lists: () => [...buildKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...buildKeys.lists(), filters] as const,
  details: () => [...buildKeys.all, 'detail'] as const,
  detail: (id: string) => [...buildKeys.details(), id] as const,
};

export const useBuildList = (filters: Record<string, any>) => {
  return useQuery({
    queryKey: buildKeys.list(filters),
    queryFn: async (): Promise<BuildSubmission[]> => {
      // TODO: Implement actual API call
      return [];
    },
  });
};
