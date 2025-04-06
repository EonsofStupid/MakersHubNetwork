
import { Theme } from "@/types/theme";
import { useThemeStore } from '@/stores/theme/store';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

// Helper to check if a string is a valid UUID
function isValidUUID(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Safely load a theme by id, falling back to name lookup if it's not a UUID
 */
export async function loadThemeByIdOrName(themeIdOrName: string): Promise<Theme | null> {
  const logger = getLogger('ThemeLoader', LogCategory.UI);
  
  try {
    // Input validation
    if (!themeIdOrName) {
      logger.warn('Empty theme identifier provided');
      return null;
    }
    
    const { setTheme, currentTheme } = useThemeStore.getState();
    
    logger.info(`Attempting to load theme: ${themeIdOrName}`, {
      details: {
        isUuid: isValidUUID(themeIdOrName),
        lookupType: isValidUUID(themeIdOrName) ? 'by-uuid' : 'by-name'
      }
    });
    
    // Attempt to load the theme - internally setTheme now handles both UUIDs and names
    await setTheme(themeIdOrName);
    
    // Check if theme was loaded
    const loadedTheme = useThemeStore.getState().currentTheme;
    
    if (loadedTheme) {
      logger.info(`Theme loaded successfully: ${loadedTheme.name}`, {
        details: { 
          id: loadedTheme.id, 
          name: loadedTheme.name,
          wasFoundByName: loadedTheme.name === themeIdOrName && !isValidUUID(themeIdOrName)
        }
      });
    } else {
      logger.warn(`Failed to load theme: ${themeIdOrName}`);
    }
    
    return loadedTheme;
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
 * Ensures a theme is loaded and applied correctly, with no dependency on authentication
 */
export async function ensureThemeLoaded(themeIdentifier: string): Promise<boolean> {
  const logger = getLogger('ThemeLoader', LogCategory.UI);
  
  try {
    const { setTheme, currentTheme } = useThemeStore.getState();
    
    // If theme is already loaded with this ID or name, no need to reload
    if (
      currentTheme?.id === themeIdentifier || 
      currentTheme?.name === themeIdentifier
    ) {
      logger.info(`Theme already loaded: ${currentTheme.name}`);
      return true;
    }
    
    // Try loading the theme - by UUID or name
    logger.info(`Ensuring theme is loaded: ${themeIdentifier}`);
    await setTheme(themeIdentifier);
    const loadedTheme = useThemeStore.getState().currentTheme;
    
    if (loadedTheme) {
      logger.info(`Successfully loaded theme: ${loadedTheme.name}`);
      return true;
    } else {
      logger.warn(`Theme not found: ${themeIdentifier}, falling back to default`);
      // Load a default theme as fallback - using a hardcoded name that should exist
      await setTheme('Impulsivity');
      return useThemeStore.getState().currentTheme !== null;
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
