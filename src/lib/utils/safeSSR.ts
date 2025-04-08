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
    
    return fn();
  } catch (error) {
    console.error('Error in safeSSR:', error);
    return fallback;
  }
}

/**
 * Safe way to check if we're in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Safe way to check if hydration is complete
 */
export function isHydrated(): boolean {
  if (!isBrowser()) return false;
  
  // Check for our custom data attribute
  return document.documentElement.hasAttribute('data-hydrated');
}

/**
 * Execute a function only after hydration is complete
 * Returns a cleanup function
 */
export function afterHydration(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  
  if (isHydrated()) {
    // If already hydrated, execute immediately but async
    setTimeout(callback, 0);
    return () => {};
  }
  
  // Otherwise wait for hydration
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName === 'data-hydrated') {
        setTimeout(callback, 0);
        observer.disconnect();
        break;
      }
    }
  });
  
  observer.observe(document.documentElement, { attributes: true });
  
  // Return cleanup function
  return () => {
    observer.disconnect();
  };
}
