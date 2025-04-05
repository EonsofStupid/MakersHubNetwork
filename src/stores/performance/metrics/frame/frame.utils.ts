import { FrameMetrics } from './frame.types';

export const calculateFrameMetrics = (duration: number, threshold: number) => ({
  dropped: duration > threshold,
  duration,
  timestamp: performance.now()
});

export const updateFrameMetrics = (
  current: FrameMetrics,
  newDuration: number,
  threshold: number,
  batchSize: number
): FrameMetrics => {
  const isDropped = newDuration > threshold;
  const newPeaks = [...current.peaks, newDuration].slice(-batchSize);
  const newAverage = newPeaks.reduce((sum, val) => sum + val, 0) / newPeaks.length;
  const now = performance.now();

  return {
    drops: isDropped ? current.drops + 1 : current.drops,
    averageTime: newAverage,
    peaks: newPeaks,
    lastTimestamp: now
  };
};