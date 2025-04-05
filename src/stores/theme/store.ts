
import { create } from "zustand";
import { ThemeState } from "./types";
import { Theme, ComponentTokens } from "@/types/theme";
import { getTheme } from "@/services/themeService";
import { getLogger } from "@/logging";
import { LogCategory } from "@/logging";
import { z } from "zod";

// Create a Zod schema for component tokens validation
const componentTokenSchema = z.object({
  id: z.string(),
  component_name: z.string(),
  styles: z.record(z.unknown()),
  description: z.string().optional(),
  theme_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  context: z.string().optional(),
});

// Create a type-safe logger for the theme store
const logger = getLogger('ThemeStore', LogCategory.UI);

export const useThemeStore = create<ThemeState>((set, get) => ({
  currentTheme: null,
  themeTokens: [],
  themeComponents: [],
  adminComponents: [],
  isLoading: false,
  error: null,

  setTheme: async (themeId: string) => {
    set({ isLoading: true, error: null });
    try {
      logger.info('Setting theme', { details: { themeId }});
      
      // We receive a theme ID, fetch the theme
      const { theme: fetchedTheme, isFallback } = await getTheme(themeId);
      
      if (!fetchedTheme || typeof fetchedTheme !== 'object') {
        throw new Error('Invalid theme data received');
      }

      // Validate component tokens with Zod
      const validatedComponentTokens: ComponentTokens[] = [];
      
      if (Array.isArray(fetchedTheme.component_tokens)) {
        for (const token of fetchedTheme.component_tokens) {
          try {
            const validatedToken = componentTokenSchema.parse(token);
            validatedComponentTokens.push(validatedToken);
          } catch (err) {
            logger.warn('Invalid component token found', { details: { token, error: err } });
          }
        }
      }

      // Set the theme in the store with validated component tokens
      set({ 
        currentTheme: { 
          ...fetchedTheme, 
          component_tokens: validatedComponentTokens 
        }, 
        isLoading: false 
      });
      
      logger.info('Theme set successfully', { 
        details: { 
          themeId: fetchedTheme.id, 
          isFallback, 
          componentTokensCount: validatedComponentTokens.length 
        } 
      });
    } catch (error) {
      logger.error("Error fetching theme", { details: error });
      set({ 
        error: error instanceof Error ? error : new Error("Failed to fetch theme"), 
        isLoading: false 
      });
    }
  },

  loadAdminComponents: async () => {
    set({ isLoading: true, error: null });
    try {
      logger.info('Loading admin components');
      
      // Use the theme service to get admin components
      const { theme: adminTheme } = await getTheme();
      
      // Validate and filter admin components
      const validatedAdminComponents: ComponentTokens[] = [];
      
      if (Array.isArray(adminTheme.component_tokens)) {
        for (const token of adminTheme.component_tokens) {
          try {
            const validatedToken = componentTokenSchema.parse(token);
            if (validatedToken.context === 'admin') {
              validatedAdminComponents.push(validatedToken);
            }
          } catch (err) {
            logger.warn('Invalid admin component token found', { details: { token, error: err } });
          }
        }
      }
      
      set({ adminComponents: validatedAdminComponents, isLoading: false });
      logger.info('Admin components loaded', { details: { count: validatedAdminComponents.length } });
    } catch (error) {
      logger.error("Error loading admin components", { details: error });
      set({ 
        error: error instanceof Error ? error : new Error("Failed to load admin components"), 
        isLoading: false 
      });
    }
  }
}));
