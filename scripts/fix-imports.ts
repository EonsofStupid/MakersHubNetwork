
/**
 * Import fix script - intended to be used with a build tool or CI process
 */
import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { getNewImportPath } from '../src/lib/paths';

// Run through all TypeScript files
const files = glob.sync('src/**/*.{ts,tsx}');

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Replace old component imports with new paths
  let updated = content
    // Fix UI component imports from @/components/ui to @/shared/ui
    .replace(
      /import\s+?(\{[^}]+\})\s+?from\s+?['"]@\/components\/ui\/([^'"]+)['"]/g,
      (match, importClause, componentPath) => {
        return `import ${importClause} from '@/shared/ui/${componentPath}'`;
      }
    )
    // Fix single imports from @/components/ui to @/shared/ui
    .replace(
      /import\s+?([A-Za-z0-9_]+)\s+?from\s+?['"]@\/components\/ui\/([^'"]+)['"]/g,
      (match, importName, componentPath) => {
        return `import ${importName} from '@/shared/ui/${componentPath}'`;
      }
    )
    // Fix types imports
    .replace(
      /import\s+?(\{[^}]+\})\s+?from\s+?['"]@\/types\/([^'"]+)['"]/g,
      (match, importClause, typesPath) => {
        return `import ${importClause} from '@/shared/types/${typesPath}'`;
      }
    )
    // Fix store imports
    .replace(
      /import\s+?(\{[^}]+\})\s+?from\s+?['"]@\/stores\/theme\/([^'"]+)['"]/g,
      (match, importClause, storePath) => {
        return `import ${importClause} from '@/shared/stores/theme/${storePath}'`;
      }
    );
  
  if (updated !== content) {
    fs.writeFileSync(file, updated, 'utf8');
    console.log(`Updated imports in ${file}`);
  }
});

console.log('Import update complete');
