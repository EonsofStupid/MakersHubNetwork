import { FrameMetrics, StoreMetrics, MemoryMetrics } from '../types';

export const calculateFrameMetrics = (duration: number, threshold: number) => ({
  dropped: duration > threshold,
  duration,
  timestamp: performance.now(),
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
    lastTimestamp: now,
  };
};

export const updateStoreMetrics = (
  current: StoreMetrics,
  computeTime: number,
  subscriberId?: string
): StoreMetrics => {
  const now = performance.now();
  const newSubscribers = new Map(current.subscribers);
  
  if (subscriberId) {
    newSubscribers.set(subscriberId, (newSubscribers.get(subscriberId) || 0) + 1);
  }

  return {
    updates: current.updates + 1,
    subscribers: newSubscribers,
    computeTime: current.computeTime + computeTime,
    lastUpdateTimestamp: now,
    lastTimestamp: now,
    averageTime: (current.averageTime * current.updates + computeTime) / (current.updates + 1),
  };
};

export const updateMemoryMetrics = (
  current: MemoryMetrics,
  heapSize: number,
  instances: number,
  gcTimestamp?: number
): MemoryMetrics => {
  const now = performance.now();
  return {
    heapSize,
    instances,
    lastGC: gcTimestamp || current.lastGC,
    lastTimestamp: now,
    averageTime: current.averageTime,
  };
};

export const formatDuration = (duration: number): string => {
  if (duration < 1) {
    return `${(duration * 1000).toFixed(2)}μs`;
  }
  if (duration < 1000) {
    return `${duration.toFixed(2)}ms`;
  }
  return `${(duration / 1000).toFixed(2)}s`;
};

export const formatMemorySize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)}${units[unitIndex]}`;
}; 