
import React, { useEffect } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { useNavigate } from "@tanstack/react-router";
import { EditModeToggle } from "./ui/EditModeToggle";
import { useAtom } from "jotai";
import { adminEditModeAtom } from "../atoms/tools.atoms";
import { useToast } from "@/hooks/use-toast";
import { FrozenZones } from "./overlay/FrozenZones";
import { LogToggleButton } from "@/logging/components/LogToggleButton";
import { useLoggingContext } from "@/logging/context/LoggingContext";
import { LogConsole } from "@/logging/components/LogConsole";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";
import { useAdminAccess } from "@/admin/hooks/useAdminAccess";
import { useAdminPermissions } from "@/admin/hooks/useAdminPermissions";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  fullWidth?: boolean;
  className?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title = "Admin Dashboard",
  fullWidth = false,
  className
}) => {
  const { permissions } = useAdminPermissions();
  const [isEditMode] = useAtom(adminEditModeAtom);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { showLogConsole } = useLoggingContext();
  const logger = useLogger("AdminLayout", LogCategory.ADMIN);
  const { hasAdminAccess, isAuthenticated } = useAdminAccess();

  useEffect(() => {
    // Log the admin layout initialization
    logger.info("Admin layout rendered", {
      details: { 
        isEditMode, 
        permissionsCount: permissions.length,
        hasAdminAccess,
        isAuthenticated
      },
    });

    // If somehow a non-admin user got here, redirect them
    if (!hasAdminAccess && isAuthenticated) {
      logger.warn("Non-admin user attempted to access admin layout", {
        details: { permissions }
      });
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel",
        variant: "destructive"
      });
      navigate({ to: "/" });
    }

    // Notify when admin panel is initializing
    if (!permissions || permissions.length === 0) {
      toast({
        title: "Admin panel is initializing",
        description: "Please wait while we set up the admin panel...",
        icon: "loader"
      });
    }
  }, [isEditMode, permissions, toast, logger, hasAdminAccess, isAuthenticated, navigate]);

  // If user is not authenticated or doesn't have admin access, don't render the layout
  if (!isAuthenticated || !hasAdminAccess) {
    return null;
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden bg-[var(--impulse-bg-main)] ${fullWidth ? 'max-w-full' : ''} ${className || ''}`}>
      <AdminSidebar />
      
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <AdminHeader title={title} />
        
        <main className={`flex-1 overflow-auto p-4 sm:p-6 ${fullWidth ? 'max-w-full' : ''}`}>
          {children}
        </main>
      </div>
      
      {isEditMode && <FrozenZones />}
      {isEditMode && <EditModeToggle />}
      <LogToggleButton />
      {showLogConsole && <LogConsole />}
    </div>
  );
}
