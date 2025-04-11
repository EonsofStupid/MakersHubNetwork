
import React from 'react';
import { PageHeader } from '@/admin/components/ui/PageHeader';
import { LogLevel, LogCategory } from '@/logging/types';
import { useAdminAuth } from '@/admin/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';

export function ContentPageComponent() {
  const { hasAdminAccess } = useAdminAuth();
  const { toast } = useToast();
  
  // Ensure the component only renders for admin users
  if (!hasAdminAccess) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to view this page",
      variant: "destructive"
    });
    return null;
  }
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Management"
        description="View and manage site content"
      />
      
      <div className="grid gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Content Activity Log</h2>
        </div>
      </div>
    </div>
  );
}

// Export as default for React.lazy()
export default ContentPageComponent;
