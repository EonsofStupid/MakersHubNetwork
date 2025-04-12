
import { create } from 'zustand';
import { LogCategory } from '@/shared/types/shared.types';
import { loggingBridge } from '@/logging/bridge';

export interface DebugState {
  // Debug mode flags
  isDebugMode: boolean;
  isInspectorVisible: boolean;
  hoveredElement: HTMLElement | null;
  isAltPressed: boolean;
  
  // Actions
  setDebugMode: (value: boolean) => void;
  toggleDebugMode: () => void;
  setInspectorVisible: (value: boolean) => void;
  setHoveredElement: (element: HTMLElement | null) => void;
  setAltPressed: (value: boolean) => void;
}

export const useDebugStore = create<DebugState>((set, get) => ({
  // State
  isDebugMode: false,
  isInspectorVisible: false,
  hoveredElement: null,
  isAltPressed: false,
  
  // Actions
  setDebugMode: (value) => {
    set({ isDebugMode: value });
    // Log debug mode state change
    loggingBridge.log({
      id: crypto.randomUUID(),
      level: 'info',
      message: `Debug mode ${value ? 'enabled' : 'disabled'}`,
      timestamp: Date.now(),
      source: 'DebugStore',
      category: LogCategory.ADMIN,
      details: { newState: value }
    });
  },
  
  toggleDebugMode: () => {
    const newState = !get().isDebugMode;
    set({ isDebugMode: newState });
    // Log debug mode toggle
    loggingBridge.log({
      id: crypto.randomUUID(),
      level: 'info',
      message: `Debug mode toggled to ${newState ? 'enabled' : 'disabled'}`,
      timestamp: Date.now(),
      source: 'DebugStore',
      category: LogCategory.ADMIN,
      details: { newState }
    });
  },
  
  setInspectorVisible: (value) => set({ isInspectorVisible: value }),
  setHoveredElement: (element) => set({ hoveredElement: element }),
  setAltPressed: (value) => set({ isAltPressed: value }),
}));
