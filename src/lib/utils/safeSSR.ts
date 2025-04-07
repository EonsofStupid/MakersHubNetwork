
/**
 * Safely execute a function that might fail in SSR context
 * @param fn Function to execute
 * @param fallback Fallback value if function fails
 * @returns Result of function or fallback value
 */
export function safeSSR<T>(fn: () => T, fallback: T): T {
  try {
    if (typeof window === 'undefined') {
      return fallback;
    }
    return fn();
  } catch (error) {
    console.warn('SafeSSR caught error:', error);
    return fallback;
  }
}

/**
 * Safe wrapper for localStorage to prevent SSR issues
 */
export function safeLocalStorage<T>(key: string, fallback: T): T {
  return safeSSR(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  }, fallback);
}

/**
 * Safe wrapper for sessionStorage to prevent SSR issues
 */
export function safeSessionStorage<T>(key: string, fallback: T): T {
  return safeSSR(() => {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  }, fallback);
}

/**
 * Safe wrapper for window properties to prevent SSR issues
 */
export function safeWindow<T>(property: string, fallback: T): T {
  return safeSSR(() => {
    return (window as any)[property] || fallback;
  }, fallback);
}
