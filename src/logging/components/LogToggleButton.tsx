
import React from 'react';
import { useLoggingContext } from '../context/LoggingContext';
import { Terminal } from 'lucide-react';

interface LogToggleButtonProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function LogToggleButton({ 
  className = '',
  position = 'bottom-right' 
}: LogToggleButtonProps) {
  const { toggleLogConsole, showLogConsole } = useLoggingContext();
  
  // Map position to CSS classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };
  
  const positionClass = positionClasses[position];
  
  return (
    <button
      onClick={() => toggleLogConsole()}
      className={`fixed ${positionClass} p-2 rounded-full shadow-lg z-50 ${
        showLogConsole 
          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
      } ${className}`}
      title={showLogConsole ? 'Hide logs' : 'Show logs'}
      aria-label={showLogConsole ? 'Hide logs' : 'Show logs'}
    >
      <Terminal size={20} />
    </button>
  );
}
