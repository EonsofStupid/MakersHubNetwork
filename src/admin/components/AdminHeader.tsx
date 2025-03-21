
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, Settings, Database } from "lucide-react";
import { useThemeEffects } from "@/hooks/useThemeEffects";
import { EffectRenderer } from "@/components/theme/effects/EffectRenderer";
import { adminNavigationItems } from "./sidebar/navigation.config";
import { useAdminStore } from "@/admin/store/admin.store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AdminHeaderProps {
  title: string;
  collapsed?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  title,
  collapsed = false
}) => {
  const navigate = useNavigate();
  const { applyRandomEffect, getEffectForElement } = useThemeEffects({
    maxActiveEffects: 2,
    debounceDelay: 100
  });
  const { currentSection } = useAdminStore();

  // Find the active navigation item to display its label in the header
  const activeNav = adminNavigationItems.find(item => item.id === currentSection);
  const headerTitle = activeNav?.label || title;

  const handleTitleClick = () => {
    applyRandomEffect('admin-title', {
      types: ['glitch', 'cyber'],
      duration: 2000
    });
  };

  const titleEffect = getEffectForElement('admin-title');

  return (
    <header className="border-b border-primary/10 backdrop-blur-md bg-background/50 sticky top-16 z-10">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/")}
              className="hover:bg-primary/10 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4 text-primary" />
            </Button>
            
            <EffectRenderer effect={titleEffect}>
              <h1 
                className="text-xl font-heading text-primary"
                id="admin-title"
                onClick={handleTitleClick}
              >
                {headerTitle}
              </h1>
            </EffectRenderer>
          </div>
          
          <div className="flex items-center space-x-1">
            <span className="text-xs text-muted-foreground bg-primary/5 px-2 py-1 rounded border border-primary/10">
              Admin
            </span>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10 h-8 w-8">
                    <Database className="h-4 w-4 text-primary" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Data Operations</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10 h-8 w-8">
                    <Bell className="h-4 w-4 text-primary" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10 h-8 w-8">
                    <Settings className="h-4 w-4 text-primary" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Admin Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </header>
  );
};
