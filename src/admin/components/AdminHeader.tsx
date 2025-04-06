
import React from "react";
import { MenuIcon, BellIcon, ChevronDown, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTooltip } from "./ui/AdminTooltip";
import { useTheme } from "@/components/ui/theme-provider";
import { Link } from "react-router-dom";
import { useAdminContext } from "../context/AdminContext";

interface AdminHeaderProps {
  title?: string;
  onToggleSidebar?: () => void;
}

export function AdminHeader({ title = "Admin Dashboard", onToggleSidebar }: AdminHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAdminContext();
  
  return (
    <header className="border-b border-[var(--impulse-border-normal)] bg-[var(--impulse-bg-card)] backdrop-blur-md">
      <div className="flex h-16 items-center px-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden mr-2" 
          onClick={onToggleSidebar}
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
        
        <h1 className="text-lg font-semibold">{title}</h1>
        
        <div className="ml-auto flex items-center space-x-2">
          <AdminTooltip content="Toggle theme" side="bottom">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <span className="text-yellow-400">☀️</span>
              ) : (
                <span>🌙</span>
              )}
            </Button>
          </AdminTooltip>
          
          <AdminTooltip content="Notifications" side="bottom">
            <Button variant="ghost" size="icon">
              <BellIcon className="h-5 w-5" />
            </Button>
          </AdminTooltip>
          
          <Link to="/admin/settings/account" className="flex items-center">
            <div className="flex items-center rounded-full border border-[var(--impulse-border-normal)] bg-[var(--impulse-bg-overlay)] p-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-primary">
                <UserIcon className="h-4 w-4" />
              </div>
              <span className="ml-2 mr-1 text-sm hidden md:inline-block">
                {user?.email || 'Admin'}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
