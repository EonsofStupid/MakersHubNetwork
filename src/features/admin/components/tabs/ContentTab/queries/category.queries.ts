
import { useQuery } from '@tanstack/react-query';
import { CategoryData } from '../types/content.types';

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

export const useCategoryList = (filters: Record<string, any>) => {
  return useQuery({
    queryKey: categoryKeys.list(filters),
    queryFn: async (): Promise<CategoryData[]> => {
      // TODO: Implement actual API call
      return [];
    },
  });
};
