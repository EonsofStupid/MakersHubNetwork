
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAdminStore } from "@/admin/store/admin.store";
import { adminNavigationItems } from "./navigation.config";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";

export function AdminNavigation({ collapsed = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setActiveSection } = useAdminStore();
  const { checkPermission } = useAdminPermissions();
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const handleNavigation = (path: string, sectionId: string) => {
    setActiveSection(sectionId);
    navigate(path);
  };
  
  return (
    <nav className="space-y-1.5">
      {adminNavigationItems.map((item) => {
        // Skip items the user doesn't have permission to see
        if (!checkPermission(item.permission)) {
          return null;
        }
        
        const isActive = isActiveRoute(item.path);
        
        return collapsed ? (
          <Tooltip key={item.id} delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleNavigation(item.path, item.id)}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-9 w-9",
                  isActive && "bg-primary/10 text-primary"
                )}
              >
                {item.icon}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-normal">
              {item.label}
            </TooltipContent>
          </Tooltip>
        ) : (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.path, item.id)}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start",
              isActive && "bg-primary/10 text-primary"
            )}
          >
            {item.icon}
            <span className="ml-2">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
