
// Create a simple re-export file to properly expose the theme store
export * from './themeStore';

// Export the default import for easier access
import { default as themeStore } from './themeStore';
export default themeStore;
