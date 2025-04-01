
import React from 'react';
import { AlertCircle, Info, AlertTriangle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LogCategory } from '../types';
import { LOG_LEVELS, LogLevel } from '../constants/log-level';

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
  const getIcon = () => {
    switch (level) {
      case LOG_LEVELS.DEBUG:
        return <Info className="h-4 w-4" />;
      case LOG_LEVELS.INFO:
        return <Info className="h-4 w-4" />;
      case LOG_LEVELS.WARN:
        return <AlertTriangle className="h-4 w-4" />;
      case LOG_LEVELS.ERROR:
        return <AlertCircle className="h-4 w-4" />;
      case LOG_LEVELS.CRITICAL:
        return <XCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = (): "default" | "destructive" => {
    switch (level) {
      case LOG_LEVELS.ERROR:
      case LOG_LEVELS.CRITICAL:
        return "destructive";
      default:
        return "default";
    }
  };

  // Get appropriate title based on level
  const getTitle = (): string => {
    switch (level) {
      case LOG_LEVELS.DEBUG:
        return 'Debug';
      case LOG_LEVELS.INFO:
        return 'Information';
      case LOG_LEVELS.WARN:
        return 'Warning';
      case LOG_LEVELS.ERROR:
        return 'Error';
      case LOG_LEVELS.CRITICAL:
        return 'Critical Error';
      default:
        return 'Log';
    }
  };

  return (
    <Alert variant={getVariant()} className="animate-in slide-in-from-right-5">
      {getIcon()}
      <AlertTitle>{getTitle()} - {category}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
