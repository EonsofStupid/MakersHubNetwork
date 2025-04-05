
import React from 'react';
import { LogLevel } from '../constants/log-level';
import { LogCategory } from '../types';
import { renderUnknownAsNode } from '@/shared/utils/render';
import { AlertCircle, Check, Info, WarningTriangle, X } from 'lucide-react';

interface LogNotificationProps {
  level: LogLevel;
  message: string | React.ReactNode;
  category?: LogCategory;
  timestamp?: Date;
  onDismiss?: () => void;
  className?: string;
  duration?: number;
}

export function LogNotification({
  level,
  message,
  category,
  timestamp = new Date(),
  onDismiss,
  className = '',
  duration,
}: LogNotificationProps) {
  // Get icon and classes based on log level
  const getIconAndClasses = () => {
    switch (level) {
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          bgColor: 'bg-destructive/15',
          borderColor: 'border-destructive'
        };
      case LogLevel.WARN:
        return {
          icon: <WarningTriangle className="h-5 w-5" />,
          bgColor: 'bg-amber-500/15',
          borderColor: 'border-amber-500'
        };
      case LogLevel.SUCCESS:
        return {
          icon: <Check className="h-5 w-5" />,
          bgColor: 'bg-green-500/15',
          borderColor: 'border-green-500'
        };
      case LogLevel.INFO:
      default:
        return {
          icon: <Info className="h-5 w-5" />,
          bgColor: 'bg-blue-500/15',
          borderColor: 'border-blue-500'
        };
    }
  };

  const { icon, bgColor, borderColor } = getIconAndClasses();
  
  // Auto-dismiss notification after duration
  React.useEffect(() => {
    if (duration && onDismiss) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  return (
    <div 
      className={`${bgColor} ${borderColor} border rounded-lg shadow-lg p-4 max-w-md ${className}`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">
            {typeof message === 'string' ? message : renderUnknownAsNode(message)}
          </p>
          <div className="mt-1 flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              {category && (
                <span className="font-medium">{category}</span>
              )}
              <time dateTime={timestamp.toISOString()}>
                {timestamp.toLocaleTimeString()}
              </time>
            </div>
            {onDismiss && (
              <button 
                type="button"
                onClick={onDismiss}
                className="ml-auto -my-1.5 -mr-1.5 rounded-md p-1.5 hover:bg-muted/50 focus:ring-2 focus:outline-none"
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
