
import { create } from 'zustand';
import { LogCategory, LogLevel } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

interface AdminState {
  // UI state
  sidebarOpen: boolean;
  currentSection: string;
  editMode: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setCurrentSection: (section: string) => void;
  toggleEditMode: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial state
  sidebarOpen: true,
  currentSection: 'dashboard',
  editMode: false,
  
  // Actions
  toggleSidebar: () => {
    set(state => ({
      sidebarOpen: !state.sidebarOpen
    }));
    
    logger.log(
      LogLevel.DEBUG, 
      LogCategory.ADMIN, 
      `Sidebar ${get().sidebarOpen ? 'opened' : 'closed'}`
    );
  },
  
  setCurrentSection: (section: string) => {
    set({ currentSection: section });
    
    logger.log(
      LogLevel.DEBUG, 
      LogCategory.ADMIN, 
      `Current section set to ${section}`
    );
  },
  
  toggleEditMode: () => {
    set(state => ({ 
      editMode: !state.editMode 
    }));
    
    logger.log(
      LogLevel.INFO, 
      LogCategory.ADMIN, 
      `Edit mode ${get().editMode ? 'enabled' : 'disabled'}`
    );
  }
}));
