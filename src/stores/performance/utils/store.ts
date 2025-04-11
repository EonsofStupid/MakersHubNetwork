export const measureStoreUpdate = (callback: () => void) => {
  const start = performance.now();
  callback();
  return performance.now() - start;
};

export const updateStoreMetrics = (
  current: { updates: number; computeTime: number },
  duration: number
) => ({
  updates: current.updates + 1,
  computeTime: current.computeTime + duration,
  lastUpdateTimestamp: performance.now()
});