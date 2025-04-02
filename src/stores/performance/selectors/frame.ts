
import { PerformanceState } from '../types';

/**
 * Selectors for frame metrics
 */
export const selectFrameMetrics = (state: PerformanceState) => state.metrics.frameMetrics;
export const selectFrameDrops = (state: PerformanceState) => state.metrics.frameMetrics.drops;
export const selectFrameTime = (state: PerformanceState) => state.metrics.frameMetrics.averageTime;
export const selectFramePeaks = (state: PerformanceState) => state.metrics.frameMetrics.peaks;
