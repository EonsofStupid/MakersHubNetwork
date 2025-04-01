
import React, { useEffect } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { useAdminStore } from "../store/admin.store";
import { useNavigate } from "react-router-dom";
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

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isInitialized, adminCoreRights } = useAdminStore();
  const [isEditMode] = useAtom(adminEditModeAtom);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { showLogConsole } = useLoggingContext();
  const logger = useLogger("AdminLayout", LogCategory.ADMIN);

  useEffect(() => {
    // Log the admin layout initialization
    logger.info("Admin layout rendered", {
      details: { isEditMode, rights: adminCoreRights },
    });

    if (!isInitialized) {
      toast({
        title: "Admin panel is initializing",
        description: "Please wait while we set up the admin panel...",
        icon: "loader"
      });
    }
  }, [isInitialized, isEditMode, adminCoreRights, toast, logger]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--impulse-bg-main)]">
      <AdminSidebar />
      
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
      
      {isEditMode && <FrozenZones />}
      {isEditMode && <EditModeToggle />}
      <LogToggleButton />
      {showLogConsole && <LogConsole />}
    </div>
  );
};
