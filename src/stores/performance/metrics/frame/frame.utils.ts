import { FrameMetrics } from '../types';
import { calculateAverage, detectPeaks, updateMetricTimestamp } from '../utils';

export const updateFrameMetrics = (
  current: FrameMetrics,
  newDuration: number,
  threshold: number,
  batchSize: number
): Partial<FrameMetrics> => {
  const newPeaks = [...current.peaks, newDuration].slice(-batchSize);
  
  return {
    drops: newDuration > threshold ? current.drops + 1 : current.drops,
    averageTime: calculateAverage(newPeaks),
    peaks: detectPeaks(newPeaks, threshold),
    ...updateMetricTimestamp()
  };
};