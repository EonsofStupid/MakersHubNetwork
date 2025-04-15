
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';
import type { LogEntry, LogFilter } from '@/shared/types/shared.types';

export interface LoggingContextType {
  logs: LogEntry[];
  addLog: (entry: LogEntry) => void;
  clearLogs: () => void;
  filter: LogFilter;
  setFilter: (filter: LogFilter) => void;
  showLogConsole: boolean;
  setShowLogConsole: (show: boolean) => void;
  findLog: (id: string) => LogEntry | undefined;
  lastLog?: LogEntry;
}

const LoggingContext = createContext<LoggingContextType>({
  logs: [],
  addLog: () => {},
  clearLogs: () => {},
  filter: {},
  setFilter: () => {},
  showLogConsole: false,
  setShowLogConsole: () => {},
  findLog: () => undefined
});

export const LoggingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<LogFilter>({});
  const [showLogConsole, setShowLogConsole] = useState(false);
  const logsMap = useRef(new Map<string, LogEntry>());

  const addLog = useCallback((entry: LogEntry) => {
    setLogs(prev => [...prev, entry]);
    logsMap.current.set(entry.id, entry);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    logsMap.current.clear();
  }, []);

  const findLog = useCallback((id: string) => {
    return logsMap.current.get(id);
  }, []);

  const value = {
    logs,
    addLog,
    clearLogs,
    filter,
    setFilter,
    showLogConsole,
    setShowLogConsole,
    findLog,
    lastLog: logs[logs.length - 1]
  };

  return (
    <LoggingContext.Provider value={value}>
      {children}
    </LoggingContext.Provider>
  );
};

export const useLoggingContext = () => {
  const context = useContext(LoggingContext);
  if (!context) {
    throw new Error('useLoggingContext must be used within a LoggingProvider');
  }
  return context;
};
