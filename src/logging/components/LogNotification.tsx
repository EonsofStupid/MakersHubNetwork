
import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { LogLevel } from '../types';

const notificationVariants = cva(
  "relative w-full rounded-lg border p-4 shadow-md",
  {
    variants: {
      variant: {
        debug: "border-gray-400 bg-gray-400/10 text-gray-400",
        info: "border-[var(--impulse-primary)] bg-[var(--impulse-primary)]/10 text-[var(--impulse-text-primary)]",
        warning: "border-yellow-400 bg-yellow-400/10 text-yellow-400",
        error: "border-[var(--impulse-secondary)] bg-[var(--impulse-secondary)]/10 text-[var(--impulse-text-primary)]",
        critical: "border-red-600 bg-red-600/20 text-red-600",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

export interface LogNotificationProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  title?: string;
  message: string;
  timestamp?: Date;
  source?: string;
  level?: LogLevel;
  showIcon?: boolean;
  onClose?: () => void;
}

export const LogNotification = forwardRef<HTMLDivElement, LogNotificationProps>(
  ({ className, title, message, timestamp, source, level = LogLevel.INFO, variant, showIcon = true, onClose, ...props }, ref) => {
    // Determine variant based on level if not specified
    const effectiveVariant = variant || mapLevelToVariant(level);
    
    return (
      <div
        ref={ref}
        className={cn(
          notificationVariants({ variant: effectiveVariant }),
          getEffectsForLevel(level),
          className
        )}
        {...props}
      >
        {/* Header */}
        {(title || timestamp || source) && (
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">
              {title || (level !== undefined ? LogLevel[level] : 'Notification')}
            </div>
            
            <div className="flex items-center space-x-2 text-xs opacity-70">
              {source && <span>{source}</span>}
              {timestamp && <span>{timestamp.toLocaleTimeString()}</span>}
            </div>
          </div>
        )}
        
        {/* Message */}
        <div className="text-sm">{message}</div>
        
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-current opacity-70 hover:opacity-100"
            aria-label="Close"
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
    );
  }
);

LogNotification.displayName = "LogNotification";

// Helper functions
function mapLevelToVariant(level: LogLevel): "debug" | "info" | "warning" | "error" | "critical" {
  switch (level) {
    case LogLevel.DEBUG:
      return "debug";
    case LogLevel.INFO:
      return "info";
    case LogLevel.WARNING:
      return "warning";
    case LogLevel.ERROR:
      return "error";
    case LogLevel.CRITICAL:
      return "critical";
    default:
      return "info";
  }
}

function getEffectsForLevel(level: LogLevel): string {
  switch (level) {
    case LogLevel.DEBUG:
      return "";
    case LogLevel.INFO:
      return "pulse-subtle electric-border";
    case LogLevel.WARNING:
      return "pulse-glow";
    case LogLevel.ERROR:
      return "text-glitch-hover";
    case LogLevel.CRITICAL:
      return "text-glitch";
    default:
      return "";
  }
}
