
import { useQuery } from '@tanstack/react-query';

export const galleryKeys = {
  all: ['gallery'] as const,
  lists: () => [...galleryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...galleryKeys.lists(), filters] as const,
  details: () => [...galleryKeys.all, 'detail'] as const,
  detail: (id: string) => [...galleryKeys.details(), id] as const,
};

export const useMediaList = (filters: Record<string, any>) => {
  return useQuery({
    queryKey: galleryKeys.list(filters),
    queryFn: async () => {
      // TODO: Implement actual API call
      return [];
    },
  });
};
