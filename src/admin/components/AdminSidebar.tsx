
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { hoveredElementAtom, dragSourceAtom, dragTargetAtom } from "@/admin/atoms/ui.atoms";
import { useAdminStore } from "@/admin/store/admin.store";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  Users, 
  Settings, 
  FileText,
  Database,
  Package,
  PaintBucket,
  BarChart,
  Home,
  ChevronLeft, 
  ChevronRight,
  Shield,
  ArrowDown,
  ArrowRight
} from "lucide-react";

interface SidebarIconProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  expanded?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: () => void;
}

function SidebarIcon({ 
  id, 
  icon, 
  label, 
  active = false, 
  expanded = true,
  onClick,
  onDragStart,
  onDragEnd
}: SidebarIconProps) {
  const [hovered, setHovered] = useAtom(hoveredElementAtom);
  const isHovered = hovered === `sidebar-icon-${id}`;
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (onDragStart) {
      onDragStart(e);
    }
  };
  
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHovered(`sidebar-icon-${id}`)}
      onMouseLeave={() => setHovered(null)}
      onClick={onClick}
      className={cn(
        "impulse-drag-item flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg",
        "transition-all duration-300 relative overflow-hidden",
        active ? "bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-accent)]" : 
                "text-[var(--impulse-text-secondary)] hover:bg-[rgba(0,240,255,0.1)]"
      )}
    >
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full h-full absolute inset-0"
      />
      
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-[rgba(0,240,255,0.1)] relative z-10">
        {icon}
      </div>
      
      {expanded && (
        <span className="truncate relative z-10">{label}</span>
      )}
      
      {active && (
        <motion.div 
          layoutId="sidebar-active-indicator"
          className="absolute inset-0 bg-[var(--impulse-primary)] opacity-10 rounded-lg z-0" 
        />
      )}
    </div>
  );
}

const sidebarSections = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" />, path: "/admin/overview" },
  { id: "users", label: "Users", icon: <Users className="w-5 h-5" />, path: "/admin/users" },
  { id: "builds", label: "Builds", icon: <Package className="w-5 h-5" />, path: "/admin/builds" },
  { id: "content", label: "Content", icon: <FileText className="w-5 h-5" />, path: "/admin/content" },
  { id: "data", label: "Data Maestro", icon: <Database className="w-5 h-5" />, path: "/admin/data" },
  { id: "themes", label: "Themes", icon: <PaintBucket className="w-5 h-5" />, path: "/admin/themes" },
  { id: "analytics", label: "Analytics", icon: <BarChart className="w-5 h-5" />, path: "/admin/analytics" },
  { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" />, path: "/admin/settings" },
];

interface AdminSidebarProps {
  collapsed?: boolean;
}

export function AdminSidebar({ collapsed = false }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarExpanded, activeSection, toggleSidebar } = useAdminStore();
  const [dragSource, setDragSource] = useAtom(dragSourceAtom);
  const [_, setDragTarget] = useAtom(dragTargetAtom);
  const [sectionCollapsed, setSectionCollapsed] = useState<Record<string, boolean>>({});
  
  // Extract active section from path
  const currentPath = location.pathname;
  const activeItem = currentPath.split('/').pop() || 'overview';
  
  const handleDragStart = (id: string, e: React.DragEvent<HTMLDivElement>) => {
    setDragSource(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragEnd = () => {
    setDragSource(null);
  };

  const handleIconClick = (path: string) => {
    navigate(path);
  };
  
  const toggleSection = (sectionId: string) => {
    setSectionCollapsed(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className={cn(
        "impulse-sidebar",
        "fixed top-0 left-0 z-30 h-full",
        "transition-all duration-300 ease-in-out overflow-hidden",
        "bg-[var(--impulse-bg-overlay)] backdrop-filter backdrop-blur-xl",
        "border-r border-[var(--impulse-border-normal)]",
        "pt-20", // Top padding for the main nav
        collapsed ? "w-[65px]" : "w-64"
      )}
    >
      <div className="flex flex-col h-full p-3 gap-1">
        <div className="flex justify-end mb-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-secondary)]"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </motion.button>
        </div>
        
        <div className="space-y-1">
          {sidebarSections.map(section => (
            <SidebarIcon
              key={section.id}
              id={section.id}
              icon={section.icon}
              label={section.label}
              active={activeItem === section.id}
              expanded={!collapsed}
              onClick={() => handleIconClick(section.path)}
              onDragStart={(e) => handleDragStart(section.id, e)}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
        
        <div className="my-3 border-t border-[var(--impulse-border-normal)] relative">
          <div className="absolute inset-0 opacity-30 blur-sm bg-[var(--impulse-primary)]" />
        </div>
        
        {!collapsed && (
          <div className="mt-3 space-y-1">
            <div className="px-3 py-2">
              <button 
                onClick={() => toggleSection('tools')}
                className="flex items-center justify-between w-full text-sm text-[var(--impulse-text-secondary)]"
              >
                <span>Admin Tools</span>
                {sectionCollapsed['tools'] ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
              </button>
              
              {!sectionCollapsed['tools'] && (
                <div className="mt-2 ml-2 space-y-1">
                  <button className="flex items-center gap-2 px-2 py-1 text-xs rounded-md hover:bg-[rgba(0,240,255,0.1)] text-[var(--impulse-text-secondary)]">
                    <Shield className="w-4 h-4 text-[var(--impulse-primary)]" />
                    <span>Permission Manager</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-auto mb-4">
          <SidebarIcon
            id="backToSite"
            icon={<Home className="w-5 h-5" />}
            label="Back to Site"
            expanded={!collapsed}
            onClick={() => navigate('/')}
          />
        </div>
      </div>
    </motion.aside>
  );
}
