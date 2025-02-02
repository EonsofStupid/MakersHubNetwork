import React from 'react';
import { Ban } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BanActionProps {
  userId: string;
  onBanClick: () => void;
}

export const BanAction = ({ userId, onBanClick }: BanActionProps) => {
  return (
    <DropdownMenuItem 
      onClick={onBanClick}
      className="text-red-500 focus:text-red-500"
    >
      <Ban className="mr-2 h-4 w-4" />
      Ban User
    </DropdownMenuItem>
  );
};