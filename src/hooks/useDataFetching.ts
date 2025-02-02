import { useQuery } from '@tanstack/react-query';
import { useCacheStore } from '@/lib/store/cache-store';

interface UseDataFetchingOptions {
  key: string[];
  fn: () => Promise<any>;
  staleTime?: number;
  cacheTime?: number;
  enabled?: boolean;
  forceRefresh?: boolean;
}

export const useDataFetching = ({
  key,
  fn,
  staleTime = 5 * 60 * 1000, // 5 minutes
  cacheTime = 30 * 60 * 1000, // 30 minutes
  enabled = true,
  forceRefresh = false
}: UseDataFetchingOptions) => {
  const { getCache, setCache } = useCacheStore();
  const cacheKey = key.join('-');

  return useQuery({
    queryKey: key,
    queryFn: async () => {
      console.log(`Fetching data for ${cacheKey}`);
      
      if (!forceRefresh) {
        const cachedData = getCache(cacheKey);
        if (cachedData) {
          console.log(`Returning cached data for ${cacheKey}`);
          return cachedData;
        }
      }

      const data = await fn();
      console.log(`Caching fresh data for ${cacheKey}`);
      setCache(cacheKey, data, staleTime);
      return data;
    },
    staleTime,
    gcTime: cacheTime,
    enabled,
    retry: (failureCount, error) => {
      console.log(`Retry attempt ${failureCount} for ${cacheKey}:`, error);
      return failureCount < 3;
    },
    meta: {
      errorMessage: `Failed to fetch data for ${key.join('/')}`,
    }
  });
};