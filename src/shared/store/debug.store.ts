
import { create } from 'zustand';
import { logger } from '@/logging/logger.service';
import { LogLevel, LogCategory } from '@/shared/types/shared.types';

// Debug store state interface
interface DebugState {
  isDebugMode: boolean;
  errorReporting: boolean;
  verboseLogging: boolean;
  consoleOutput: boolean;
  devFeatures: boolean;
  
  // Actions
  toggleDebugMode: () => void;
  setErrorReporting: (enabled: boolean) => void;
  setVerboseLogging: (enabled: boolean) => void;
  setConsoleOutput: (enabled: boolean) => void;
  setDevFeatures: (enabled: boolean) => void;
  resetDebugSettings: () => void;
}

// Create the debug store
export const useDebugStore = create<DebugState>((set, get) => ({
  // Initial state
  isDebugMode: false,
  errorReporting: true,
  verboseLogging: false,
  consoleOutput: true,
  devFeatures: false,
  
  // Toggle debug mode
  toggleDebugMode: () => {
    set(state => {
      const newDebugMode = !state.isDebugMode;
      
      // Log the debug mode change
      logger.log(
        LogLevel.INFO, 
        LogCategory.DEBUG, 
        newDebugMode ? "Debug mode enabled" : "Debug mode disabled"
      );
      
      return { isDebugMode: newDebugMode };
    });
  },
  
  // Set error reporting
  setErrorReporting: (enabled: boolean) => {
    set({ errorReporting: enabled });
    
    // Log the error reporting change
    logger.log(
      LogLevel.INFO, 
      LogCategory.DEBUG, 
      `Error reporting ${enabled ? 'enabled' : 'disabled'}`
    );
  },
  
  // Set verbose logging
  setVerboseLogging: (enabled: boolean) => {
    set({ verboseLogging: enabled });
    
    // Set the log level based on verbose setting
    logger.setLevel(enabled ? LogLevel.DEBUG : LogLevel.INFO);
    
    // Log the verbose logging change
    logger.log(
      LogLevel.INFO, 
      LogCategory.DEBUG, 
      `Verbose logging ${enabled ? 'enabled' : 'disabled'}`
    );
  },
  
  // Set console output
  setConsoleOutput: (enabled: boolean) => {
    set({ consoleOutput: enabled });
  },
  
  // Set developer features
  setDevFeatures: (enabled: boolean) => {
    set({ devFeatures: enabled });
  },
  
  // Reset debug settings
  resetDebugSettings: () => {
    set({
      isDebugMode: false,
      errorReporting: true,
      verboseLogging: false,
      consoleOutput: true,
      devFeatures: false
    });
    
    // Log the debug settings reset
    logger.log(
      LogLevel.INFO, 
      LogCategory.DEBUG, 
      "Debug settings reset to defaults"
    );
  }
}));
