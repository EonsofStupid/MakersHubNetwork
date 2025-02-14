
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MoreVertical, Edit, Trash, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";

interface APIKey {
  id: string;
  name: string;
  is_active: boolean;
}

interface APIKeyActionsProps {
  apiKey: APIKey;
}

export const APIKeyActions = ({ apiKey }: APIKeyActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleToggleActive = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: !apiKey.is_active })
        .eq('id', apiKey.id);

      if (error) throw error;

      toast({
        title: `API key ${apiKey.is_active ? 'disabled' : 'enabled'}`,
        description: `Successfully ${apiKey.is_active ? 'disabled' : 'enabled'} the API key "${apiKey.name}"`,
      });

      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    } catch (error: any) {
      toast({
        title: "Error updating API key",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete the API key "${apiKey.name}"?`)) {
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', apiKey.id);

      if (error) throw error;

      toast({
        title: "API key deleted",
        description: `Successfully deleted the API key "${apiKey.name}"`,
      });

      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    } catch (error: any) {
      toast({
        title: "Error deleting API key",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleToggleActive} disabled={isLoading}>
          {apiKey.is_active ? (
            <>
              <PowerOff className="mr-2 h-4 w-4" />
              <span>Disable</span>
            </>
          ) : (
            <>
              <Power className="mr-2 h-4 w-4" />
              <span>Enable</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} disabled={isLoading} className="text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
