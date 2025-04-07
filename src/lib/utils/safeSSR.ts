
/**
 * Execute a function safely in a browser environment
 * Returns fallback value if window is not defined (SSR environment)
 */
export function safeSSR<T>(fn: () => T, fallback: T): T {
  try {
    if (typeof window === 'undefined') {
      return fallback;
    }
    return fn();
  } catch (error) {
    console.error('Error in safeSSR:', error);
    return fallback;
  }
}
