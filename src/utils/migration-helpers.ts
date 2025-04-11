
/**
 * Import path mapping for migration
 * This maps old import paths to their new locations
 */
export const importPathMappings = {
  // Core UI components
  '@/components/ui/accordion': '@/ui/core/accordion',
  '@/components/ui/alert': '@/ui/core/alert',
  '@/components/ui/alert-dialog': '@/ui/core/alert-dialog',
  '@/components/ui/aspect-ratio': '@/ui/core/aspect-ratio',
  '@/components/ui/avatar': '@/ui/core/avatar',
  '@/components/ui/badge': '@/ui/core/badge',
  '@/components/ui/button': '@/ui/core/button',
  '@/components/ui/calendar': '@/ui/core/calendar',
  '@/components/ui/card': '@/ui/core/card',
  '@/components/ui/checkbox': '@/ui/core/checkbox',
  '@/components/ui/collapsible': '@/ui/core/collapsible',
  '@/components/ui/dialog': '@/ui/core/dialog',
  '@/components/ui/dropdown-menu': '@/ui/core/dropdown-menu',
  '@/components/ui/form': '@/ui/core/form',
  '@/components/ui/hover-card': '@/ui/core/hover-card',
  '@/components/ui/input': '@/ui/core/input',
  '@/components/ui/input-otp': '@/ui/core/input-otp',
  '@/components/ui/label': '@/ui/core/label',
  '@/components/ui/menubar': '@/ui/core/menubar',
  '@/components/ui/navigation-menu': '@/ui/core/navigation-menu',
  '@/components/ui/pagination': '@/ui/core/pagination',
  '@/components/ui/popover': '@/ui/core/popover',
  '@/components/ui/progress': '@/ui/core/progress',
  '@/components/ui/radio-group': '@/ui/core/radio-group',
  '@/components/ui/resizable': '@/ui/core/resizable',
  '@/components/ui/scroll-area': '@/ui/core/scroll-area',
  '@/components/ui/select': '@/ui/core/select',
  '@/components/ui/separator': '@/ui/core/separator',
  '@/components/ui/sheet': '@/ui/core/sheet',
  '@/components/ui/skeleton': '@/ui/core/skeleton',
  '@/components/ui/slider': '@/ui/core/slider',
  '@/components/ui/switch': '@/ui/core/switch',
  '@/components/ui/table': '@/ui/core/table',
  '@/components/ui/tabs': '@/ui/core/tabs',
  '@/components/ui/textarea': '@/ui/core/textarea',
  '@/components/ui/toast': '@/ui/core/toast',
  '@/components/ui/toaster': '@/ui/core/toaster',
  '@/components/ui/toggle': '@/ui/core/toggle',
  '@/components/ui/toggle-group': '@/ui/core/toggle-group',
  '@/components/ui/tooltip': '@/ui/core/tooltip',
  '@/components/ui/use-toast': '@/hooks/use-toast',
  '@/components/ui/data-table': '@/ui/core/data-table',
  '@/components/ui/steps': '@/ui/core/steps',
  '@/components/ui/loading-state': '@/ui/core/loading-state',
  '@/components/ErrorBoundary': '@/ui/core/error-boundary',

  // Theme-related imports
  '@/components/theme/': '@/ui/theme/',
  '@/components/theme/info/ThemeInfoPopup': '@/ui/theme/info/ThemeInfoPopup',
  '@/components/theme/info/ThemeInfoTabs': '@/ui/theme/info/ThemeInfoTabs',
  '@/components/theme/info/ThemeLoadingState': '@/ui/theme/info/ThemeLoadingState',
  '@/components/theme/info/ThemeErrorState': '@/ui/theme/info/ThemeErrorState',
  '@/components/theme/ThemeInitializer': '@/ui/theme/ThemeInitializer',
  '@/components/theme/ThemeComponentPreview': '@/ui/theme/ThemeComponentPreview',
  '@/components/theme/EffectsPreview': '@/ui/theme/EffectsPreview',
  '@/components/theme/info/TextWithPopup': '@/ui/theme/info/TextWithPopup',
  
  // Profile-related imports
  '@/components/profile/': '@/ui/profile/',
  '@/components/profile/ProfileDialog': '@/ui/profile/ProfileDialog',
  
  // Auth-related imports
  '@/components/auth/': '@/auth/components/',
  '@/stores/auth/store': '@/auth/store',
  '@/auth/hooks/useUser': '@/auth/hooks/useUser',
  
  // Admin-related imports
  '@/components/admin/': '@/admin/components/',
  '@/components/admin/dashboard/FeatureCard': '@/admin/components/dashboard/FeatureCard',
  
  // Keyboard navigation
  '@/components/KeyboardNavigation/': '@/ui/keyboard/',
  '../types/navigation.types': '@/ui/keyboard/types/navigation.types'
};

/**
 * Helper function to update import paths in a file's content
 * @param fileContent Original file content
 * @returns Updated file content with correct import paths
 */
export function updateImportPaths(fileContent: string): string {
  let updatedContent = fileContent;
  
  // Process each mapping
  for (const [oldPath, newPath] of Object.entries(importPathMappings)) {
    // Create a regex pattern that matches the import statement for this path
    const importRegex = new RegExp(`import\\s+(.+?)\\s+from\\s+['"]${oldPath}.*?['"]`, 'g');
    
    // Replace all occurrences in the file
    updatedContent = updatedContent.replace(importRegex, `import $1 from '${newPath}'`);
  }
  
  return updatedContent;
}

/**
 * Function to programmatically update files in specific directories
 * @param filePath Path to the file to update
 * @param content Content of the file
 * @returns Updated content
 */
export function processMigrationFile(filePath: string, content: string): string {
  // Skip auto-imports.d.ts as it's auto-generated
  if (filePath.includes('auto-imports.d.ts')) {
    return content;
  }
  
  return updateImportPaths(content);
}
