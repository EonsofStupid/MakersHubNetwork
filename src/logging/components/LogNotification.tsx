
import React from 'react';
import { LogLevel } from '../constants/log-level';
import { cn } from '@/lib/utils';
import { Check, Info, AlertCircle, AlertTriangle } from 'lucide-react';

interface LogNotificationProps {
  level: LogLevel;
  message: string | React.ReactNode;
  timestamp?: Date;
  onClose?: () => void;
  className?: string;
}

export function LogNotification({
  level,
  message,
  timestamp,
  onClose,
  className
}: LogNotificationProps) {
  // Get icon based on log level
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

  // Get border color based on log level
  const getBorderColor = () => {
    switch (level) {
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return 'border-destructive';
      case LogLevel.WARN:
        return 'border-amber-500';
      case LogLevel.SUCCESS:
        return 'border-green-500';
      case LogLevel.INFO:
      default:
        return 'border-blue-500';
    }
  };

  return (
    <div
      className={cn(
        'rounded-md shadow-sm border-l-2 bg-background px-4 py-3',
        getBorderColor(),
        className
      )}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-3">{getIcon()}</div>
        <div className="flex-1 text-sm">{message}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto flex-shrink-0 text-muted-foreground hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
      {timestamp && (
        <div className="mt-1 text-xs text-muted-foreground">
          {timestamp.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
