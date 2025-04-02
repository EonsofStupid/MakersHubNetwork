
import { createSimpleMeasurement, measurePerformance } from '@/logging';

/**
 * Re-export the performance measurement utilities from the centralized logging system
 * to maintain backward compatibility
 */
export { createSimpleMeasurement, measurePerformance as measureExecution };

