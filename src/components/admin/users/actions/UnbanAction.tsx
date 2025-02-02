import React from 'react';
import { EyeOff } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UnbanActionProps {
  userId: string;
  onSuccess?: () => void;
}

export const UnbanAction = ({ userId, onSuccess }: UnbanActionProps) => {
  const handleUnban = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_banned: false,
          ban_reason: null,
          banned_at: null,
          banned_by: null
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success('User has been unbanned');
      onSuccess?.();
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast.error('Failed to unban user');
    }
  };

  return (
    <DropdownMenuItem onClick={handleUnban}>
      <EyeOff className="mr-2 h-4 w-4" />
      Unban User
    </DropdownMenuItem>
  );
};