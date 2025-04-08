/**
 * Execute a function safely in a browser environment
 * Returns fallback value if window is not defined (SSR environment)
 */
export function safeSSR<T>(fn: () => T, fallback: T): T {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return fallback;
    }
    
    // Check if we're in a hydration phase
    if (document.readyState === 'loading') {
      return fallback;
    }
    
    // Check if we're in a hydration phase using our custom attribute
    if (!document.documentElement.hasAttribute('data-hydrated')) {
      return fallback;
    }
    
    return fn();
  } catch (error) {
    console.error('Error in safeSSR:', error);
    return fallback;
  }
}
