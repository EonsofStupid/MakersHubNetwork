import { useState, useEffect } from 'react';
import { useToast } from '@/shared/hooks/use-toast';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface LayoutSkeleton {
  id: string;
  name: string;
  description?: string;
  json_data: string;
  created_at: string;
  updated_at: string;
}

const fetchLayoutData = async (layoutId: string): Promise<ServiceResponse<any>> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockData = {
      id: layoutId,
      name: `Sample Layout ${layoutId}`,
      description: 'A sample layout for testing purposes',
      json_data: JSON.stringify({
        components: [
          { type: 'Header', content: 'Welcome to the Layout!' },
          { type: 'Paragraph', content: 'This is a sample paragraph.' }
        ]
      }),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return { success: true, data: mockData };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      data: undefined // Add data property with undefined value
    };
  }
};

export const useLayoutSkeleton = (layoutId: string) => {
  const [layout, setLayout] = useState<LayoutSkeleton | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const logger = useLogger('useLayoutSkeleton', LogCategory.UI);

  useEffect(() => {
    const loadLayout = async () => {
      setIsLoading(true);
      setError(null);

      const response = await fetchLayoutData(layoutId);

      if (response.success && response.data) {
        setLayout(response.data);
        logger.info(`Layout ${layoutId} loaded successfully`);
      } else {
        setError(response.error || 'Failed to load layout');
        logger.error(`Failed to load layout ${layoutId}: ${response.error}`);
        toast({
          title: 'Error loading layout',
          description: response.error || 'Failed to load layout',
          variant: 'destructive',
        });
      }

      setIsLoading(false);
    };

    if (layoutId) {
      loadLayout();
    } else {
      logger.warn('No layout ID provided');
    }
  }, [layoutId, toast, logger]);

  return { layout, isLoading, error };
};
