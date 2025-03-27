
import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, ArrowLeft, Shield, Bell, Settings } from "lucide-react";
import { useAdminStore } from "@/admin/store/admin.store";

interface AdminHeaderProps {
  title?: string;
  collapsed?: boolean;
}

export function AdminHeader({ title = "Admin Dashboard", collapsed = false }: AdminHeaderProps) {
  const navigate = useNavigate();
  const { toggleSidebar } = useAdminStore();
  
  return (
    <header className={cn(
      "fixed top-0 left-0 w-full z-50 h-16",
      "border-b border-[var(--impulse-border-normal)]",
      "backdrop-blur-xl bg-[var(--impulse-bg-overlay)]",
      "flex items-center justify-between px-4",
      "transition-all duration-300"
    )}>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-[var(--impulse-primary)]/10 text-[var(--impulse-text-primary)]"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2">
          <Shield className="text-[var(--impulse-primary)] w-5 h-5" />
          <h1 className="text-lg font-bold text-[var(--impulse-primary)] relative group">
            {title}
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--impulse-primary)] group-hover:w-full transition-all duration-300"></span>
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-[var(--impulse-primary)]/10 text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-text-primary)] transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        
        <button className="p-2 rounded-full hover:bg-[var(--impulse-primary)]/10 text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-text-primary)] transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => navigate("/")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg",
            "text-sm text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-text-primary)]",
            "hover:bg-[var(--impulse-primary)]/10 transition-colors",
            "border border-[var(--impulse-border-normal)] hover:border-[var(--impulse-border-hover)]"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Site</span>
        </button>
      </div>
    </header>
  );
}
