
import { create } from 'zustand';
import { AuthStatus } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';
import { LogCategory, LogLevel } from '@/shared/types/shared.types';

interface InitState {
  isInitializing: boolean;
  progress: number;
  error: Error | null;
  isSystemReady: boolean;
  authStatus: AuthStatus;
  startTime: number;
  initPhase: string;
  
  // Actions
  startInit: () => void;
  setProgress: (progress: number, phase: string) => void;
  setError: (error: Error | null) => void;
  completeInit: () => void;
  setAuthStatus: (status: AuthStatus) => void;
}

export const useInitStore = create<InitState>((set, get) => ({
  isInitializing: true,
  progress: 0,
  error: null,
  isSystemReady: false,
  authStatus: AuthStatus.IDLE,
  startTime: 0,
  initPhase: '',
  
  startInit: () => {
    const startTime = performance.now();
    logger.log(LogLevel.INFO, LogCategory.SYSTEM, "Starting system initialization", {
      timestamp: startTime
    });
    
    set({ 
      isInitializing: true, 
      progress: 0, 
      error: null, 
      startTime, 
      initPhase: 'Starting system bootstrap' 
    });
  },
  
  setProgress: (progress, phase) => {
    logger.log(LogLevel.INFO, LogCategory.SYSTEM, `Initialization progress: ${progress}%`, {
      phase,
      progress,
      elapsedMs: performance.now() - get().startTime
    });
    
    set({ progress, initPhase: phase });
  },
  
  setError: (error) => {
    if (error) {
      logger.log(LogLevel.ERROR, LogCategory.SYSTEM, "System initialization failed", {
        error: error.message,
        stack: error.stack,
        elapsedMs: performance.now() - get().startTime
      });
    }
    
    set({ error, isInitializing: false });
  },
  
  completeInit: () => {
    const elapsedMs = performance.now() - get().startTime;
    logger.log(LogLevel.SUCCESS, LogCategory.SYSTEM, "System initialization complete", {
      elapsedMs,
      totalPhases: 5 // Update this as phases are added
    });
    
    set({ 
      isInitializing: false, 
      isSystemReady: true, 
      progress: 100,
      initPhase: 'System ready'
    });
  },
  
  setAuthStatus: (status) => {
    logger.log(LogLevel.INFO, LogCategory.AUTH, `Auth status changed: ${status}`, {
      previousStatus: get().authStatus
    });
    
    set({ authStatus: status });
  }
}));
