export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

export const updateMetricTimestamp = () => ({
  lastTimestamp: performance.now()
});

export const detectPeaks = (
  values: number[],
  threshold: number,
  windowSize: number = 5
): number[] => {
  if (values.length < windowSize) return [];
  return values
    .slice(-windowSize)
    .filter(value => value > threshold);
};