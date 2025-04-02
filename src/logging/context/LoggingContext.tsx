
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getLogger } from '../index';
import { LogLevel, LogCategory, LogEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { logEventEmitter } from '../events/LogEventEmitter';

interface LoggingContextType {
  showLogConsole: boolean;
  setShowLogConsole: (show: boolean) => void;
  logSystemStartup: () => void;
  logs: LogEntry[];
  clearLogs: () => void;
  toggleLogConsole: () => void;
}

const LoggingContext = createContext<LoggingContextType>({
  showLogConsole: false,
  setShowLogConsole: () => {},
  logSystemStartup: () => {},
  logs: [],
  clearLogs: () => {},
  toggleLogConsole: () => {}
});

export const useLoggingContext = () => useContext(LoggingContext);

export const LoggingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showLogConsole, setShowLogConsole] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logger = getLogger();
  
  // Toggle log console
  const toggleLogConsole = useCallback(() => {
    setShowLogConsole(prev => !prev);
  }, []);
  
  // Clear logs
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);
  
  // Log system startup
  const logSystemStartup = useCallback(() => {
    logger.info('Application UI initialized', {
      category: LogCategory.SYSTEM,
      details: {
        environment: import.meta.env.MODE,
        timestamp: new Date().toISOString(),
      },
      tags: ['startup', 'initialization']
    });
  }, [logger]);
  
  // Listen for log events using our event emitter
  useEffect(() => {
    const handleLogEvent = (entry: LogEntry) => {
      setLogs(prevLogs => [...prevLogs, {
        ...entry,
        id: entry.id || uuidv4()
      }]);
    };
    
    // Subscribe to log events
    const unsubscribe = logEventEmitter.onLog(handleLogEvent);
    
    return unsubscribe;
  }, []);
  
  // Listen for key combinations to toggle log console (Ctrl+Shift+L)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        toggleLogConsole();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleLogConsole]);
  
  return (
    <LoggingContext.Provider value={{ 
      showLogConsole, 
      setShowLogConsole,
      logSystemStartup,
      logs,
      clearLogs,
      toggleLogConsole
    }}>
      {children}
    </LoggingContext.Provider>
  );
};
