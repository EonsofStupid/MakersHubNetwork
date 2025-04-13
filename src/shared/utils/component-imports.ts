
/**
 * Utility functions to handle component imports consistently
 * and support migration from @/components/ui to @/shared/ui
 */

// Map to redirect old imports
const importRedirectMap: Record<string, string> = {
  '@/components/ui/button': '@/shared/ui/button',
  '@/components/ui/card': '@/shared/ui/card',
  '@/components/ui/input': '@/shared/ui/input',
  '@/components/ui/label': '@/shared/ui/label',
  '@/components/ui/textarea': '@/shared/ui/textarea',
  '@/components/ui/select': '@/shared/ui/select',
  '@/components/ui/tooltip': '@/shared/ui/tooltip',
  '@/components/ui/badge': '@/shared/ui/badge',
  '@/components/ui/tabs': '@/shared/ui/tabs',
  '@/components/ui/avatar': '@/shared/ui/avatar',
  '@/components/ui/spinner': '@/shared/ui/spinner',
  '@/components/ui/skeleton': '@/shared/ui/skeleton',
  '@/components/ui/progress': '@/shared/ui/progress',
  '@/components/ui/switch': '@/shared/ui/switch',
  '@/components/ui/checkbox': '@/shared/ui/checkbox',
  '@/components/ui/scroll-area': '@/shared/ui/scroll-area',
  '@/components/ui/accordion': '@/shared/ui/accordion',
  '@/components/ui/alert': '@/shared/ui/alert',
  '@/components/ui/alert-dialog': '@/shared/ui/alert-dialog',
  '@/components/ui/toast': '@/shared/ui/toast',
  '@/components/ui/toaster': '@/shared/ui/toaster',
  '@/components/ui/use-toast': '@/shared/ui/use-toast',
  '@/components/ui/dialog': '@/shared/ui/dialog',
  '@/components/ui/hover-card': '@/shared/ui/hover-card',
  '@/components/ui/popover': '@/shared/ui/popover',
  '@/components/ui/sheet': '@/shared/ui/sheet',
  '@/components/ui/table': '@/shared/ui/table',
  '@/components/ui/navigation-menu': '@/shared/ui/navigation-menu',
  '@/components/ui/form': '@/shared/ui/form',
  '@/components/ui/radio-group': '@/shared/ui/radio-group',
  '@/components/ui/separator': '@/shared/ui/separator',
  '@/components/ui/slider': '@/shared/ui/slider',
  '@/components/ui/breadcrumb': '@/shared/ui/breadcrumb',
  '@/components/ui/pagination': '@/shared/ui/pagination',
};

/**
 * Get the correct import path for UI components
 * @param oldPath Original import path
 * @returns The correct path to use for imports
 */
export function getComponentImportPath(oldPath: string): string {
  return importRedirectMap[oldPath] || oldPath;
}

/**
 * Determines if a path is for a UI component
 */
export function isUiComponent(path: string): boolean {
  return path.startsWith('@/components/ui/') || path.startsWith('@/shared/ui/');
}

/**
 * Extracts component name from an import path
 */
export function getComponentName(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1];
}
