
import fs from 'fs';
import path from 'path';
import { importPathMappings, processMigrationFile } from './migration-helpers';

/**
 * Recursively process files in a directory
 * @param dir Directory to process
 */
function processDirectory(dir: string) {
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
      
      // Process content
      const updatedContent = processMigrationFile(filePath, content);
      
      // Write back if changed
      if (content !== updatedContent) {
        console.log(`Updating imports in: ${filePath}`);
        fs.writeFileSync(filePath, updatedContent, 'utf8');
      }
    }
  }
}

// Start processing from src directory
console.log('Starting import path migration...');
processDirectory(path.join(process.cwd(), 'src'));
console.log('Import path migration complete!');

// Output migration summary
console.log('\nMigration paths used:');
for (const [oldPath, newPath] of Object.entries(importPathMappings)) {
  console.log(`  ${oldPath} -> ${newPath}`);
}
