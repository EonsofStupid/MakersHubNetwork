
import { useState, useCallback, useEffect, useRef } from 'react';
import { KeyboardNavigationOptions, KeyboardScrollState, ScrollOptions } from '../types/navigation.types';

const DEFAULT_OPTIONS: KeyboardNavigationOptions = {
  enabled: true,
  scrollConfig: {
    scrollAmount: 100,
    smooth: true,
    acceleration: true,
    maxAcceleration: 500,
    accelerationRate: 1.1
  },
  showToasts: false,
  scrollTarget: null,
  enableInInputs: false
};

export function useKeyboardScroll(initialOptions: Partial<KeyboardNavigationOptions> = {}) {
  // Merge with default options
  const [options, setOptions] = useState<KeyboardNavigationOptions>({
    ...DEFAULT_OPTIONS,
    ...initialOptions
  });
  
  // Track pressed keys
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  
  // Scrolling state
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Internal state with refs to avoid dependency issues in animation frame
  const stateRef = useRef<KeyboardScrollState>({
    currentAcceleration: options.scrollConfig.scrollAmount,
    animationFrameId: null
  });
  
  // Expose internal state for debugging
  const [_state, _setState] = useState<KeyboardScrollState>(stateRef.current);
  
  // Stop scrolling animation
  const stopScrolling = useCallback(() => {
    if (stateRef.current.animationFrameId) {
      cancelAnimationFrame(stateRef.current.animationFrameId);
      stateRef.current.animationFrameId = null;
      stateRef.current.currentAcceleration = options.scrollConfig.scrollAmount;
      _setState({...stateRef.current});
    }
    setIsScrolling(false);
  }, [options.scrollConfig.scrollAmount]);
  
  // Perform smooth scrolling with acceleration
  const performScroll = useCallback((direction: 'up' | 'down') => {
    if (!options.enabled) return;
    
    const scrollAmount = stateRef.current.currentAcceleration;
    const scrollTarget = options.scrollTarget || window;
    
    // Apply scrolling
    if (scrollTarget === window) {
      window.scrollBy({
        top: direction === 'up' ? -scrollAmount : scrollAmount,
        behavior: options.scrollConfig.smooth ? 'smooth' : 'auto'
      });
    } else {
      scrollTarget.scrollBy({
        top: direction === 'up' ? -scrollAmount : scrollAmount,
        behavior: options.scrollConfig.smooth ? 'smooth' : 'auto'
      });
    }
    
    // Apply acceleration if enabled
    if (options.scrollConfig.acceleration) {
      stateRef.current.currentAcceleration = Math.min(
        stateRef.current.currentAcceleration * options.scrollConfig.accelerationRate,
        options.scrollConfig.maxAcceleration
      );
      _setState({...stateRef.current});
    }
    
    // Continue animation
    stateRef.current.animationFrameId = requestAnimationFrame(() => {
      performScroll(direction);
    });
  }, [options.enabled, options.scrollConfig, options.scrollTarget]);
  
  // Handle key down
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Skip if in input fields and not enabled for inputs
    if (!options.enableInInputs && 
        ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
      return;
    }
    
    // Add to pressed keys
    const newPressedKeys = new Set(pressedKeys);
    newPressedKeys.add(e.key);
    setPressedKeys(newPressedKeys);
    
    // Determine direction
    let direction: 'up' | 'down' | null = null;
    
    if (['ArrowUp', 'w', 'W'].includes(e.key)) {
      direction = 'up';
    } else if (['ArrowDown', 's', 'S'].includes(e.key)) {
      direction = 'down';
    }
    
    // Start scrolling if not already and we have a direction
    if (direction && !stateRef.current.animationFrameId && options.enabled) {
      setIsScrolling(true);
      performScroll(direction);
    }
  }, [options.enabled, options.enableInInputs, performScroll, pressedKeys]);
  
  // Handle key up
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    // Remove from pressed keys
    const newPressedKeys = new Set(pressedKeys);
    newPressedKeys.delete(e.key);
    setPressedKeys(newPressedKeys);
    
    // If no more relevant keys are pressed, stop scrolling
    const hasScrollKeys = Array.from(newPressedKeys).some(key => 
      ['ArrowUp', 'w', 'W', 'ArrowDown', 's', 'S'].includes(key)
    );
    
    if (!hasScrollKeys) {
      stopScrolling();
    }
  }, [pressedKeys, stopScrolling]);
  
  // Update options
  const updateOptions = useCallback((newOptions: Partial<KeyboardNavigationOptions>) => {
    setOptions(prev => ({
      ...prev,
      ...newOptions,
      scrollConfig: {
        ...prev.scrollConfig,
        ...(newOptions.scrollConfig || {})
      }
    }));
  }, []);
  
  // Scroll to specific element
  const scrollToElement = useCallback((element: HTMLElement, scrollOptions?: ScrollOptions) => {
    if (!options.enabled) return;
    
    element.scrollIntoView({
      behavior: options.scrollConfig.smooth ? 'smooth' : 'auto',
      block: 'center',
      ...scrollOptions
    });
  }, [options.enabled, options.scrollConfig.smooth]);
  
  // Setup event listeners
  useEffect(() => {
    if (options.enabled) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        stopScrolling();
      };
    }
    
    return undefined;
  }, [options.enabled, handleKeyDown, handleKeyUp, stopScrolling]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stateRef.current.animationFrameId) {
        cancelAnimationFrame(stateRef.current.animationFrameId);
      }
    };
  }, []);
  
  return {
    scrollToElement,
    isScrolling,
    pressedKeys,
    setOptions: updateOptions,
    _state
  };
}
