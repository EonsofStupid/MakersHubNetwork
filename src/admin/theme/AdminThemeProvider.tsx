
import React, { createContext, useContext, useEffect, useState } from "react";
import { useThemeStore } from "@/stores/theme/store";
import { useToast } from "@/hooks/use-toast";
import { ThemeContextValue, ThemeProviderProps } from "../types/theme";
import { ImpulseTheme } from "../types/impulse.types";
import { defaultImpulseTokens } from "./impulse/tokens";
import { deepMerge } from "./utils/themeUtils";
import { Theme } from "@/types/theme";
import "./impulse/impulse-admin.css";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AdminThemeProvider({ children, defaultThemeId }: ThemeProviderProps) {
  const { currentTheme, isLoading, error, setTheme } = useThemeStore();
  const [impulseTheme, setImpulseTheme] = useState<ImpulseTheme>(defaultImpulseTokens);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load theme from database or use defaults
  useEffect(() => {
    const loadInitialTheme = async () => {
      try {
        await setTheme(defaultThemeId || "");
      } catch (err) {
        console.error("Failed to load initial theme:", err);
      }
    };

    loadInitialTheme();
  }, [defaultThemeId, setTheme]);

  // When the theme from the store changes, extract the admin-specific tokens
  useEffect(() => {
    if (currentTheme && !isLoading) {
      try {
        // Try to extract admin-specific tokens
        const adminTokens = currentTheme.design_tokens?.admin as Partial<ImpulseTheme>;
        
        if (adminTokens) {
          // Deep merge with defaults, preferring database values
          const mergedTheme = deepMerge(defaultImpulseTokens, adminTokens);
          setImpulseTheme(mergedTheme);
        } else {
          // If no admin tokens found, use defaults
          setImpulseTheme(defaultImpulseTokens);
        }
      } catch (err) {
        console.error("Error parsing theme:", err);
        // Fallback to defaults
        setImpulseTheme(defaultImpulseTokens);
      }
    }
  }, [currentTheme, isLoading]);

  // Apply theme to the document
  useEffect(() => {
    const applyTokensToDocument = () => {
      if (!impulseTheme) return;
      
      // Apply colors
      document.documentElement.style.setProperty('--impulse-primary', impulseTheme.colors.primary);
      document.documentElement.style.setProperty('--impulse-secondary', impulseTheme.colors.secondary);
      document.documentElement.style.setProperty('--impulse-bg-main', impulseTheme.colors.background.main);
      document.documentElement.style.setProperty('--impulse-bg-card', impulseTheme.colors.background.card);
      document.documentElement.style.setProperty('--impulse-bg-overlay', impulseTheme.colors.background.overlay);
      
      // Apply text colors
      document.documentElement.style.setProperty('--impulse-text-primary', impulseTheme.colors.text.primary);
      document.documentElement.style.setProperty('--impulse-text-secondary', impulseTheme.colors.text.secondary);
      document.documentElement.style.setProperty('--impulse-text-accent', impulseTheme.colors.text.accent);
      
      // Apply borders
      document.documentElement.style.setProperty('--impulse-border-normal', impulseTheme.colors.borders.normal);
      document.documentElement.style.setProperty('--impulse-border-hover', impulseTheme.colors.borders.hover);
      document.documentElement.style.setProperty('--impulse-border-active', impulseTheme.colors.borders.active);
      
      // Apply effects
      document.documentElement.style.setProperty('--impulse-glow-primary', impulseTheme.effects.glow.primary);
      document.documentElement.style.setProperty('--impulse-glow-secondary', impulseTheme.effects.glow.secondary);
      document.documentElement.style.setProperty('--impulse-blur-bg', impulseTheme.effects.blur.background);
    };
    
    applyTokensToDocument();
  }, [impulseTheme]);

  // Update theme with partial changes
  const updateTheme = (updates: Partial<ImpulseTheme>) => {
    setImpulseTheme(prev => {
      const newTheme = deepMerge(prev, updates);
      setIsDirty(true);
      return newTheme;
    });
  };

  // Apply a theme by ID
  const applyTheme = async (themeId: string) => {
    await setTheme(themeId);
  };

  // Save current theme to database
  const saveTheme = async () => {
    try {
      setIsSaving(true);
      
      if (!currentTheme?.id) {
        throw new Error("No theme found to update");
      }
      
      toast({
        title: "Theme saved",
        description: "Admin theme has been updated"
      });
      
      setIsDirty(false);
    } catch (err) {
      console.error("Error saving theme:", err);
      toast({
        title: "Error saving theme",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default theme
  const resetTheme = () => {
    setImpulseTheme(defaultImpulseTokens);
    setIsDirty(true);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme: currentTheme ? { ...currentTheme, impulse: impulseTheme } : null,
        isLoading,
        error,
        applyTheme,
        updateTheme,
        saveTheme,
        resetTheme,
        isDirty,
        isSaving
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useAdminTheme must be used within an AdminThemeProvider");
  }
  return context;
}
