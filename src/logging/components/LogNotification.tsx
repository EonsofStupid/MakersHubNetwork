
import React from 'react';
import { AlertCircle, Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LogCategory } from '../types';
import { LogLevel } from '../types';
import { safelyRenderNode } from '../utils/react';

interface LogNotificationProps {
  level: LogLevel;
  category: LogCategory;
  message: React.ReactNode;
  onClose?: () => void;
  timestamp?: Date;
}

export const LogNotification: React.FC<LogNotificationProps> = ({
  level,
  category,
  message,
  onClose,
  timestamp
}) => {
  const getIcon = () => {
    switch (level) {
      case LogLevel.DEBUG:
        return <Info className="h-4 w-4" />;
      case LogLevel.INFO:
        return <Info className="h-4 w-4" />;
      case LogLevel.WARN:
        return <AlertTriangle className="h-4 w-4" />;
      case LogLevel.ERROR:
        return <AlertCircle className="h-4 w-4" />;
      case LogLevel.CRITICAL:
        return <XCircle className="h-4 w-4" />;
      case LogLevel.SUCCESS:
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = (): "default" | "destructive" => {
    switch (level) {
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return "destructive";
      default:
        return "default";
    }
  };

  const getTitle = (): string => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'Debug';
      case LogLevel.INFO:
        return 'Information';
      case LogLevel.WARN:
        return 'Warning';
      case LogLevel.ERROR:
        return 'Error';
      case LogLevel.CRITICAL:
        return 'Critical Error';
      case LogLevel.SUCCESS:
        return 'Success';
      default:
        return 'Log';
    }
  };

  // Pre-render the message content with type safety
  const messageContent = safelyRenderNode(message);
  
  // Format timestamp if provided
  const formattedTime = timestamp 
    ? timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '';

  return (
    <Alert variant={getVariant()} className="animate-in slide-in-from-right-5">
      <div className="flex items-start gap-2">
        {getIcon()}
        <div className="flex-1">
          <AlertTitle className="flex items-center justify-between">
            <span>{getTitle()} - {category}</span>
            {timestamp && (
              <span className="text-xs font-normal text-muted-foreground">{formattedTime}</span>
            )}
          </AlertTitle>
          <AlertDescription>
            {messageContent}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};
