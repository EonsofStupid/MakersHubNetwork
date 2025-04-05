interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
}

export const getMemoryInfo = () => {
  if ('memory' in performance) {
    const { memory } = performance as Performance & { memory: MemoryInfo };
    return {
      heapSize: memory.usedJSHeapSize,
      instances: memory.totalJSHeapSize,
      lastGC: performance.now()
    };
  }
  return null;
};