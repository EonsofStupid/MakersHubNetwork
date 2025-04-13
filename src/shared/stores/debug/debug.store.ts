
import { create } from 'zustand';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';

interface DebugState {
  // Debug UI controls
  showDevTools: boolean;
  showAdminOverlay: boolean;
  showLogConsole: boolean;
  showComponentInspector: boolean;
  
  // Logging filters
  logLevelFilter: LogLevel | null;
  logCategoryFilter: LogCategory | null;
  logSourceFilter: string | null;
  logSearchFilter: string;
  
  // Actions for UI controls
  toggleDevTools: () => void;
  toggleAdminOverlay: () => void;
  toggleLogConsole: () => void;
  toggleComponentInspector: () => void;
  
  // Actions for filters
  setLogLevelFilter: (level: LogLevel | null) => void;
  setLogCategoryFilter: (category: LogCategory | null) => void;
  setLogSourceFilter: (source: string | null) => void;
  setLogSearchFilter: (search: string) => void;
  clearFilters: () => void;
}

export const useDebugStore = create<DebugState>((set) => ({
  // Debug UI controls
  showDevTools: false,
  showAdminOverlay: false,
  showLogConsole: false,
  showComponentInspector: false,
  
  // Logging filters
  logLevelFilter: null,
  logCategoryFilter: null,
  logSourceFilter: null,
  logSearchFilter: '',
  
  // Actions for UI controls
  toggleDevTools: () => set((state) => ({ showDevTools: !state.showDevTools })),
  toggleAdminOverlay: () => set((state) => ({ showAdminOverlay: !state.showAdminOverlay })),
  toggleLogConsole: () => set((state) => ({ showLogConsole: !state.showLogConsole })),
  toggleComponentInspector: () => set((state) => ({ showComponentInspector: !state.showComponentInspector })),
  
  // Actions for filters
  setLogLevelFilter: (level) => set({ logLevelFilter: level }),
  setLogCategoryFilter: (category) => set({ logCategoryFilter: category }),
  setLogSourceFilter: (source) => set({ logSourceFilter: source }),
  setLogSearchFilter: (search) => set({ logSearchFilter: search }),
  clearFilters: () => set({
    logLevelFilter: null,
    logCategoryFilter: null,
    logSourceFilter: null,
    logSearchFilter: ''
  })
}));
