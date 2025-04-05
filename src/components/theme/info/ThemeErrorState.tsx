
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThemeErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export const ThemeErrorState: React.FC<ThemeErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background text-foreground">
      <div className="max-w-md rounded-lg border border-destructive/20 bg-destructive/5 p-6 shadow">
        <div className="flex flex-col items-center space-y-4 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-bold">Theme System Error</h2>
          <p className="text-muted-foreground">
            We encountered an error while loading the theme system:
          </p>
          <div className="rounded bg-background/50 p-3 text-sm font-mono w-full text-left overflow-auto max-h-32">
            {error.message}
          </div>
          <Button 
            onClick={onRetry} 
            variant="outline" 
            className="mt-4 border-primary/20"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Retry Loading Theme
          </Button>
        </div>
      </div>
    </div>
  );
};
