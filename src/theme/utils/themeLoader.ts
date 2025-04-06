
import { Theme } from "@/types/theme";
import { useThemeStore } from '@/stores/theme/store';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

// Helper to check if a string is a valid UUID
function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Safely load a theme by id, falling back to name lookup if it's not a UUID
 */
export async function loadThemeByIdOrName(themeIdOrName: string): Promise<Theme | null> {
  const logger = getLogger('ThemeLoader', LogCategory.UI);
  
  try {
    const { loadThemeById, loadThemeByName } = useThemeStore.getState();
    
    // Check if the id is a UUID or a name
    if (isValidUUID(themeIdOrName)) {
      // If it's a valid UUID, load by ID
      return await loadThemeById(themeIdOrName);
    } else {
      // If it's not a valid UUID, treat as a name
      logger.info(`Loading theme by name: ${themeIdOrName}`);
      return await loadThemeByName(themeIdOrName);
    }
  } catch (error) {
    logger.error('Error loading theme', { 
      details: { 
        message: error instanceof Error ? error.message : String(error),
        themeIdOrName 
      }
    });
    return null;
  }
}

/**
 * Ensures a theme is loaded and applied correctly
 */
export async function ensureThemeLoaded(themeIdentifier: string): Promise<boolean> {
  const logger = getLogger('ThemeLoader', LogCategory.UI);
  
  try {
    const { setTheme, currentTheme } = useThemeStore.getState();
    
    // If theme is already loaded with this ID, no need to reload
    if (currentTheme?.id === themeIdentifier || currentTheme?.name === themeIdentifier) {
      return true;
    }
    
    // Try loading the theme
    const theme = await loadThemeByIdOrName(themeIdentifier);
    
    if (theme) {
      await setTheme(theme.id);
      return true;
    } else {
      logger.warn(`Theme not found: ${themeIdentifier}, falling back to default`);
      const { loadDefaultTheme } = useThemeStore.getState();
      await loadDefaultTheme();
      return true; // Return true since we fell back to default theme
    }
  } catch (error) {
    logger.error('Failed to ensure theme loaded', { 
      details: { 
        message: error instanceof Error ? error.message : String(error),
        themeIdentifier 
      }
    });
    return false;
  }
}
