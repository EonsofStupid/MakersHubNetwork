
import fs from 'fs';
import path from 'path';
import { importPathMappings, processMigrationFile } from '../utils/migration-helpers';

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

/**
 * Run the import migration
 */
export function runMigration() {
  console.log('Starting import path migration...');
  
  // Start processing from src directory
  const srcDir = path.resolve(process.cwd(), 'src');
  processDirectory(srcDir);
  
  console.log('Import path migration complete!');
  
  // Output migration summary
  console.log('\nMigration paths used:');
  for (const [oldPath, newPath] of Object.entries(importPathMappings)) {
    console.log(`  ${oldPath} -> ${newPath}`);
  }
  
  return true;
}

// If called directly
if (require.main === module) {
  runMigration();
}
