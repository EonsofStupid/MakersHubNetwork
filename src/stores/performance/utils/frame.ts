
/**
 * Calculate frame metrics based on duration and threshold
 */
export const calculateFrameMetrics = (duration: number, threshold: number) => ({
  dropped: duration > threshold,
  duration,
  timestamp: performance.now()
});

/**
 * Update frame metrics with new duration data
 */
export const updateFrameMetrics = (
  current: { drops: number; averageTime: number; peaks: number[]; lastTimestamp: number },
  newDuration: number,
  threshold: number,
  batchSize: number
) => {
  const isDropped = newDuration > threshold;
  const newPeaks = [...current.peaks, newDuration].slice(-batchSize);
  const newAverage = newPeaks.reduce((sum, val) => sum + val, 0) / newPeaks.length || 0;
  const now = performance.now();

  return {
    drops: isDropped ? current.drops + 1 : current.drops,
    averageTime: newAverage,
    peaks: newPeaks,
    lastTimestamp: now
  };
};
