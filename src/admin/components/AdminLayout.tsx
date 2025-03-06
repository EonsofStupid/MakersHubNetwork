
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AdminHeader } from "@/admin/components/AdminHeader";
import { AdminSidebar } from "@/admin/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminStore } from "@/admin/store/admin.store";
import { useAdminPreferencesStore } from "@/admin/store/adminPreferences.store";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  title = "Admin Dashboard",
  children 
}) => {
  const { loadPermissions } = useAdminStore();
  const { isDashboardCollapsed, toggleDashboardCollapsed, loadPreferences } = useAdminPreferencesStore();
  const location = useLocation();
  
  useEffect(() => {
    loadPermissions();
    loadPreferences();
  }, [loadPermissions, loadPreferences]);
  
  // Extract current tab from URL for title enhancement
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab');
  
  // Enhance title based on tab if available
  const enhancedTitle = currentTab 
    ? `${title} - ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}`
    : title;

  return (
    <div className="min-h-screen relative">
      <AdminHeader title={enhancedTitle} collapsed={isDashboardCollapsed} />
      
      <div className="flex">
        {/* Sidebar */}
        <div 
          className={cn(
            "sticky top-[4.5rem] h-[calc(100vh-4.5rem)] transition-all duration-300 ease-in-out",
            isDashboardCollapsed ? "w-16" : "w-60"
          )}
        >
          <AdminSidebar collapsed={isDashboardCollapsed} />
        </div>
        
        {/* Collapse toggle button */}
        <Button 
          variant="ghost" 
          size="icon"
          className={cn(
            "absolute top-24 z-20 bg-background/50 backdrop-blur-sm border border-primary/10 hover:bg-primary/10 transition-all",
            isDashboardCollapsed 
              ? "left-16 rounded-l-none" 
              : "left-60 rounded-l-none"
          )}
          onClick={toggleDashboardCollapsed}
        >
          {isDashboardCollapsed 
            ? <ChevronRight className="h-4 w-4 text-primary" /> 
            : <ChevronLeft className="h-4 w-4 text-primary" />
          }
        </Button>
        
        {/* Main content */}
        <div className={cn(
          "flex-1 p-4 transition-all duration-300",
          isDashboardCollapsed ? "ml-2" : "ml-4"
        )}>
          {children}
        </div>
      </div>
    </div>
  );
};
