
import { useCallback, useState, useEffect } from 'react';
import { useLocalStorage } from '@/shared/hooks/use-local-storage';

interface AdminSidebarState {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

/**
 * Hook for managing the admin sidebar state
 */
export function useAdminSidebar(): AdminSidebarState {
  const [storedIsOpen, setStoredIsOpen] = useLocalStorage<boolean>('adminSidebarOpen', true);
  const [isOpen, setIsOpen] = useState<boolean>(storedIsOpen);
  
  // Update local storage when state changes
  useEffect(() => {
    setStoredIsOpen(isOpen);
  }, [isOpen, setStoredIsOpen]);
  
  // Toggle sidebar
  const toggle = useCallback(() => {
    setIsOpen(current => !current);
  }, []);
  
  // Open sidebar
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);
  
  // Close sidebar
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    toggle,
    open,
    close
  };
}
