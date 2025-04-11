
#!/bin/bash

# Component Migration Script
# This script helps migrate components from src/components to their new locations

echo "Component Migration Script"
echo "================================="
echo ""
echo "This script helps check if all components have been properly migrated."
echo ""

COMPONENT_DIR="./src/components"
UI_DIR="./src/ui"
COMPONENTS_COUNT=$(find $COMPONENT_DIR -name "*.tsx" -o -name "*.ts" | wc -l)

echo "Found $COMPONENTS_COUNT components/files in $COMPONENT_DIR"

# List components still in the old directory structure
echo "Listing UI components that still need migration:"
find $COMPONENT_DIR/ui -name "*.tsx" -o -name "*.ts" | sort

echo ""
echo "Listing auth components that still need migration:"
find $COMPONENT_DIR/auth -name "*.tsx" -o -name "*.ts" | sort

echo ""
echo "Listing profile components that still need migration:"
find $COMPONENT_DIR/profile -name "*.tsx" -o -name "*.ts" | sort

echo ""
echo "Checking which UI components have been successfully migrated:"
find $UI_DIR -name "*.tsx" -o -name "*.ts" | sort

echo ""
echo "After confirming all components have been migrated, run:"
echo "rm -rf $COMPONENT_DIR/ui"
echo ""
echo "Then run the migration import script to update all imports:"
echo "node scripts/update-imports.js"
echo ""
echo "Finally, when all code is working correctly:"
echo "rm -rf $COMPONENT_DIR"
echo ""
echo "Please check for any import errors before deleting the directory."
