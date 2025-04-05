
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAtom } from "jotai";
import { 
  adminEditModeAtom, 
  adminDebugModeAtom,
  selectedComponentAtom,
  altKeyPressedAtom
} from "@/admin/atoms/tools.atoms";
import { AdminDebugPanel } from "@/admin/components/debug/AdminDebugPanel";
import { useAdminAccess } from "@/hooks/useAdminAccess";

interface DebugContextType {
  isEditMode: boolean;
  isDebugMode: boolean;
  selectedComponent: string | null;
  altKeyPressed: boolean;
  setEditMode: (value: boolean) => void;
  setDebugMode: (value: boolean) => void;
  setSelectedComponent: (id: string | null) => void;
}

const DebugContext = createContext<DebugContextType>({
  isEditMode: false,
  isDebugMode: false,
  selectedComponent: null,
  altKeyPressed: false,
  setEditMode: () => {},
  setDebugMode: () => {},
  setSelectedComponent: () => {}
});

export const useDebugContext = () => useContext(DebugContext);

export const DebugProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditMode, setEditMode] = useAtom(adminEditModeAtom);
  const [isDebugMode, setDebugMode] = useAtom(adminDebugModeAtom);
  const [selectedComponent, setSelectedComponent] = useAtom(selectedComponentAtom);
  const [altKeyPressed, setAltKeyPressed] = useAtom(altKeyPressedAtom);
  const { hasAdminAccess } = useAdminAccess();
  
  // Track alt key for special interactions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setAltKeyPressed(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setAltKeyPressed(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setAltKeyPressed]);
  
  // Reset edit mode when navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isEditMode) {
        setEditMode(false);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isEditMode, setEditMode]);
  
  return (
    <DebugContext.Provider
      value={{
        isEditMode,
        isDebugMode,
        selectedComponent,
        altKeyPressed,
        setEditMode,
        setDebugMode,
        setSelectedComponent
      }}
    >
      {children}
      {hasAdminAccess && <AdminDebugPanel />}
    </DebugContext.Provider>
  );
};
