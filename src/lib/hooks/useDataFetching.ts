import { useQuery } from '@tanstack/react-query';
import { useCacheStore } from '@/lib/store/cache-store';

interface UseDataFetchingOptions {
  key: string[];
  fn: () => Promise<any>;
  staleTime?: number;
  cacheTime?: number;
  enabled?: boolean;
}

export const useDataFetching = ({
  key,
  fn,
  staleTime = 5 * 60 * 1000, // 5 minutes
  cacheTime = 30 * 60 * 1000, // 30 minutes
  enabled = true
}: UseDataFetchingOptions) => {
  const { getCache, setCache } = useCacheStore();
  const cacheKey = key.join('-');

  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const data = await fn();
      setCache(cacheKey, data);
      return data;
    },
    staleTime,
    gcTime: cacheTime,
    enabled
  });
};