
// Create a simple re-export file to properly expose the theme store
export * from './themeStore';

// Export the themeStore as default for easier access
import { useThemeStore } from './themeStore';
export default useThemeStore;
