
import React from 'react';
import { Bug } from 'lucide-react';
import { useLoggingContext } from '../context/LoggingContext';
import { cn } from '@/lib/utils';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';

interface LogToggleButtonProps {
  className?: string;
}

export function LogToggleButton({ className }: LogToggleButtonProps) {
  const { toggleLogConsole, showLogConsole } = useLoggingContext();
  const logger = useLogger('LogToggleButton', LogCategory.SYSTEM);
  
  const handleToggle = () => {
    logger.debug(`Log console ${showLogConsole ? 'hidden' : 'shown'}`);
    toggleLogConsole();
  };
  
  return (
    <button
      onClick={handleToggle}
      className={cn(
        "fixed bottom-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur",
        "border border-primary/30 hover:border-primary/50 z-50",
        "text-primary hover:bg-primary/10 transition-colors duration-200",
        showLogConsole && "bg-primary/20",
        className
      )}
      title={showLogConsole ? "Hide logs" : "Show logs"}
    >
      <Bug className="w-5 h-5" />
    </button>
  );
}
