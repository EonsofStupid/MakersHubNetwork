
import { useQuery } from '@tanstack/react-query';

export const contentKeys = {
  all: ['content'] as const,
  lists: () => [...contentKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...contentKeys.lists(), filters] as const,
  details: () => [...contentKeys.all, 'detail'] as const,
  detail: (id: string) => [...contentKeys.details(), id] as const,
};

// Example query hook
export const useContentList = (filters: Record<string, any>) => {
  return useQuery({
    queryKey: contentKeys.list(filters),
    queryFn: async () => {
      // TODO: Implement actual API call
      return [];
    },
  });
};
