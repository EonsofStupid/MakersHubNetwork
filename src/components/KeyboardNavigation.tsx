
import { useEffect, useCallback, useRef, useState } from 'react';
import { useToast } from '../hooks/use-toast';

interface KeyboardNavigationProps {
  options?: {
    enabled?: boolean;
    showToasts?: boolean;
    scrollConfig?: {
      scrollAmount?: number;
      smooth?: boolean;
      acceleration?: boolean;
      maxAcceleration?: number;
      accelerationRate?: number;
    };
  };
}

export const KeyboardNavigation: React.FC<KeyboardNavigationProps> = ({ options = {} }) => {
  const { toast } = useToast();
  const [scrollAmount, setScrollAmount] = useState(options.scrollConfig?.scrollAmount || 100);
  const accelerationTimer = useRef<number | null>(null);
  const accelerationActive = useRef(false);
  
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

  const resetAcceleration = useCallback(() => {
    if (accelerationTimer.current !== null) {
      window.clearTimeout(accelerationTimer.current);
      accelerationTimer.current = null;
    }
    
    setScrollAmount(mergedOptions.scrollConfig.scrollAmount);
    accelerationActive.current = false;
  }, [mergedOptions.scrollConfig.scrollAmount]);

  // Handle scroll acceleration
  const handleAcceleration = useCallback(() => {
    if (!mergedOptions.scrollConfig.acceleration) return;
    
    accelerationActive.current = true;
    
    // Reset acceleration after a short delay of no scroll activity
    if (accelerationTimer.current !== null) {
      window.clearTimeout(accelerationTimer.current);
    }
    
    accelerationTimer.current = window.setTimeout(() => {
      resetAcceleration();
    }, 300);
    
    // Calculate new scroll amount with acceleration
    const newAmount = Math.min(
      scrollAmount * mergedOptions.scrollConfig.accelerationRate,
      mergedOptions.scrollConfig.maxAcceleration
    );
    
    setScrollAmount(newAmount);
  }, [
    mergedOptions.scrollConfig.acceleration,
    mergedOptions.scrollConfig.accelerationRate,
    mergedOptions.scrollConfig.maxAcceleration,
    scrollAmount,
    resetAcceleration
  ]);

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
        handleAcceleration();
        window.scrollBy({
          top: -scrollAmount,
          behavior: mergedOptions.scrollConfig.smooth ? 'smooth' : 'auto'
        });
      } else if (['ArrowDown', 's', 'S'].includes(e.key)) {
        direction = 'down';
        handleAcceleration();
        window.scrollBy({
          top: scrollAmount,
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
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'w', 'W', 's', 'S'].includes(e.key)) {
        resetAcceleration();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      resetAcceleration();
    };
  }, [mergedOptions, scrollAmount, handleAcceleration, resetAcceleration, toast]);
  
  return null;
};
