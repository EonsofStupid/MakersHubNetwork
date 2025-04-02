
import { PerformanceState } from '../types';

/**
 * Selectors for memory metrics
 */
export const selectMemoryMetrics = (state: PerformanceState) => state.metrics.memoryMetrics;
export const selectHeapSize = (state: PerformanceState) => state.metrics.memoryMetrics.heapSize;
export const selectInstances = (state: PerformanceState) => state.metrics.memoryMetrics.instances;
