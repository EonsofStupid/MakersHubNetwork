
import { create } from 'zustand';

interface DebugStore {
  // General debug mode
  isDebugMode: boolean;
  toggleDebugMode: () => void;
  
  // Admin overlay
  showAdminOverlay: boolean;
  toggleAdminOverlay: () => void;
  
  // Component inspection
  isAltPressed: boolean;
  setAltPressed: (value: boolean) => void;
  isInspectorVisible: boolean;
  setInspectorVisible: (value: boolean) => void;
  hoveredElement: HTMLElement | null;
  setHoveredElement: (element: HTMLElement | null) => void;
}

export const useDebugStore = create<DebugStore>((set) => ({
  // General debug mode
  isDebugMode: false,
  toggleDebugMode: () => set(state => ({ isDebugMode: !state.isDebugMode })),
  
  // Admin overlay
  showAdminOverlay: false,
  toggleAdminOverlay: () => set(state => ({ showAdminOverlay: !state.showAdminOverlay })),
  
  // Component inspection
  isAltPressed: false,
  setAltPressed: (value) => set({ isAltPressed: value }),
  isInspectorVisible: false,
  setInspectorVisible: (value) => set({ isInspectorVisible: value }),
  hoveredElement: null,
  setHoveredElement: (element) => set({ hoveredElement: element }),
}));
