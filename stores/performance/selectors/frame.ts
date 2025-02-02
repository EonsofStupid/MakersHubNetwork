import { PerformanceState } from '../types';

export const selectFrameMetrics = (state: PerformanceState) => state.metrics.frameMetrics;
export const selectFrameDrops = (state: PerformanceState) => state.metrics.frameMetrics.drops;
export const selectAverageFrameTime = (state: PerformanceState) => state.metrics.frameMetrics.averageTime;
export const selectFramePeaks = (state: PerformanceState) => state.metrics.frameMetrics.peaks;