
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { useLayoutSkeleton } from '@/admin/hooks/useLayoutSkeleton';
import { createDefaultDashboardLayout } from '@/admin/utils/layoutUtils';
import { v4 as uuidv4 } from 'uuid';
import { useAdminPermissions } from '@/admin/hooks/useAdminPermissions';
import { ADMIN_PERMISSIONS } from '@/admin/constants/permissions';

interface FallbackLayoutDisplayProps {
  type: string;
  scope: string;
  children: React.ReactNode;
}

export function FallbackLayoutDisplay({ type, scope, children }: FallbackLayoutDisplayProps) {
  const { useSaveLayout } = useLayoutSkeleton();
  const { mutate: saveLayout, isPending } = useSaveLayout();
  const { hasPermission } = useAdminPermissions();
  const canCreateLayout = hasPermission(ADMIN_PERMISSIONS.ADMIN_EDIT);
  
  const handleCreateDefaultLayout = () => {
    // Create a default layout based on type
    const defaultLayout = type === 'dashboard' 
      ? createDefaultDashboardLayout(uuidv4())
      : {
          id: uuidv4(),
          name: `Default ${type} Layout`,
          type,
          scope,
          components: [],
          version: 1
        };
    
    // Save the layout to the database
    saveLayout({
      name: defaultLayout.name,
      type: defaultLayout.type,
      scope: defaultLayout.scope,
      is_active: true,
      layout_json: {
        components: defaultLayout.components,
        version: 1
      },
      version: 1
    });
  };
  
  return (
    <div className="space-y-6">
      {canCreateLayout && (
        <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-700/50">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-300">No layout found</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-400">
            No active layout was found for this {type} in the {scope} scope.
          </AlertDescription>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/50 dark:border-amber-600 dark:text-amber-300"
              onClick={handleCreateDefaultLayout}
              disabled={isPending}
            >
              {isPending ? "Creating..." : `Create Default ${type} Layout`}
            </Button>
          </div>
        </Alert>
      )}
      
      {/* Render the fallback content */}
      {children}
    </div>
  );
}
