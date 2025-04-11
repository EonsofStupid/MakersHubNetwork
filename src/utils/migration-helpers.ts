
import * as path from 'path';

// Define mappings for import path migrations
export const importPathMappings: Record<string, string> = {
  '@/components/ui/': '@/shared/ui/core/',
  '@/ui/core/': '@/shared/ui/core/',
  '@/stores/auth/store': '@/auth/store',
  '@/components/theme/': '@/shared/ui/theme/',
  '@/components/profile/': '@/shared/ui/profile/',
  '@/components/admin/': '@/admin/components/',
  '@/layouts/': '@/shared/ui/layouts/',
  '@/hooks/': '@/shared/hooks/',
  '@/hooks/use-toast': '@/shared/hooks/use-toast',
  '@/components/KeyboardNavigation/types/': '@/shared/ui/keyboard/types/',
  '@/auth/hooks/useUser': '@/auth/hooks/useAuth',
  '@/ui/hooks/use-toast': '@/shared/hooks/use-toast',
  '@/components/ui/use-toast': '@/shared/hooks/use-toast'
};

/**
 * Process a file to update import paths based on defined mappings
 */
export function processMigrationFile(filePath: string, content: string): string {
  // Skip processing certain files
  const fileName = path.basename(filePath);
  if (fileName === 'migration-helpers.ts' || fileName === 'run-migration.ts') {
    return content;
  }

  let updatedContent = content;

  // Replace import paths using our mappings
  for (const [oldPath, newPath] of Object.entries(importPathMappings)) {
    const importPattern = new RegExp(`import\\s+(.+?)\\s+from\\s+['"]${escapeRegExp(oldPath)}([^'"]+)['"]`, 'g');
    updatedContent = updatedContent.replace(importPattern, `import $1 from '${newPath}$2'`);

    // Also update dynamic imports
    const dynamicImportPattern = new RegExp(`import\\(['"]${escapeRegExp(oldPath)}([^'"]+)['"]\\)`, 'g');
    updatedContent = updatedContent.replace(dynamicImportPattern, `import('${newPath}$1')`);
  }

  return updatedContent;
}

// Helper to escape special characters in regex
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
