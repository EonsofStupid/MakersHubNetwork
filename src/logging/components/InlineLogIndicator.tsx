
import React, { useState } from 'react';
import { LogLevel } from '../types';
import { cn } from '@/lib/utils';

interface InlineLogIndicatorProps {
  level: LogLevel;
  message: string;
  details?: unknown;
  onClick?: () => void;
  className?: string;
  pulseEffect?: boolean;
}

export const InlineLogIndicator: React.FC<InlineLogIndicatorProps> = ({
  level,
  message,
  details,
  onClick,
  className,
  pulseEffect = true
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const handleMouseEnter = () => {
    setShowTooltip(true);
  };
  
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  
  return (
    <div className="relative inline-block">
      <div
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "w-2 h-2 rounded-full inline-block cursor-pointer",
          getLogLevelClass(level),
          pulseEffect && getPulseClass(level),
          className
        )}
      />
      
      {showTooltip && (
        <div className={cn(
          "absolute z-50 bottom-full mb-2 p-2 rounded-md text-xs w-max max-w-xs", 
          "transform -translate-x-1/2 left-1/2",
          "bg-[var(--impulse-bg-card)] border border-[var(--impulse-border-normal)]",
          "backdrop-blur-md text-[var(--impulse-text-primary)]"
        )}>
          <div className="font-bold mb-1">{message}</div>
          {details && (
            <div className="text-[var(--impulse-text-secondary)]">
              {typeof details === 'object' 
                ? JSON.stringify(details).substring(0, 100) + (JSON.stringify(details).length > 100 ? '...' : '')
                : String(details)
              }
            </div>
          )}
          <div className="text-center text-[var(--impulse-text-secondary)] mt-1 text-[10px]">
            Click for more details
          </div>
          
          {/* Arrow */}
          <div className="absolute w-2 h-2 bg-[var(--impulse-bg-card)] border-r border-b border-[var(--impulse-border-normal)] transform rotate-45 left-1/2 -bottom-1 -ml-1" />
        </div>
      )}
    </div>
  );
};

// Helper functions for styling
function getLogLevelClass(level: LogLevel): string {
  switch (level) {
    case LogLevel.DEBUG:
      return 'bg-gray-400';
    case LogLevel.INFO:
      return 'bg-[var(--impulse-primary)]';
    case LogLevel.WARNING:
      return 'bg-yellow-400';
    case LogLevel.ERROR:
      return 'bg-[var(--impulse-secondary)]';
    case LogLevel.CRITICAL:
      return 'bg-red-600';
    default:
      return 'bg-gray-400';
  }
}

function getPulseClass(level: LogLevel): string {
  switch (level) {
    case LogLevel.DEBUG:
      return '';
    case LogLevel.INFO:
      return 'animate-pulse';
    case LogLevel.WARNING:
      return 'animate-pulse';
    case LogLevel.ERROR:
      return 'animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite]';
    case LogLevel.CRITICAL:
      return 'animate-[pulse_0.5s_cubic-bezier(0.4,0,0.6,1)_infinite]';
    default:
      return '';
  }
}
