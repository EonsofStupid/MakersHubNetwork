
import React from 'react';
import { AlertCircle, Info, AlertTriangle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LogCategory } from '../types';
import { LogLevel } from '../constants/log-level';
import { safelyRenderNode } from '@/shared/utils/react-utils';

interface LogNotificationProps {
  level: LogLevel;
  category: LogCategory;
  message: string | number | boolean | React.ReactNode;
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
      default:
        return 'Log';
    }
  };

  // Pre-render the message content with type safety
  const messageContent = safelyRenderNode(message);

  return (
    <Alert variant={getVariant()} className="animate-in slide-in-from-right-5">
      {getIcon()}
      <AlertTitle>{getTitle()} - {category}</AlertTitle>
      <AlertDescription>
        {messageContent}
      </AlertDescription>
    </Alert>
  );
};
