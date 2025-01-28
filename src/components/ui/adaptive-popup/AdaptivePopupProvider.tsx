import React, { createContext, useContext, useCallback, useState } from "react";

interface PopupContextType {
  openPopup: (id: string) => void;
  closePopup: (id: string) => void;
  isPopupOpen: (id: string) => boolean;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export function AdaptivePopupProvider({ children }: { children: React.ReactNode }) {
  const [openPopups, setOpenPopups] = useState<Set<string>>(new Set());

  const openPopup = useCallback((id: string) => {
    setOpenPopups(prev => new Set(prev).add(id));
  }, []);

  const closePopup = useCallback((id: string) => {
    setOpenPopups(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const isPopupOpen = useCallback((id: string) => {
    return openPopups.has(id);
  }, [openPopups]);

  return (
    <PopupContext.Provider value={{ openPopup, closePopup, isPopupOpen }}>
      {children}
    </PopupContext.Provider>
  );
}

export const usePopupContext = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopupContext must be used within an AdaptivePopupProvider");
  }
  return context;
};