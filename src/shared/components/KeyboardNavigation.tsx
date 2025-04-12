
import { useEffect } from 'react';
import { useToast } from '../hooks/use-toast';

interface ScrollConfig {
  scrollAmount?: number;
  smooth?: boolean;
  acceleration?: boolean;
  maxAcceleration?: number;
  accelerationRate?: number;
}

interface KeyboardNavigationProps {
  options?: {
    enabled?: boolean;
    showToasts?: boolean;
    scrollConfig?: ScrollConfig;
  };
}

export const KeyboardNavigation: React.FC<KeyboardNavigationProps> = ({ options = {} }) => {
  const { toast } = useToast();
  const mergedOptions = {
    enabled: options.enabled ?? true,
    showToasts: options.showToasts ?? false,
    scrollConfig: {
      scrollAmount: options.scrollConfig?.scrollAmount ?? 100,
      smooth: options.scrollConfig?.smooth ?? true,
      acceleration: options.scrollConfig?.acceleration ?? true,
      maxAcceleration: options.scrollConfig?.maxAcceleration ?? 500,
      accelerationRate: options.scrollConfig?.accelerationRate ?? 1.1
    }
  };

  useEffect(() => {
    if (!mergedOptions.enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if in input fields
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      let direction: string | null = null;
      
      // Determine the direction based on the key
      if (['ArrowUp', 'w', 'W'].includes(e.key)) {
        direction = 'up';
        window.scrollBy({
          top: -mergedOptions.scrollConfig.scrollAmount,
          behavior: mergedOptions.scrollConfig.smooth ? 'smooth' : 'auto'
        });
      } else if (['ArrowDown', 's', 'S'].includes(e.key)) {
        direction = 'down';
        window.scrollBy({
          top: mergedOptions.scrollConfig.scrollAmount,
          behavior: mergedOptions.scrollConfig.smooth ? 'smooth' : 'auto'
        });
      }
      
      // If it's a navigation key and toasts are enabled, show a toast
      if (direction && mergedOptions.showToasts) {
        toast({
          title: `Scrolling ${direction}`,
          description: "Use W/S or arrow keys to scroll",
          duration: 2000,
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mergedOptions, toast]);
  
  return null;
};
