
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { columns } from "./columns";
import { AddKeyDialog } from "./AddKeyDialog";

export const APIKeyManagement = () => {
  const [isAddingKey, setIsAddingKey] = useState(false);
  const { hasAdminAccess } = useAdminAccess();
  const { toast } = useToast();

  // Fetch API keys
  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching API keys",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }

      return data;
    }
  });

  if (!hasAdminAccess) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-heading font-bold mb-4">API Key Management</h3>
        <p className="text-muted-foreground">You don't have permission to access this section.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent">
            API Key Management
          </h3>
          <p className="text-muted-foreground mt-1">
            Manage API keys for external service integrations
          </p>
        </div>
        <Button 
          onClick={() => setIsAddingKey(true)}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md blur" />
          <div className="relative z-10 flex items-center">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add New Key
          </div>
        </Button>
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={apiKeys || []}
          isLoading={isLoading}
          emptyMessage="No API keys found. Add one to get started."
        />
      </Card>

      <AddKeyDialog 
        open={isAddingKey}
        onOpenChange={setIsAddingKey}
      />
    </div>
  );
};
