/**
 * UI Component Refactoring Script
 * 
 * This script automates the process of:
 * 1. Creating component implementation files in the proper location
 * 2. Updating barrel files to use consistent import paths
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Configuration
const UI_COMPONENTS = [
  'accordion',
  'alert',
  'alert-dialog',
  'avatar',
  'badge',
  'breadcrumb',
  'button',
  'calendar',
  'card',
  'checkbox',
  'data-table',
  'dialog',
  'form',
  'hover-card',
  'input',
  'label',
  'navigation-menu',
  'pagination',
  'popover',
  'progress',
  'radio-group',
  'resizable',
  'scroll-area',
  'select',
  'separator',
  'sheet',
  'skeleton',
  'slider',
  'spinner',
  'steps',
  'switch',
  'table',
  'tabs',
  'textarea',
];

const PROJECT_ROOT = path.resolve(__dirname, '../../');
const SHARED_UI_DIR = path.join(PROJECT_ROOT, 'src/shared/ui');

// Template for basic component implementation
const getComponentTemplate = (componentName: string, exports: string[]) => {
  const pascalName = componentName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  return `// Implementation of ${pascalName} component
import * as React from "react";
import { cn } from "@/shared/utils/cn";

${exports.map(name => `
const ${name} = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("", className)}
      {...props}
    />
  )
);
${name}.displayName = "${name}";
`).join('\n')}

export { ${exports.join(', ')} };
`;
};

// Template for barrel file
const getBarrelTemplate = (componentName: string, exports: string[]) => {
  return `// Re-export ${componentName} component from shadcn
export {
  ${exports.join(',\n  ')}
} from '@/shared/ui/${componentName}/${componentName}.component';
`;
};

// Ensure directory exists
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Extract exports from a barrel file
function extractExports(barrelFilePath: string): string[] {
  if (!fs.existsSync(barrelFilePath)) {
    return [];
  }

  const content = fs.readFileSync(barrelFilePath, 'utf-8');
  const exportMatch = content.match(/export\s*{([^}]*)}/);
  
  if (!exportMatch || !exportMatch[1]) {
    return [];
  }

  return exportMatch[1]
    .split(',')
    .map(name => name.trim())
    .filter(Boolean);
}

// Process a single component
function processComponent(componentName: string) {
  console.log(`Processing ${componentName}...`);

  // Paths
  const barrelFilePath = path.join(SHARED_UI_DIR, `${componentName}.ts`);
  const componentDirPath = path.join(SHARED_UI_DIR, componentName);
  const componentFilePath = path.join(componentDirPath, `${componentName}.component.tsx`);

  // Ensure component directory exists
  ensureDirectoryExists(componentDirPath);

  // Extract exports from barrel file
  const exports = extractExports(barrelFilePath);
  
  if (exports.length === 0) {
    console.warn(`  Warning: No exports found in ${barrelFilePath}`);
    return;
  }

  // Create component implementation file if it doesn't exist
  if (!fs.existsSync(componentFilePath)) {
    console.log(`  Creating component implementation at ${componentFilePath}`);
    fs.writeFileSync(componentFilePath, getComponentTemplate(componentName, exports));
  } else {
    console.log(`  Component implementation already exists at ${componentFilePath}`);
  }

  // Update barrel file
  console.log(`  Updating barrel file at ${barrelFilePath}`);
  fs.writeFileSync(barrelFilePath, getBarrelTemplate(componentName, exports));
}

// Main execution
console.log('Starting UI component refactoring...');

UI_COMPONENTS.forEach(processComponent);

console.log('Refactoring complete!');
console.log('');
console.log('Next steps:');
console.log('1. Review the generated component implementations');
console.log('2. Ensure all imports are working correctly');
console.log('3. Fix any remaining TypeScript errors'); 