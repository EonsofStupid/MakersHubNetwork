
/**
 * Script to update component imports across the codebase
 * 
 * This script automates the migration of component imports
 * from src/components to their new locations in src/ui, src/auth, etc.
 * 
 * Usage: node scripts/update-imports.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration - map of old import paths to new import paths
const importMappings = {
  // UI core components mapping
  '@/components/ui/accordion': '@/ui/core/accordion',
  '@/components/ui/alert': '@/ui/core/alert',
  '@/components/ui/aspect-ratio': '@/ui/core/aspect-ratio',
  '@/components/ui/avatar': '@/ui/core/avatar',
  '@/components/ui/badge': '@/ui/core/badge',
  '@/components/ui/button': '@/ui/core/button',
  '@/components/ui/calendar': '@/ui/core/calendar',
  '@/components/ui/card': '@/ui/core/card',
  '@/components/ui/checkbox': '@/ui/core/checkbox',
  '@/components/ui/collapsible': '@/ui/core/collapsible',
  '@/components/ui/dialog': '@/ui/core/dialog',
  '@/components/ui/divider': '@/ui/core/divider',
  '@/components/ui/hover-card': '@/ui/core/hover-card',
  '@/components/ui/input': '@/ui/core/input',
  '@/components/ui/input-otp': '@/ui/core/input-otp',
  '@/components/ui/label': '@/ui/core/label',
  '@/components/ui/popover': '@/ui/core/popover',
  '@/components/ui/progress': '@/ui/core/progress',
  '@/components/ui/radio-group': '@/ui/core/radio-group',
  '@/components/ui/resizable': '@/ui/core/resizable',
  '@/components/ui/scroll-area': '@/ui/core/scroll-area',
  '@/components/ui/separator': '@/ui/core/separator',
  '@/components/ui/skeleton': '@/ui/core/skeleton',
  '@/components/ui/slider': '@/ui/core/slider',
  '@/components/ui/switch': '@/ui/core/switch',
  '@/components/ui/table': '@/ui/core/table',
  '@/components/ui/tabs': '@/ui/core/tabs',
  '@/components/ui/textarea': '@/ui/core/textarea',
  '@/components/ui/toast': '@/ui/core/toast',
  '@/components/ui/toaster': '@/ui/core/toaster',
  '@/components/ui/toggle': '@/ui/core/toggle', 
  '@/components/ui/toggle-group': '@/ui/core/toggle-group',
  '@/components/ui/tooltip': '@/ui/core/tooltip',
  '@/components/ui/use-toast': '@/hooks/use-toast',
  
  // Data components
  '@/components/ui/data-table': '@/ui/data/data-table',
  '@/components/ui/steps': '@/ui/data/steps',
  
  // Layout components
  '@/components/ErrorBoundary': '@/ui/layout/error-boundary',
  
  // Theme components
  '@/components/ui/theme-provider': '@/ui/theme/theme-provider',
  
  // Consolidated imports
  '@/components/ui': '@/ui',
};

// Get all TypeScript/JavaScript files in the project
function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      // Skip node_modules and .git directories
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        fileList = getFiles(filePath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Update imports in a file
function updateImportsInFile(filePath) {
  console.log(`Checking ${filePath}`);
  let fileContent = fs.readFileSync(filePath, 'utf8');
  let fileUpdated = false;
  
  // Check for each import mapping
  Object.entries(importMappings).forEach(([oldImport, newImport]) => {
    const importRegex = new RegExp(`from ['"](${oldImport})['"]`, 'g');
    if (importRegex.test(fileContent)) {
      fileContent = fileContent.replace(importRegex, `from '${newImport}'`);
      fileUpdated = true;
      console.log(`  - Updated import: ${oldImport} → ${newImport}`);
    }
  });
  
  // Write the updated content back to the file if changes were made
  if (fileUpdated) {
    fs.writeFileSync(filePath, fileContent, 'utf8');
    console.log(`  ✓ Updated imports in ${filePath}`);
  }
}

// Main execution
console.log('Component imports update script');
console.log('================================');
console.log('');
console.log('This script updates imports from @/components/* to the new paths');

// Get all project files
const projectRoot = path.resolve('.');
const files = getFiles(projectRoot);
let updatedFileCount = 0;

console.log(`Found ${files.length} files to check for imports`);
console.log('Starting import updates...');

// Update imports in each file
files.forEach(filePath => {
  try {
    updateImportsInFile(filePath);
    updatedFileCount++;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});

console.log('');
console.log(`Import updates complete! Processed ${updatedFileCount} files.`);
console.log('');
console.log('Next steps:');
console.log('1. Check for any build errors');
console.log('2. Verify application functionality');
console.log('3. Remove the old component directories once everything works');
