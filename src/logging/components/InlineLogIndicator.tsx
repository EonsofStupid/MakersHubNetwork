
import React from 'react';
import { LogEntry } from '../types';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { renderUnknownAsNode } from '@/shared/rendering';

interface InlineLogIndicatorProps {
  log: LogEntry;
}

export const InlineLogIndicator: React.FC<InlineLogIndicatorProps> = ({ log }) => {
  // Determine the appropriate icon based on log level
  const getIcon = () => {
    switch (log.level) {
      case 'error':
      case 'critical':
        return <XCircle className="text-destructive h-4 w-4" />;
      case 'warn':
        return <AlertTriangle className="text-yellow-500 h-4 w-4" />;
      case 'success':
        return <CheckCircle className="text-green-500 h-4 w-4" />;
      default:
        return <Info className="text-blue-500 h-4 w-4" />;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {getIcon()}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <div>{renderUnknownAsNode(log.message)}</div>
            {log.details && (
              <pre className="text-xs mt-1 text-muted-foreground overflow-auto max-h-20">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            )}
            <div className="text-xs text-muted-foreground">
              {new Date(log.timestamp).toLocaleString()}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
