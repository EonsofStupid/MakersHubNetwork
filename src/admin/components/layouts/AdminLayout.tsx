
import React, { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminHeader } from "../AdminHeader";
import { AdminSidebar } from "../AdminSidebar";
import { useAdminStore } from "../../store/admin.store";
import { useAtom } from "jotai";
import { adminEditModeAtom } from "../../atoms/tools.atoms";
import { useToast } from "@/hooks/use-toast";
import { FrozenZones } from "../overlay/FrozenZones";
import { LogToggleButton } from "@/logging/components/LogToggleButton";
import { useLoggingContext } from "@/logging/context/LoggingContext";
import { LogConsole } from "@/logging/components/LogConsole";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";
import { useAdminAccess } from "../../hooks/useAdminAccess";
import { EditModeToggle } from "../ui/EditModeToggle";
import { useState } from "react";

interface AdminLayoutProps {
  title?: string;
  fullWidth?: boolean;
  className?: string;
}

export function AdminLayout({ 
  title = "Admin Dashboard",
  fullWidth = false,
  className
}: AdminLayoutProps) {
  const { permissions } = useAdminStore();
  const [isEditMode] = useAtom(adminEditModeAtom);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { showLogConsole } = useLoggingContext();
  const logger = useLogger("AdminLayout", LogCategory.ADMIN);
  const { hasAdminAccess, isAuthenticated } = useAdminAccess();
  const redirectAttemptedRef = useRef<boolean>(false);
  const loggedInitRef = useRef<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Log the admin layout initialization - only once
    if (!loggedInitRef.current) {
      loggedInitRef.current = true;
      logger.info("Admin layout rendered", {
        details: { 
          isEditMode, 
          permissionsCount: permissions.length,
          hasAdminAccess,
          isAuthenticated
        },
      });
    }

    // If somehow a non-admin user got here, redirect them - but only once
    if (!hasAdminAccess && isAuthenticated && !redirectAttemptedRef.current) {
      redirectAttemptedRef.current = true;
      
      logger.warn("Non-admin user attempted to access admin layout", {
        details: { permissions }
      });
      
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel",
        variant: "destructive"
      });
      
      navigate("/");
    }
  }, [isAuthenticated, hasAdminAccess]); // Reduced dependencies to prevent excessive re-renders

  // If user is not authenticated or doesn't have admin access, don't render the layout
  if (!isAuthenticated || !hasAdminAccess) {
    return null;
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden bg-[var(--impulse-bg-main)] ${fullWidth ? 'max-w-full' : ''} ${className || ''}`}>
      <AdminSidebar open={sidebarOpen} onToggle={handleToggleSidebar} />
      
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <AdminHeader title={title} />
        
        <main className={`flex-1 overflow-auto p-4 sm:p-6 ${fullWidth ? 'max-w-full' : ''}`}>
          <Outlet />
        </main>
      </div>
      
      {isEditMode && <FrozenZones />}
      {isEditMode && <EditModeToggle />}
      <LogToggleButton />
      {showLogConsole && <LogConsole />}
    </div>
  );
}
