
/**
 * Import fix script - intended to be used with a build tool or CI process
 * This script updates all imports to use the standardized paths
 */
import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { UI_PATHS, TYPE_PATHS } from '../src/lib/paths';

// Run through all TypeScript files
const files = glob.sync('src/**/*.{ts,tsx}');

let updatedCount = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Replace old component imports with new paths
  let updated = content
    // Fix UI component imports from @/components/ui to @/shared/ui
    .replace(
      /import\s+?(\{[^}]+\})\s+?from\s+?['"]@\/components\/ui\/([^'"]+)['"]/g,
      (match, importClause, componentPath) => {
        updatedCount++;
        return `import ${importClause} from '@/shared/ui/${componentPath}'`;
      }
    )
    // Fix single imports from @/components/ui to @/shared/ui
    .replace(
      /import\s+?([A-Za-z0-9_]+)\s+?from\s+?['"]@\/components\/ui\/([^'"]+)['"]/g,
      (match, importName, componentPath) => {
        updatedCount++;
        return `import ${importName} from '@/shared/ui/${componentPath}'`;
      }
    )
    // Fix hooks imports
    .replace(
      /import\s+?(\{[^}]+\})\s+?from\s+?['"]@\/hooks\/([^'"]+)['"]/g,
      (match, importClause, hooksPath) => {
        updatedCount++;
        return `import ${importClause} from '@/shared/hooks/${hooksPath}'`;
      }
    )
    // Fix types imports
    .replace(
      /import\s+?(\{[^}]+\})\s+?from\s+?['"]@\/types\/([^'"]+)['"]/g,
      (match, importClause, typesPath) => {
        updatedCount++;
        return `import ${importClause} from '@/shared/types/${typesPath}'`;
      }
    )
    // Fix shared.types imports
    .replace(
      /import\s+?(\{[^}]+\})\s+?from\s+?['"]@\/types\/shared['"]/g,
      (match, importClause) => {
        updatedCount++;
        return `import ${importClause} from '@/shared/types/shared.types'`;
      }
    )
    // Fix build.types imports
    .replace(
      /import\s+?(\{[^}]+\})\s+?from\s+?['"]@\/types\/build['"]/g,
      (match, importClause) => {
        updatedCount++;
        return `import ${importClause} from '@/shared/types/build.types'`;
      }
    )
    // Fix store imports (theme)
    .replace(
      /import\s+?(\{[^}]+\})\s+?from\s+?['"]@\/stores\/theme\/([^'"]+)['"]/g,
      (match, importClause, storePath) => {
        updatedCount++;
        return `import ${importClause} from '@/shared/stores/theme/${storePath}'`;
      }
    )
    // Fix theme store imports
    .replace(
      /import\s+?(\{[^}]+\})\s+?from\s+?['"]@\/theme\/store\/([^'"]+)['"]/g,
      (match, importClause, storePath) => {
        updatedCount++;
        return `import ${importClause} from '@/shared/stores/theme/${storePath}'`;
      }
    )
    // Fix hooks/use-toast import
    .replace(
      /import\s+?(\{[^}]+\})\s+?from\s+?['"]@\/hooks\/use-toast['"]/g,
      (match, importClause) => {
        updatedCount++;
        return `import ${importClause} from '@/shared/hooks/use-toast'`;
      }
    );
  
  if (updated !== content) {
    fs.writeFileSync(file, updated, 'utf8');
    console.log(`Updated imports in ${file}`);
  }
});

console.log(`Import update complete. Updated ${updatedCount} imports.`);
