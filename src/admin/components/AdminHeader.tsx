
import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAdminStore } from "@/admin/store/admin.store";
import { Button } from "@/components/ui/button";
import { MenuIcon, ChevronLeft, Settings } from "lucide-react";
import { useAdminTheme } from "../theme/AdminThemeProvider";

interface AdminHeaderProps {
  title?: string;
  collapsed?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  title = "Admin Dashboard",
  collapsed = false
}) => {
  const navigate = useNavigate();
  const { toggleSidebar } = useAdminStore();
  const { currentTheme } = useAdminTheme();
  
  const handleBackToSite = () => {
    navigate("/");
  };
  
  const handleThemeSettings = () => {
    navigate("/admin/settings/theme");
  };

  return (
    <motion.header
      initial={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
      animate={{ 
        clipPath: collapsed 
          ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)" 
          : "polygon(0 0, 100% 0, 98% 100%, 2% 100%)"
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={cn(
        "fixed top-0 left-0 w-full z-40",
        "h-16 bg-[var(--impulse-bg-main)]",
        "border-b border-[var(--impulse-border-normal)]",
        "backdrop-blur-md"
      )}
    >
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            className="hover:bg-[var(--impulse-border-normal)] transition-colors"
          >
            <MenuIcon className="h-5 w-5 text-[var(--impulse-text-primary)]" />
          </Button>
          
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--impulse-text-accent)]">
              {title}
            </h1>
            
            {currentTheme && (
              <div className="text-xs px-2 py-1 rounded-full bg-[var(--impulse-border-normal)] text-[var(--impulse-text-secondary)]">
                {currentTheme.name}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleThemeSettings}
            className="text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-text-primary)]"
          >
            <Settings className="h-4 w-4 mr-2" />
            Theme
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToSite}
            className="text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Site
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
