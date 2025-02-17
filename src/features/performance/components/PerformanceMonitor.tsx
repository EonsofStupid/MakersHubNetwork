import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePerformance } from '../hooks/usePerformance';
import { formatDuration, formatMemorySize } from '../utils/performance-utils';
import { cn } from '@/app/utils/cn';

interface PerformanceMonitorProps {
  className?: string;
  showDetailed?: boolean;
}

export const PerformanceMonitor = ({
  className,
  showDetailed = false,
}: PerformanceMonitorProps) => {
  const {
    metrics,
    status,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
  } = usePerformance();

  useEffect(() => {
    if (!isMonitoring) {
      startMonitoring();
    }
    return () => stopMonitoring();
  }, [isMonitoring, startMonitoring, stopMonitoring]);

  const { frameMetrics, storeMetrics, memoryMetrics } = metrics;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn(
        "fixed bottom-4 right-4 p-4 rounded-lg",
        "bg-background/80 backdrop-blur-lg",
        "border border-primary/30",
        "shadow-lg",
        className
      )}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Performance Monitor</h3>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                status.isPerformant ? "bg-green-500" : "bg-red-500"
              )}
            />
            <span className="text-xs text-muted-foreground">
              {status.isPerformant ? "Optimal" : "Issues Detected"}
            </span>
          </div>
        </div>

        {showDetailed && (
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <h4 className="text-xs font-medium text-muted-foreground">
                Frame Metrics
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Average Time:</div>
                <div>{formatDuration(frameMetrics.averageTime)}</div>
                <div>Frame Drops:</div>
                <div>{frameMetrics.drops}</div>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-medium text-muted-foreground">
                Store Metrics
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Updates:</div>
                <div>{storeMetrics.updates}</div>
                <div>Compute Time:</div>
                <div>{formatDuration(storeMetrics.computeTime)}</div>
                <div>Subscribers:</div>
                <div>{storeMetrics.subscribers.size}</div>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-medium text-muted-foreground">
                Memory Metrics
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Heap Size:</div>
                <div>{formatMemorySize(memoryMetrics.heapSize)}</div>
                <div>Instances:</div>
                <div>{memoryMetrics.instances}</div>
                {memoryMetrics.lastGC && (
                  <>
                    <div>Last GC:</div>
                    <div>{formatDuration(Date.now() - memoryMetrics.lastGC)} ago</div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}; 