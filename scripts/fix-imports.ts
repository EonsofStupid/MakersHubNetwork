
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
  let updated = content.replace(
    /import\s+?(\{[^}]+\})\s+?from\s+?['"](@\/components\/ui\/[^'"]+)['"]/g,
    (match, importClause, oldPath) => {
      const newPath = getNewImportPath(oldPath);
      return `import ${importClause} from '${newPath}'`;
    }
  );
  
  if (updated !== content) {
    fs.writeFileSync(file, updated, 'utf8');
    console.log(`Updated imports in ${file}`);
  }
});

console.log('Import update complete');
