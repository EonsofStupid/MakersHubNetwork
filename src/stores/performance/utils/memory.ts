
interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
}

/**
 * Get memory information from the browser if available
 */
export const getMemoryInfo = () => {
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    const { memory } = performance as Performance & { memory: MemoryInfo };
    return {
      heapSize: memory.usedJSHeapSize,
      instances: memory.totalJSHeapSize,
      lastGC: performance.now()
    };
  }
  return null;
};
