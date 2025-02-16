
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddKeyDialog } from "./components/api/key-management/AddKeyDialog";
import { useAdminAccess } from "@/hooks/useAdminAccess";

export const DataMaestroTab = () => {
  const [showAddKeyDialog, setShowAddKeyDialog] = useState(false);
  const { hasAdminAccess } = useAdminAccess();

  if (!hasAdminAccess) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">You don't have access to this section.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Key Management</CardTitle>
          <CardDescription>
            Securely store and manage API keys for external services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowAddKeyDialog(true)}>
            Add New API Key
          </Button>
        </CardContent>
      </Card>

      <AddKeyDialog 
        isOpen={showAddKeyDialog}
        onClose={() => setShowAddKeyDialog(false)}
      />
    </div>
  );
};
