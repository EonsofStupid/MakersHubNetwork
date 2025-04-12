
import { LogTransport, LogEvent, LogLevel, LogCategory } from '../types';
import { create } from 'zustand';

// Type for UI Log item with additional UI-specific properties
export interface UILogItem extends LogEvent {
  id: string;
  read: boolean;
  important: boolean;
  pinned: boolean;
}

// Toast configuration for log events
export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

// State interface for the logs store
interface LogsState {
  logs: UILogItem[];
  unreadCount: number;
  pinnedLogs: UILogItem[];
  toasts: Toast[];
  
  // Actions
  addLog: (log: LogEvent) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  pinLog: (id: string) => void;
  unpinLog: (id: string) => void;
  clearLogs: () => void;
  addToast: (toast: Toast) => void;
  dismissToast: (id: string) => void;
}

// Create store
export const useLogsStore = create<LogsState>((set) => ({
  logs: [],
  unreadCount: 0,
  pinnedLogs: [],
  toasts: [],
  
  addLog: (log: LogEvent) => {
    const newLog: UILogItem = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      important: log.level === 'error' || log.level === 'critical',
      pinned: false,
    };
    
    set((state) => ({
      logs: [newLog, ...state.logs].slice(0, 1000), // Keep only last 1000 logs
      unreadCount: state.unreadCount + 1,
    }));
    
    // Create toast for errors and critical logs
    if (log.level === 'error' || log.level === 'critical') {
      set((state) => ({
        toasts: [
          ...state.toasts,
          {
            id: newLog.id,
            title: `${log.level === 'critical' ? 'Critical Error' : 'Error'}: ${log.source}`,
            description: log.message,
            variant: 'destructive',
            duration: log.level === 'critical' ? 10000 : 5000,
            icon: 'alert-triangle'
          }
        ]
      }));
    }
  },
  
  markAsRead: (id: string) => {
    set((state) => ({
      logs: state.logs.map(log => 
        log.id === id ? { ...log, read: true } : log
      ),
      unreadCount: state.logs.find(log => log.id === id && !log.read) 
        ? state.unreadCount - 1 
        : state.unreadCount
    }));
  },
  
  markAllAsRead: () => {
    set((state) => ({
      logs: state.logs.map(log => ({ ...log, read: true })),
      unreadCount: 0
    }));
  },
  
  pinLog: (id: string) => {
    set((state) => {
      const logToPin = state.logs.find(log => log.id === id);
      
      if (!logToPin || logToPin.pinned) {
        return state;
      }
      
      const updatedLogs = state.logs.map(log => 
        log.id === id ? { ...log, pinned: true } : log
      );
      
      return {
        logs: updatedLogs,
        pinnedLogs: [...state.pinnedLogs, { ...logToPin, pinned: true }]
      };
    });
  },
  
  unpinLog: (id: string) => {
    set((state) => ({
      logs: state.logs.map(log => 
        log.id === id ? { ...log, pinned: false } : log
      ),
      pinnedLogs: state.pinnedLogs.filter(log => log.id !== id)
    }));
  },
  
  clearLogs: () => {
    set((state) => ({
      logs: state.pinnedLogs,
      unreadCount: state.pinnedLogs.filter(log => !log.read).length
    }));
  },
  
  addToast: (toast: Toast) => {
    set((state) => ({
      toasts: [...state.toasts, toast]
    }));
  },
  
  dismissToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }));
  }
}));

/**
 * A transport that sends logs to the UI
 */
export class UITransport implements LogTransport {
  id: string;
  private minLevel: LogLevel;
  private categories: LogCategory[] | null;

  constructor(id: string = 'ui-transport', minLevel: LogLevel = 'info', categories: LogCategory[] | null = null) {
    this.id = id;
    this.minLevel = minLevel;
    this.categories = categories;
  }

  log(event: LogEvent): void {
    // Check if this category should be logged
    if (
      this.categories !== null && 
      !this.categories.includes(event.category)
    ) {
      return;
    }
    
    // Add the log to the store
    useLogsStore.getState().addLog(event);
  }

  getMinLevel(): LogLevel {
    return this.minLevel;
  }

  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  setCategories(categories: LogCategory[] | null): void {
    this.categories = categories;
  }
}

// Create and export a singleton instance
export const uiTransport = new UITransport();
