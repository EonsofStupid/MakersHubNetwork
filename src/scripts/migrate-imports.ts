
/**
 * Script to migrate imports to the new directory structure
 */

import * as fs from 'fs';
import * as path from 'path';

// Define mappings for import path migrations
export const importPathMappings: Record<string, string> = {
  '@/components/ui/': '@/shared/ui/core/',
  '@/ui/core/': '@/shared/ui/core/',
  '@/ui/hooks/': '@/shared/hooks/',
  '@/components/profile/': '@/app/profile/',
  '@/ui/profile/': '@/app/profile/',
  '@/types/': '@/shared/types/',
  '@/stores/auth/store': '@/auth/store',
  '@/components/theme/': '@/ui/theme/',
  '@/admin/components/': '@/admin/components/',
  '@/hooks/use-toast': '@/shared/hooks/use-toast',
  '@/components/ui/use-toast': '@/shared/hooks/use-toast',
  '@/bridges/AuthBridge': '@/bridges/AuthBridge',
  '@/bridges/ChatBridge': '@/bridges/ChatBridge',
};

/**
 * Process a file to update import paths based on defined mappings
 */
export function processMigrationFile(filePath: string, content: string): string {
  // Skip processing certain files
  const fileName = path.basename(filePath);
  if (fileName === 'migrate-imports.ts') {
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

// Main function to run migration
async function runMigration() {
  const srcDir = path.join(process.cwd(), 'src');
  
  // Process files recursively
  function processDir(dir: string) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        processDir(filePath);
        continue;
      }
      
      if (['.ts', '.tsx', '.js', '.jsx'].some(ext => filePath.endsWith(ext))) {
        console.log(`Processing ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf8');
        const updatedContent = processMigrationFile(filePath, content);
        
        if (content !== updatedContent) {
          console.log(`Updating imports in ${filePath}`);
          fs.writeFileSync(filePath, updatedContent, 'utf8');
        }
      }
    }
  }
  
  processDir(srcDir);
  console.log('Import migration complete!');
}

// Run the migration if this file is executed directly
if (require.main === module) {
  runMigration().catch(console.error);
}
