
import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, ArrowLeft, Shield } from "lucide-react";
import { useAdminStore } from "@/admin/store/admin.store";

interface AdminHeaderProps {
  title?: string;
}

export function AdminHeader({ title = "Admin Dashboard" }: AdminHeaderProps) {
  const navigate = useNavigate();
  const { toggleSidebar } = useAdminStore();
  
  return (
    <header className={cn(
      "fixed top-0 left-0 w-full z-40 h-16",
      "border-b border-border/30",
      "backdrop-blur-xl bg-background/75",
      "flex items-center justify-between px-4"
    )}>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-primary/10 text-foreground"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2">
          <Shield className="text-primary w-5 h-5" />
          <h1 className="text-lg font-bold text-primary">
            {title}
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg",
            "text-sm text-muted-foreground hover:text-foreground",
            "hover:bg-primary/10 transition-colors"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Site</span>
        </button>
      </div>
    </header>
  );
}
