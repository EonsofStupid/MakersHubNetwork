
// This is a helper file to make importing UI components easier
// and to avoid import errors when switching between @/components/ui and @/shared/ui

// Re-export everything from @/shared/ui
export * from '@/shared/ui';

// Helper to redirect old imports to new imports
export const getUIImport = (oldPath: string): string => {
  const componentName = oldPath.replace('@/components/ui/', '');
  return `@/shared/ui/${componentName}`;
};
