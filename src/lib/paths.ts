
/**
 * Path mapping helper for component imports
 * This helps update import paths across the project
 */

// UI Component path mapping
export const UI_PATHS = {
  // Core UI components
  Button: '@/shared/ui/button',
  Input: '@/shared/ui/input',
  Label: '@/shared/ui/label',
  Textarea: '@/shared/ui/textarea',
  Card: '@/shared/ui/card',
  Badge: '@/shared/ui/badge',
  Avatar: '@/shared/ui/avatar',
  Tabs: '@/shared/ui/tabs',
  Table: '@/shared/ui/table',
  Alert: '@/shared/ui/alert',
  Spinner: '@/shared/ui/spinner',
  Skeleton: '@/shared/ui/skeleton',
  Switch: '@/shared/ui/switch',
  Popover: '@/shared/ui/popover',
  Progress: '@/shared/ui/progress',
  Separator: '@/shared/ui/separator',
  ScrollArea: '@/shared/ui/scroll-area',
  Tooltip: '@/shared/ui/tooltip',
  HoverCard: '@/shared/ui/hover-card',
  Checkbox: '@/shared/ui/checkbox',
  Collapsible: '@/shared/ui/collapsible',
  Calendar: '@/shared/ui/calendar',
  Dialog: '@/shared/ui/dialog',
  RadioGroup: '@/shared/ui/radio-group',
  Slider: '@/shared/ui/slider',
  Toaster: '@/shared/ui/toaster',
  Sonner: '@/shared/ui/sonner',
  Accordion: '@/shared/ui/accordion',
  AspectRatio: '@/shared/ui/aspect-ratio',
};

// Type paths
export const TYPE_PATHS = {
  SharedTypes: '@/shared/types/shared.types',
  AuthTypes: '@/shared/types/auth.types',
  BuildTypes: '@/admin/types/build.types',
  ContentTypes: '@/admin/types/content',
  ThemeTypes: '@/app/theme/types/theme-log',
};

// Use as a helper in file migrations
export function getNewImportPath(oldPath: string): string {
  if (oldPath.startsWith('@/components/ui/')) {
    const componentName = oldPath.replace('@/components/ui/', '');
    const key = componentName.charAt(0).toUpperCase() + componentName.slice(1);
    return UI_PATHS[key as keyof typeof UI_PATHS] || oldPath;
  }
  return oldPath;
}
