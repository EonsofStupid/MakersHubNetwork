
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/ui/core/alert';
import { Button } from '@/ui/core/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ThemeErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export function ThemeErrorState({ error, onRetry }: ThemeErrorStateProps) {
  return (
    <div className="p-4 space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Theme Loading Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
      
      <div className="flex justify-center">
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    </div>
  );
}
