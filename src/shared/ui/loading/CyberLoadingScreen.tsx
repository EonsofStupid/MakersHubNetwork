
import React from 'react';
import { Loader, Circuit, BrainCircuit } from 'lucide-react';
import { Progress } from '@/shared/ui/progress';
import { cn } from '@/shared/utils/cn';

interface CyberLoadingScreenProps {
  message?: string;
  subMessage?: string;
  progress?: number;
  className?: string;
}

export function CyberLoadingScreen({
  message = "System Initialization",
  subMessage = "Loading core modules...",
  progress = 0,
  className
}: CyberLoadingScreenProps) {
  return (
    <div className={cn(
      "fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50",
      "cyber-background",
      className
    )}>
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="relative flex justify-center">
          <BrainCircuit className="h-16 w-16 text-primary animate-pulse" />
          <Circuit className="absolute h-24 w-24 text-primary/20 animate-spin-slow" />
        </div>
        
        <div className="space-y-6 text-center">
          <h2 className="cyber-text text-2xl font-bold tracking-wider">
            {message}
          </h2>
          
          <div className="space-y-4">
            <Progress value={progress} className="cyber-glow h-2" />
            <p className="text-muted-foreground text-sm animate-pulse">
              {subMessage}
            </p>
          </div>
          
          <div className="flex justify-center gap-2">
            <span className="h-2 w-2 bg-primary rounded-full animate-ping" />
            <span className="h-2 w-2 bg-primary/80 rounded-full animate-ping delay-75" />
            <span className="h-2 w-2 bg-primary/60 rounded-full animate-ping delay-150" />
          </div>
        </div>
      </div>
    </div>
  );
}
