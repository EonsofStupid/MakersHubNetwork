
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';
import { ThemeContextValue } from '@/admin/types/theme';

// Create a context for each theme scope
const SiteThemeContext = createContext<ThemeContextValue | null>(null);
const AdminThemeContext = createContext<ThemeContextValue | null>(null);
const ChatThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeScope = 'site' | 'admin' | 'chat';

/**
 * Hook to access theme context for different parts of the application
 */
export function useThemeContext(scope: ThemeScope = 'site'): ThemeContextValue {
  const logger = useLogger('useThemeContext', { category: LogCategory.THEME });
  const { currentTheme, isLoading, error } = useThemeStore();
  
  // Select the correct context based on scope
  const contextMap: Record<ThemeScope, React.Context<ThemeContextValue | null>> = {
    site: SiteThemeContext,
    admin: AdminThemeContext,
    chat: ChatThemeContext
  };
  
  const SelectedContext = contextMap[scope];
  const contextValue = useContext(SelectedContext);
  
  if (!contextValue) {
    logger.warn(`Theme context for scope "${scope}" not found or not initialized`);
    
    // Return a fallback value
    return {
      currentTheme: currentTheme,
      isLoading: isLoading,
      error: error || null,
      themeComponents: [],
      themeTokens: [],
      themeValues: {
        primaryColor: 'var(--impulse-primary, #00F0FF)',
        secondaryColor: 'var(--impulse-secondary, #FF2D6E)',
        background: 'var(--impulse-background, #12121A)',
        textColor: 'var(--impulse-text-primary, #F6F6F7)'
      },
      applyTheme: async () => { 
        logger.warn('applyTheme called from fallback theme context');
        return Promise.resolve();
      },
      updateTheme: () => {
        logger.warn('updateTheme called from fallback theme context');
      },
      saveTheme: async () => {
        logger.warn('saveTheme called from fallback theme context');
        return Promise.resolve(false);
      }
    };
  }
  
  return contextValue;
}

/**
 * Provider components for different theme scopes
 */
export function SiteThemeContextProvider({ children }: { children: React.ReactNode }) {
  // ... implementation
  return <SiteThemeContext.Provider value={/* value */}>{children}</SiteThemeContext.Provider>;
}

export function AdminThemeContextProvider({ children }: { children: React.ReactNode }) {
  // ... implementation
  return <AdminThemeContext.Provider value={/* value */}>{children}</AdminThemeContext.Provider>;
}

export function ChatThemeContextProvider({ children }: { children: React.ReactNode }) {
  // ... implementation
  return <ChatThemeContext.Provider value={/* value */}>{children}</ChatThemeContext.Provider>;
}
