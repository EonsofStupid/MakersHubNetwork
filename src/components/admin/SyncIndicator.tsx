
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';
import { usePerformanceStore } from '@/stores/performance/store';
import { selectPerformanceStatus } from '@/stores/performance/selectors';

interface SyncIndicatorProps {
  className?: string;
}

export function SyncIndicator({ className = '' }: SyncIndicatorProps) {
  const [showTimeTooltip, setShowTimeTooltip] = useState(false);
  const isMonitoring = usePerformanceStore(state => state.isMonitoring);
  const startMonitoring = usePerformanceStore(state => state.startMonitoring);
  const stopMonitoring = usePerformanceStore(state => state.stopMonitoring);
  const performanceStatus = usePerformanceStore(selectPerformanceStatus);
  const frameMetrics = usePerformanceStore(state => state.metrics.frameMetrics);
  
  const handleClick = () => {
    if (isMonitoring) {
      stopMonitoring();
    } else {
      startMonitoring();
    }
  };
  
  return (
    <div 
      className={`relative cursor-pointer ${className}`}
      onMouseEnter={() => setShowTimeTooltip(true)}
      onMouseLeave={() => setShowTimeTooltip(false)}
      onClick={handleClick}
    >
      <motion.div
        animate={isMonitoring ? { rotate: 360 } : { rotate: 0 }}
        transition={isMonitoring ? { duration: 1.5, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
        className={`w-5 h-5 ${isMonitoring ? 'text-primary' : 'text-muted-foreground'}`}
      >
        <RefreshCcw size={20} />
      </motion.div>
      
      <AnimatePresence>
        {showTimeTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-muted text-muted-foreground text-xs rounded shadow whitespace-nowrap"
          >
            {isMonitoring ? (
              <>
                <div>Frame drops: {frameMetrics.drops}</div>
                <div>Avg time: {frameMetrics.averageTime.toFixed(2)}ms</div>
                <div className={`text-${performanceStatus.isPerformant ? 'green' : 'red'}-500`}>
                  {performanceStatus.isPerformant ? 'Good performance' : 'Performance issues'}
                </div>
              </>
            ) : (
              <div>Performance monitoring inactive</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
