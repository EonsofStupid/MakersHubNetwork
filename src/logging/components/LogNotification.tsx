
import React from 'react';
import { LogEntry } from '../types';
import { Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { renderUnknownAsNode } from '@/shared/rendering';

interface LogNotificationProps {
  log: LogEntry;
  onClose?: () => void;
}

export const LogNotification: React.FC<LogNotificationProps> = ({ log, onClose }) => {
  // Determine the appropriate styles based on log level
  const getStyles = () => {
    switch (log.level) {
      case 'error':
      case 'critical':
        return {
          container: 'border-destructive bg-destructive/10',
          icon: <XCircle className="text-destructive h-5 w-5" />,
        };
      case 'warn':
        return {
          container: 'border-yellow-500 bg-yellow-500/10',
          icon: <AlertTriangle className="text-yellow-500 h-5 w-5" />,
        };
      case 'success':
        return {
          container: 'border-green-500 bg-green-500/10',
          icon: <CheckCircle className="text-green-500 h-5 w-5" />,
        };
      default:
        return {
          container: 'border-blue-500 bg-blue-500/10',
          icon: <Info className="text-blue-500 h-5 w-5" />,
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`rounded-md border p-3 shadow-md ${styles.container}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div>{styles.icon}</div>
        <div className="flex-1">
          <div className="font-medium">{renderUnknownAsNode(log.message)}</div>
          {log.details && (
            <div className="text-sm text-muted-foreground mt-1">
              {typeof log.details === 'object'
                ? Object.entries(log.details)
                    .filter(([key]) => typeof key === 'string')
                    .map(([key, value]) => (
                      <div key={key} className="flex gap-1">
                        <span className="font-medium">{key}:</span>
                        <span>{String(value)}</span>
                      </div>
                    ))
                : String(log.details)}
            </div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
