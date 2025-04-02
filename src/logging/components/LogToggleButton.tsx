
import React from 'react';
import { useLoggingContext } from '../context/LoggingContext';
import { Terminal } from 'lucide-react';

export function LogToggleButton() {
  const { toggleLogConsole, showLogConsole } = useLoggingContext();
  
  return (
    <button
      onClick={toggleLogConsole}
      className={`fixed bottom-4 right-4 p-2 rounded-full shadow-lg z-50 ${
        showLogConsole 
          ? 'bg-blue-500 text-white hover:bg-blue-600' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
      }`}
      title={showLogConsole ? 'Hide logs' : 'Show logs'}
      aria-label={showLogConsole ? 'Hide logs' : 'Show logs'}
    >
      <Terminal size={20} />
    </button>
  );
}
