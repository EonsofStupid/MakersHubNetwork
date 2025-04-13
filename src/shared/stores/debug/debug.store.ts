import { create } from 'zustand';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';

interface DebugState {
  isDebugMode: boolean;
  isLoggerEnabled: boolean;
  minimumLogLevel: LogLevel;
  debugPanelVisible: boolean;
  debugEvents: any[];
  
  // Actions
  toggleDebugMode: () => void;
  toggleLogger: () => void;
  setMinimumLogLevel: (level: LogLevel) => void;
  toggleDebugPanel: () => void;
  addDebugEvent: (event: any) => void;
  clearDebugEvents: () => void;
}

export const useDebugStore = create<DebugState>((set) => ({
  isDebugMode: false,
  isLoggerEnabled: true,
  minimumLogLevel: 'debug',
  debugPanelVisible: false,
  debugEvents: [],
  
  toggleDebugMode: () => set((state) => ({ isDebugMode: !state.isDebugMode })),
  
  toggleLogger: () => set((state) => ({ isLoggerEnabled: !state.isLoggerEnabled })),
  
  setMinimumLogLevel: (level: LogLevel) => set(() => ({ minimumLogLevel: level })),
  
  toggleDebugPanel: () => set((state) => ({ debugPanelVisible: !state.debugPanelVisible })),
  
  addDebugEvent: (event: any) => set((state) => {
    const timestamp = Date.now();
    const newEvent = {
      id: `event-${timestamp}`,
      timestamp: timestamp.toString(),
      level: "debug" as LogLevel,
      category: LogCategory.DEFAULT,
      ...event
    };
    
    // Keep max 100 events
    const events = [newEvent, ...state.debugEvents].slice(0, 100);
    return { debugEvents: events };
  }),
  
  clearDebugEvents: () => set({ debugEvents: [] }),
}));

// Log event creator helper
export const createDebugEvent = (category: LogCategory, message: string, details?: Record<string, any>) => ({
  level: "debug" as LogLevel,
  message,
  category,
  timestamp: Date.now().toString(),
  details,
});

// Shortcut for system events
export const createSystemEvent = (message: string, details?: Record<string, any>) => 
  createDebugEvent(LogCategory.SYSTEM, message, details);
