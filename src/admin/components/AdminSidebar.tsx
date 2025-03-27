
import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/admin/store/admin.store";
import { 
  Home, 
  Users, 
  Settings, 
  FileText,
  Database,
  Package,
  PaintBucket,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  ActivitySquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SidebarItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  collapsed?: boolean;
}

function SidebarItem({ id, label, icon, active, onClick, collapsed = false }: SidebarItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start text-left h-12 mb-1 relative overflow-hidden group",
        active ? "text-[var(--impulse-primary)]" : "text-[var(--impulse-text-secondary)]",
        active ? "bg-[var(--impulse-primary)]/10" : "hover:bg-[var(--impulse-primary)]/5"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md",
          active ? "bg-[var(--impulse-primary)]/20" : "bg-[var(--impulse-bg-card)]",
          "transition-all duration-300"
        )}>
          {icon}
        </div>
        
        {!collapsed && (
          <span className="truncate text-sm font-medium">{label}</span>
        )}
      </div>
      
      {active && (
        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--impulse-primary)]"></span>
      )}
      
      <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--impulse-border-normal)] opacity-0 group-hover:opacity-50 transition-opacity"></span>
    </Button>
  );
}

export function AdminSidebar({ collapsed = false }: { collapsed?: boolean }) {
  const navigate = useNavigate();
  const { activeSection, toggleSidebar } = useAdminStore();
  
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" />, path: "/admin/overview" },
    { id: "users", label: "Users", icon: <Users className="w-5 h-5" />, path: "/admin/users" },
    { id: "content", label: "Content", icon: <FileText className="w-5 h-5" />, path: "/admin/content" },
    { id: "data-maestro", label: "Data Maestro", icon: <Database className="w-5 h-5" />, path: "/admin/data-maestro" },
    { id: "import", label: "Import", icon: <Package className="w-5 h-5" />, path: "/admin/import" },
    { id: "themes", label: "Themes", icon: <PaintBucket className="w-5 h-5" />, path: "/admin/themes" },
    { id: "analytics", label: "Analytics", icon: <ActivitySquare className="w-5 h-5" />, path: "/admin/analytics" },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" />, path: "/admin/settings" },
  ];
  
  return (
    <motion.aside 
      initial={{ x: collapsed ? -220 : 0 }}
      animate={{ x: 0 }}
      className={cn(
        "fixed left-0 top-0 h-full z-40 pt-16",
        "bg-[var(--impulse-bg-overlay)]",
        "backdrop-blur-lg border-r border-[var(--impulse-border-normal)]",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      <div className="flex flex-col p-3 h-full">
        <div className="flex justify-end mb-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-text-primary)]"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>
        
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              active={activeSection === item.id}
              onClick={() => navigate(item.path)}
              collapsed={collapsed}
            />
          ))}
        </div>
        
        <div className="mt-auto">
          <div className={cn(
            "border-t border-[var(--impulse-border-normal)] my-4 relative",
            "after:absolute after:top-0 after:left-[10%] after:right-[10%] after:h-[1px]",
            "after:bg-gradient-to-r after:from-transparent after:via-[var(--impulse-primary)]/20 after:to-transparent"
          )} />
          
          <SidebarItem
            id="help"
            label="Help & Resources"
            icon={<Home className="w-5 h-5" />}
            active={false}
            onClick={() => {}}
            collapsed={collapsed}
          />
        </div>
      </div>
    </motion.aside>
  );
}
