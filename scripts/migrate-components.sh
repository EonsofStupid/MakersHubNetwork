
#!/bin/bash

# Component Migration Script
# This script helps migrate components from src/components to their new locations

echo "Component Migration Script"
echo "================================="
echo ""
echo "This script helps check if all components have been properly migrated."
echo ""

COMPONENT_DIR="./src/components"
COMPONENTS_COUNT=$(find $COMPONENT_DIR -name "*.tsx" -o -name "*.ts" | wc -l)

echo "Found $COMPONENTS_COUNT components/files in $COMPONENT_DIR"

# List components still in the old directory structure
echo "Listing components that still need migration:"
find $COMPONENT_DIR -name "*.tsx" -o -name "*.ts" | sort

echo ""
echo "After confirming all components have been migrated, run:"
echo "rm -rf $COMPONENT_DIR"
echo ""
echo "Please check for any import errors before deleting the directory."
