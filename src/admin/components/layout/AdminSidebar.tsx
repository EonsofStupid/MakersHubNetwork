
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { hoveredElementAtom, dragSourceAtom, dragTargetAtom } from "@/admin/atoms/ui.atoms";
import { useAdminStore } from "@/admin/store/admin.store";
import { cn } from "@/lib/utils";
import { 
  Home, 
  ChevronLeft, 
  ChevronRight,
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
  onDragStart?: (e: React.DragEvent) => void;
}

function SidebarIcon({ 
  id, 
  icon, 
  label, 
  active = false, 
  expanded = true,
  onClick,
  onDragStart
}: SidebarIconProps) {
  const [hovered, setHovered] = useAtom(hoveredElementAtom);
  const isHovered = hovered === `sidebar-icon-${id}`;
  
  return (
    <motion.div
      draggable
      onDragStart={onDragStart}
      onMouseEnter={() => setHovered(`sidebar-icon-${id}`)}
      onMouseLeave={() => setHovered(null)}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "impulse-drag-item flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg",
        "transition-all duration-300 relative overflow-hidden",
        active ? "bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-accent)]" : 
                "text-[var(--impulse-text-secondary)] hover:bg-[rgba(0,240,255,0.1)]"
      )}
    >
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-[rgba(0,240,255,0.1)]">
        {icon}
      </div>
      
      {expanded && (
        <span className="truncate">{label}</span>
      )}
      
      {active && (
        <motion.div 
          layoutId="sidebar-active-indicator"
          className="absolute inset-0 bg-[var(--impulse-primary)] opacity-10 rounded-lg" 
        />
      )}
    </motion.div>
  );
}

// Admin sidebar sections
const sidebarSections = [
  { 
    id: "overview", 
    label: "Overview", 
    icon: <Home className="w-5 h-5" />, 
    path: "/admin/overview" 
  },
  // Additional sections defined here...
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const { sidebarExpanded, activeSection, toggleSidebar } = useAdminStore();
  const [dragSource, setDragSource] = useAtom(dragSourceAtom);
  const [dragTarget, setDragTarget] = useAtom(dragTargetAtom);
  const [sectionCollapsed, setSectionCollapsed] = useState<Record<string, boolean>>({});
  
  const handleDragStart = (id: string, e: React.DragEvent) => {
    setDragSource(id);
    e.dataTransfer.setData("text/plain", id);
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
        "transition-all duration-300 ease-in-out overflow-hidden z-30",
        "pt-16", // Top padding for the main nav
        sidebarExpanded ? "w-64" : "w-[4.5rem]"
      )}
      style={{ paddingTop: "4rem" }}
    >
      <div className="flex flex-col h-full p-3 gap-1">
        <div className="flex justify-end mb-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-secondary)]"
          >
            {sidebarExpanded ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
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
              active={activeSection === section.id}
              expanded={sidebarExpanded}
              onClick={() => handleIconClick(section.path)}
              onDragStart={(e) => handleDragStart(section.id, e)}
            />
          ))}
        </div>
        
        {/* Section divider with subtle glow */}
        <div className="my-3 border-t border-[var(--impulse-border-normal)] relative">
          <div className="absolute inset-0 opacity-30 blur-sm bg-[var(--impulse-primary)]" />
        </div>
        
        {/* Additional sections here */}
        
        {/* Collapsed section groups with toggles */}
        {sidebarExpanded && (
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
                  {/* Tool items would go here */}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
