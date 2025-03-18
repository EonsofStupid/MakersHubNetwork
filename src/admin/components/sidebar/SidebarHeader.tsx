
import React from "react";
import { cn } from "@/lib/utils";
import { Command } from "lucide-react";

interface SidebarHeaderProps {
  collapsed: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed }) => {
  return (
    <div className={cn(
      "p-4 border-b border-primary/10 bg-primary/5",
      collapsed && "p-2"
    )}>
      <div className="flex items-center space-x-2">
        <Command className="h-5 w-5 text-primary" />
        {!collapsed && (
          <h2 className="font-heading text-primary">Admin Navigation</h2>
        )}
      </div>
    </div>
  );
};
