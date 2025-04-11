
import { useEffect, useRef, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  NavigationDirection, 
  ScrollConfig,
  KeyboardNavigationOptions
} from '../types/navigation.types';

const DIRECTION_KEYS = {
  up: ['ArrowUp', 'w', 'W'],
  down: ['ArrowDown', 's', 'S'],
  left: ['ArrowLeft', 'a', 'A'],
  right: ['ArrowRight', 'd', 'D']
};

// Default scroll configuration
const DEFAULT_SCROLL_CONFIG: ScrollConfig = {
  scrollAmount: 100,
  smooth: true,
  acceleration: true,
  maxAcceleration: 500,
  accelerationRate: 1.1
};

export const useKeyboardScroll = (options: Partial<KeyboardNavigationOptions> = {}) => {
  const { toast } = useToast();
  
  // Merge default options with provided options
  const mergedOptions = {
    enabled: true,
    scrollConfig: { ...DEFAULT_SCROLL_CONFIG, ...options.scrollConfig },
    showToasts: false,
    enableInInputs: false,
    ...options
  };

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [currentAcceleration, setCurrentAcceleration] = useState(mergedOptions.scrollConfig.scrollAmount);
  const animationFrameIdRef = useRef<number | null>(null);
  
  const getScrollTarget = useCallback(() => {
    return mergedOptions.scrollTarget || document.documentElement;
  }, [mergedOptions.scrollTarget]);

  const clearAnimationFrame = useCallback(() => {
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
  }, []);
  
  // Handle smooth scrolling with animation frames
  const smoothScroll = useCallback((direction: NavigationDirection) => {
    const scrollTarget = getScrollTarget();
    let acceleration = currentAcceleration;
    
    const scroll = () => {
      // Calculate the amount to scroll with acceleration
      const amount = mergedOptions.scrollConfig.acceleration ? acceleration : mergedOptions.scrollConfig.scrollAmount;
      
      // Apply the scroll
      if (direction === 'up') {
        scrollTarget.scrollTop -= amount;
      } else if (direction === 'down') {
        scrollTarget.scrollTop += amount;
      } else if (direction === 'left') {
        scrollTarget.scrollLeft -= amount;
      } else if (direction === 'right') {
        scrollTarget.scrollLeft += amount;
      }
      
      // Increase acceleration if enabled
      if (mergedOptions.scrollConfig.acceleration) {
        acceleration = Math.min(
          acceleration * mergedOptions.scrollConfig.accelerationRate,
          mergedOptions.scrollConfig.maxAcceleration
        );
        setCurrentAcceleration(acceleration);
      }
      
      // Continue animation if keys are still pressed
      if (
        (direction === 'up' && pressedKeys.has('ArrowUp') || pressedKeys.has('w') || pressedKeys.has('W')) ||
        (direction === 'down' && pressedKeys.has('ArrowDown') || pressedKeys.has('s') || pressedKeys.has('S')) ||
        (direction === 'left' && pressedKeys.has('ArrowLeft') || pressedKeys.has('a') || pressedKeys.has('A')) ||
        (direction === 'right' && pressedKeys.has('ArrowRight') || pressedKeys.has('d') || pressedKeys.has('D'))
      ) {
        animationFrameIdRef.current = requestAnimationFrame(scroll);
      } else {
        clearAnimationFrame();
        setIsAccelerating(false);
      }
    };
    
    // Start the animation
    animationFrameIdRef.current = requestAnimationFrame(scroll);
  }, [
    currentAcceleration, 
    pressedKeys, 
    getScrollTarget, 
    clearAnimationFrame, 
    mergedOptions.scrollConfig
  ]);
  
  // Handle keydown events
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Skip if navigation is disabled
    if (!mergedOptions.enabled) return;
    
    // Skip if in input fields and not enabled
    if (
      !mergedOptions.enableInInputs && 
      ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)
    ) {
      return;
    }
    
    let direction: NavigationDirection | null = null;
    
    // Determine the direction based on the key
    if (DIRECTION_KEYS.up.includes(e.key)) {
      direction = 'up';
    } else if (DIRECTION_KEYS.down.includes(e.key)) {
      direction = 'down';
    } else if (DIRECTION_KEYS.left.includes(e.key)) {
      direction = 'left';
    } else if (DIRECTION_KEYS.right.includes(e.key)) {
      direction = 'right';
    }
    
    // If it's a navigation key, handle the scroll
    if (direction) {
      e.preventDefault();
      
      // Update pressed keys
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.add(e.key);
        return newSet;
      });
      
      // If we're not already accelerating, start smooth scrolling
      if (!isAccelerating) {
        setIsAccelerating(true);
        setCurrentAcceleration(mergedOptions.scrollConfig.scrollAmount);
        
        // Notify the user if toasts are enabled
        if (mergedOptions.showToasts) {
          toast({
            title: `Scrolling ${direction}`,
            description: "Use W/S or arrow keys to scroll",
            duration: 2000,
          });
        }
        
        // Start smooth scrolling
        smoothScroll(direction);
      }
    }
  }, [
    mergedOptions.enabled, 
    mergedOptions.enableInInputs,
    mergedOptions.showToasts,
    mergedOptions.scrollConfig.scrollAmount,
    isAccelerating, 
    smoothScroll, 
    toast
  ]);
  
  // Handle keyup events
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    // Check if it's a navigation key
    if (
      DIRECTION_KEYS.up.includes(e.key) ||
      DIRECTION_KEYS.down.includes(e.key) ||
      DIRECTION_KEYS.left.includes(e.key) ||
      DIRECTION_KEYS.right.includes(e.key)
    ) {
      // Remove from pressed keys
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.key);
        return newSet;
      });
      
      // If no more navigation keys are pressed, reset acceleration
      const isAnyDirectionalKeyPressed = [...DIRECTION_KEYS.up, ...DIRECTION_KEYS.down, 
                                          ...DIRECTION_KEYS.left, ...DIRECTION_KEYS.right]
                                         .some(key => pressedKeys.has(key) && key !== e.key);
      
      if (!isAnyDirectionalKeyPressed) {
        setIsAccelerating(false);
        setCurrentAcceleration(mergedOptions.scrollConfig.scrollAmount);
      }
    }
  }, [pressedKeys, mergedOptions.scrollConfig.scrollAmount]);
  
  // Scroll to a specific element
  const scrollToElement = useCallback((element: HTMLElement, options: ScrollIntoViewOptions = {}) => {
    if (!element) return;
    
    const scrollBehavior = options.behavior || (mergedOptions.scrollConfig.smooth ? 'smooth' : 'auto');
    
    element.scrollIntoView({
      behavior: scrollBehavior,
      block: options.block || 'start',
      inline: options.inline || 'nearest'
    });
    
    if (mergedOptions.showToasts) {
      toast({
        title: 'Scrolled to element',
        duration: 2000,
      });
    }
  }, [mergedOptions.scrollConfig.smooth, mergedOptions.showToasts, toast]);
  
  // Set up the event listeners
  useEffect(() => {
    if (mergedOptions.enabled) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        clearAnimationFrame();
      };
    }
    
    return undefined;
  }, [mergedOptions.enabled, handleKeyDown, handleKeyUp, clearAnimationFrame]);
  
  return {
    scrollToElement,
    pressedKeys,
    isScrolling: isAccelerating,
    setOptions: (newOptions: Partial<KeyboardNavigationOptions>) => {
      // This would typically update a state/context in a full implementation
      console.log('Updating keyboard navigation options:', newOptions);
    },
    // For debugging/development
    _state: {
      pressedKeys,
      isAccelerating,
      currentAcceleration,
      animationFrameId: animationFrameIdRef.current
    }
  };
};
