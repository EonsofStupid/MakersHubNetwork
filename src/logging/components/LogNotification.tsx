
import React from 'react';
import { AlertCircle, Info, AlertTriangle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LogLevel, LogCategory } from '../types';

interface LogNotificationProps {
  level: LogLevel;
  category: LogCategory;
  message: string;
  onClose?: () => void;
}

export const LogNotification: React.FC<LogNotificationProps> = ({
  level,
  category,
  message,
  onClose
}) => {
  let icon;
  let variant: "default" | "destructive" | undefined;
  
  switch (level) {
    case LogLevel.DEBUG:
      icon = <Info className="h-4 w-4" />;
      variant = "default";
      break;
    case LogLevel.INFO:
      icon = <Info className="h-4 w-4" />;
      variant = "default";
      break;
    case LogLevel.WARNING:
      icon = <AlertTriangle className="h-4 w-4" />;
      variant = "default";
      break;
    case LogLevel.ERROR:
      icon = <AlertCircle className="h-4 w-4" />;
      variant = "destructive";
      break;
    case LogLevel.CRITICAL:
      icon = <XCircle className="h-4 w-4" />;
      variant = "destructive";
      break;
  }

  // Get appropriate title based on level
  const title = (() => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'Debug';
      case LogLevel.INFO:
        return 'Information';
      case LogLevel.WARNING:
        return 'Warning';
      case LogLevel.ERROR:
        return 'Error';
      case LogLevel.CRITICAL:
        return 'Critical Error';
      default:
        return 'Log';
    }
  })();

  return (
    <Alert variant={variant} className="animate-in slide-in-from-right-5">
      {icon}
      <AlertTitle>{title} - {category}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
