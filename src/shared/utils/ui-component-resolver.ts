
/**
 * Helper utility to provide consistent import paths for UI components
 * This allows for more maintainable code by centralizing the component import logic
 * and makes it easier to refactor component paths in the future
 */

// Map from old component paths to new shared paths
const componentPathMap: Record<string, string> = {
  '@/components/ui/alert': '@/shared/ui/alert',
  '@/components/ui/button': '@/shared/ui/button',
  '@/components/ui/card': '@/shared/ui/card',
  '@/components/ui/input': '@/shared/ui/input',
  '@/components/ui/label': '@/shared/ui/label',
  '@/components/ui/textarea': '@/shared/ui/textarea',
  '@/components/ui/switch': '@/shared/ui/switch',
  '@/components/ui/tabs': '@/shared/ui/tabs',
  '@/components/ui/spinner': '@/shared/ui/spinner',
  '@/components/ui/skeleton': '@/shared/ui/skeleton',
  '@/components/ui/badge': '@/shared/ui/badge',
  '@/components/ui/tooltip': '@/shared/ui/tooltip',
  '@/components/ui/toast': '@/shared/ui/toast',
  '@/components/ui/toaster': '@/shared/ui/toaster',
  '@/components/ui/use-toast': '@/shared/ui/use-toast',
};

/**
 * Get the correct import path for a UI component
 * @param oldPath The original component path
 * @returns The correct path to use for imports
 */
export const getComponentPath = (oldPath: string): string => {
  return componentPathMap[oldPath] || oldPath;
};

/**
 * Check if a component should be imported from shared/ui
 * @param path The import path to check
 * @returns boolean indicating if this is a UI component
 */
export const isUiComponent = (path: string): boolean => {
  return path.startsWith('@/components/ui/') || path.startsWith('@/shared/ui/');
};

/**
 * Convert any component path to use the shared UI components
 * @param path The path to convert
 * @returns The corrected path using shared UI
 */
export const toSharedUiPath = (path: string): string => {
  if (path.startsWith('@/components/ui/')) {
    return path.replace('@/components/ui/', '@/shared/ui/');
  }
  return path;
};
