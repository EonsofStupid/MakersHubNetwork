
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Import path mappings from old to new
const importPathMappings = {
  '@/components/ui/': '@/shared/ui/core/',
  '@/components/theme/': '@/shared/ui/theme/',
  '@/components/profile/': '@/shared/ui/profile/',
  '@/components/KeyboardNavigation/': '@/shared/ui/keyboard/',
  '@/ui/': '@/shared/ui/',
  '@/components/admin/': '@/admin/components/',
  '@/stores/auth/store': '@/auth/store',
  '@/layouts/': '@/shared/ui/layouts/',
};

// Function to recursively process all files in a directory
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules
      if (file === 'node_modules') continue;
      processDirectory(filePath);
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
      // Skip auto-imports.d.ts
      if (file === 'auto-imports.d.ts') continue;
      
      // Read file content
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Replace import paths
      let updatedContent = content;
      for (const [oldPath, newPath] of Object.entries(importPathMappings)) {
        const importPattern = new RegExp(`import\\s+(.+?)\\s+from\\s+['"]${escapeRegExp(oldPath)}([^'"]+)['"]`, 'g');
        updatedContent = updatedContent.replace(importPattern, `import $1 from '${newPath}$2'`);
        
        // Also update dynamic imports
        const dynamicImportPattern = new RegExp(`import\\(['"]${escapeRegExp(oldPath)}([^'"]+)['"]\\)`, 'g');
        updatedContent = updatedContent.replace(dynamicImportPattern, `import('${newPath}$1')`);
      }
      
      // Handle specific import fixes for AuthBridge and ChatBridge
      updatedContent = updatedContent.replace(/import\s+\{\s*AuthBridge\s*\}/g, 'import { authBridge as AuthBridge }');
      updatedContent = updatedContent.replace(/import\s+\{\s*ChatBridge\s*\}/g, 'import { chatBridge as ChatBridge }');
      
      // Write back the updated content if changed
      if (content !== updatedContent) {
        console.log(`Updating imports in: ${filePath}`);
        fs.writeFileSync(filePath, updatedContent, 'utf8');
      }
    }
  }
}

// Helper to escape special characters in regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Start processing from src directory
console.log('Starting import path migration...');
processDirectory(path.resolve(__dirname, '..'));
console.log('Import path migration complete!');
