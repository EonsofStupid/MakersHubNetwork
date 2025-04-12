
import { create } from 'zustand';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

interface DebugStore {
  // Debug mode
  isDebugMode: boolean;
  toggleDebugMode: () => void;
  setDebugMode: (isEnabled: boolean) => void;
  
  // Alt key state for inspection
  isAltPressed: boolean;
  setAltPressed: (isPressed: boolean) => void;
  
  // Inspector visibility
  isInspectorVisible: boolean;
  setInspectorVisible: (isVisible: boolean) => void;
  
  // Currently hovered/selected element
  hoveredElement: HTMLElement | null;
  setHoveredElement: (element: HTMLElement | null) => void;
  
  // Selected component for inspection
  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;
}

export const useDebugStore = create<DebugStore>((set, get) => ({
  isDebugMode: false,
  toggleDebugMode: () => {
    const newState = !get().isDebugMode;
    logger.log(
      LogLevel.INFO,
      `Debug mode ${newState ? 'enabled' : 'disabled'}`,
      LogCategory.SYSTEM,
      { 
        timestamp: new Date().toISOString(),
        details: { mode: 'debug' } 
      }
    );
    set({ isDebugMode: newState });
  },
  setDebugMode: (isEnabled) => {
    logger.log(
      LogLevel.INFO,
      `Debug mode ${isEnabled ? 'enabled' : 'disabled'}`,
      LogCategory.SYSTEM,
      { 
        timestamp: new Date().toISOString(),
        details: { mode: 'debug', explicit: true } 
      }
    );
    set({ isDebugMode: isEnabled });
  },
  
  isAltPressed: false,
  setAltPressed: (isPressed) => set({ isAltPressed: isPressed }),
  
  isInspectorVisible: false,
  setInspectorVisible: (isVisible) => set({ isInspectorVisible: isVisible }),
  
  hoveredElement: null,
  setHoveredElement: (element) => set({ hoveredElement: element }),
  
  selectedComponentId: null,
  setSelectedComponentId: (id) => set({ selectedComponentId: id })
}));
