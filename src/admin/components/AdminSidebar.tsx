
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminStore } from "@/admin/store/admin.store";
import { cn } from "@/lib/utils";
import { 
  Home, Users, Settings, Palette, 
  FileText, Database, Package, Workflow,
  ChevronLeft, ChevronRight
} from "lucide-react";

interface AdminSidebarProps {
  collapsed?: boolean; // Add this prop interface
}

interface SidebarIconProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  expanded: boolean;
  onClick: () => void;
}

const SidebarIcon = ({ icon: Icon, label, active, expanded, onClick }: SidebarIconProps) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={cn(
      "impulse-sidebar-icon w-full flex items-center px-3 py-2 rounded-lg transition-all",
      "hover:bg-[var(--impulse-border-hover)] relative overflow-hidden",
      active ? "bg-[var(--impulse-border-active)] text-[var(--impulse-text-accent)]" : 
              "text-[var(--impulse-text-secondary)]"
    )}
  >
    <Icon className="flex-shrink-0 w-5 h-5" />
    
    {expanded && (
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="ml-3 truncate"
      >
        {label}
      </motion.span>
    )}
    
    {active && (
      <motion.div 
        layoutId="sidebar-active-indicator"
        className="absolute inset-0 bg-[var(--impulse-primary)] opacity-10 z-0 rounded-lg"
      />
    )}
  </motion.button>
);

export function AdminSidebar({ collapsed }: AdminSidebarProps) {
  const navigate = useNavigate();
  const { sidebarExpanded, activeSection, toggleSidebar } = useAdminStore();
  
  // Use the collapsed prop if provided, otherwise use sidebarExpanded from the store
  const isSidebarCollapsed = collapsed !== undefined ? collapsed : !sidebarExpanded;
  
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home, path: "/admin/overview" },
    { id: "content", label: "Content", icon: FileText, path: "/admin/content" },
    { id: "users", label: "Users", icon: Users, path: "/admin/users" },
    { id: "data-maestro", label: "Data Maestro", icon: Database, path: "/admin/data-maestro" },
    { id: "import", label: "Import", icon: Package, path: "/admin/import" },
    { id: "settings", label: "Settings", icon: Settings, path: "/admin/settings" },
  ];
  
  return (
    <motion.aside
      className={cn(
        "impulse-sidebar fixed top-0 left-0 h-full z-30 border-r",
        "backdrop-blur-md mt-16 pt-4 pb-6 px-2",
        "border-[var(--impulse-border-normal)] bg-[var(--impulse-bg-overlay)]",
        "transition-all duration-300 ease-in-out overflow-hidden",
        isSidebarCollapsed ? "w-[60px]" : "w-48"
      )}
      animate={{ width: isSidebarCollapsed ? 60 : 192 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <div className="flex flex-col h-full gap-2">
        <div className="mb-6 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="p-1 rounded-full bg-[var(--impulse-border-normal)] hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-accent)]"
          >
            {!isSidebarCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </motion.button>
        </div>
        
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <SidebarIcon
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeSection === item.id}
              expanded={!isSidebarCollapsed}
              onClick={() => navigate(item.path)}
            />
          ))}
        </nav>
        
        <div className="mt-auto pt-4 border-t border-[var(--impulse-border-normal)]">
          <SidebarIcon
            icon={Palette}
            label="Themes"
            active={activeSection === "themes"}
            expanded={!isSidebarCollapsed}
            onClick={() => navigate("/admin/settings/theme")}
          />
          
          <SidebarIcon
            icon={Workflow}
            label="Workflow"
            active={activeSection === "workflow"}
            expanded={!isSidebarCollapsed}
            onClick={() => navigate("/admin/settings/workflow")}
          />
        </div>
      </div>
    </motion.aside>
  );
}
