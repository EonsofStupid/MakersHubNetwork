
import React from 'react';
import { LogLevel } from '../constants/log-level';
import { renderUnknownAsNode } from '@/shared/utils/render';
import { AlertCircle, Check, Info, WarningTriangle } from 'lucide-react';

interface InlineLogIndicatorProps {
  level: LogLevel;
  message: string | React.ReactNode;
  compact?: boolean;
  className?: string;
}

export function InlineLogIndicator({
  level,
  message,
  compact = false,
  className = '',
}: InlineLogIndicatorProps) {
  // Get icon and color based on log level
  const getIconAndColor = () => {
    switch (level) {
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return {
          icon: <AlertCircle className={compact ? "h-3 w-3" : "h-4 w-4"} />,
          textColor: 'text-destructive',
          bgColor: 'bg-destructive/10'
        };
      case LogLevel.WARN:
        return {
          icon: <WarningTriangle className={compact ? "h-3 w-3" : "h-4 w-4"} />,
          textColor: 'text-amber-500',
          bgColor: 'bg-amber-500/10'
        };
      case LogLevel.SUCCESS:
        return {
          icon: <Check className={compact ? "h-3 w-3" : "h-4 w-4"} />,
          textColor: 'text-green-500',
          bgColor: 'bg-green-500/10'
        };
      case LogLevel.INFO:
      default:
        return {
          icon: <Info className={compact ? "h-3 w-3" : "h-4 w-4"} />,
          textColor: 'text-blue-500',
          bgColor: 'bg-blue-500/10'
        };
    }
  };

  const { icon, textColor, bgColor } = getIconAndColor();

  return (
    <div className={`inline-flex items-center gap-1.5 ${bgColor} ${textColor} rounded-md px-2 py-0.5 text-xs font-medium ${className}`}>
      {icon}
      <span className="max-w-[150px] truncate">
        {typeof message === 'string' ? message : renderUnknownAsNode(message)}
      </span>
    </div>
  );
}
