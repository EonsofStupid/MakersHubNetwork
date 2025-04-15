
import { create } from 'zustand';
import { AuthStatus } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';
import { LogCategory } from '@/shared/types/shared.types';

interface InitState {
  isInitializing: boolean;
  progress: number;
  error: Error | null;
  isSystemReady: boolean;
  authStatus: AuthStatus;
  
  // Actions
  startInit: () => void;
  setProgress: (progress: number) => void;
  setError: (error: Error | null) => void;
  completeInit: () => void;
  setAuthStatus: (status: AuthStatus) => void;
}

export const useInitStore = create<InitState>((set) => ({
  isInitializing: true,
  progress: 0,
  error: null,
  isSystemReady: false,
  authStatus: AuthStatus.IDLE,
  
  startInit: () => set({ isInitializing: true, progress: 0, error: null }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error, isInitializing: false }),
  completeInit: () => set({ isInitializing: false, isSystemReady: true, progress: 100 }),
  setAuthStatus: (status) => set({ authStatus: status })
}));
