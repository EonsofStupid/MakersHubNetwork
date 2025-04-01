
import React, { createContext, useContext, useEffect } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';
import { useTheme } from '@/components/ui/theme-provider';

interface AdminThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  primaryColor: '#00F0FF',
  setPrimaryColor: () => {}
});

export const useAdminTheme = () => useContext(AdminThemeContext);

interface AdminThemeProviderProps {
  children: React.ReactNode;
}

export function AdminThemeProvider({ children }: AdminThemeProviderProps) {
  const { isDarkMode, toggleDarkMode } = useAdminStore();
  const { setTheme } = useTheme();
  const [primaryColor, setPrimaryColor] = React.useState('#00F0FF');
  
  // Sync theme with admin store
  useEffect(() => {
    setTheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, setTheme]);
  
  return (
    <AdminThemeContext.Provider 
      value={{ 
        isDarkMode, 
        toggleDarkMode, 
        primaryColor, 
        setPrimaryColor 
      }}
    >
      {children}
    </AdminThemeContext.Provider>
  );
}

