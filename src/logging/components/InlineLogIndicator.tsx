
import React from 'react';
import { Check, Info, AlertCircle, AlertTriangle } from 'lucide-react';
import { LogLevel } from '../constants/log-level';
import { cn } from '@/lib/utils';

export interface InlineLogIndicatorProps {
  level?: LogLevel;
  message: string | React.ReactNode;
  variant?: 'default' | 'compact';
  className?: string;
  onClick?: () => void;
}

export function InlineLogIndicator({
  level = LogLevel.INFO,
  message,
  variant = 'default',
  className,
  onClick
}: InlineLogIndicatorProps) {
  // Determine icon based on log level
  const getIcon = () => {
    switch (level) {
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case LogLevel.WARN:
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case LogLevel.SUCCESS:
        return <Check className="h-4 w-4 text-green-500" />;
      case LogLevel.INFO:
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  // Get background color based on log level
  const getBgColor = () => {
    switch (level) {
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return 'bg-destructive/10';
      case LogLevel.WARN:
        return 'bg-amber-500/10';
      case LogLevel.SUCCESS:
        return 'bg-green-500/10';
      case LogLevel.INFO:
      default:
        return 'bg-blue-500/10';
    }
  };

  const isCompact = variant === 'compact';

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-md text-xs p-1',
        getBgColor(),
        onClick && 'cursor-pointer hover:opacity-80',
        isCompact ? 'px-1.5' : 'px-2 py-1',
        className
      )}
    >
      {getIcon()}
      <span className={isCompact ? 'line-clamp-1' : ''}>
        {message}
      </span>
    </div>
  );
}
