import React from 'react';
import { Activity } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface ViewActivityActionProps {
  onViewActivity: () => void;
}

export const ViewActivityAction = ({ onViewActivity }: ViewActivityActionProps) => {
  return (
    <DropdownMenuItem onClick={onViewActivity}>
      <Activity className="mr-2 h-4 w-4" />
      View Activity
    </DropdownMenuItem>
  );
};