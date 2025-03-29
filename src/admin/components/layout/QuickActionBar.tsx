
import React from "react";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { pinnedActionsAtom, dragTargetAtom, dragSourceAtom } from "@/admin/atoms";
import { UserPlus, Database, Palette, Settings, Plus, Package, BarChart, FileText, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Define the available quick actions with paths
const availableActions = {
  users: { 
    icon: <Users className="w-5 h-5" />, 
    tooltip: "User Management",
    path: "/admin/users"
  },
  builds: { 
    icon: <Package className="w-5 h-5" />, 
    tooltip: "Build Manager",
    path: "/admin/builds"
  },
  database: { 
    icon: <Database className="w-5 h-5" />, 
    tooltip: "Database",
    path: "/admin/data"
  },
  themes: { 
    icon: <Palette className="w-5 h-5" />, 
    tooltip: "Themes",
    path: "/admin/themes"
  },
  analytics: { 
    icon: <BarChart className="w-5 h-5" />, 
    tooltip: "Analytics",
    path: "/admin/analytics" 
  },
  settings: { 
    icon: <Settings className="w-5 h-5" />, 
    tooltip: "Settings",
    path: "/admin/settings"
  },
  content: {
    icon: <FileText className="w-5 h-5" />,
    tooltip: "Content Management",
    path: "/admin/content"
  }
};

// QuickAction component
function QuickAction({ 
  id, 
  icon, 
  tooltip, 
  path,
  onRemove 
}: { 
  id: string; 
  icon: React.ReactNode; 
  tooltip: string;
  path: string;
  onRemove?: () => void; 
}) {
  const navigate = useNavigate();
  const [dragSource, setDragSource] = useAtom(dragSourceAtom);
  const [dragTarget, setDragTarget] = useAtom(dragTargetAtom);
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Handle clicking on the action
  const handleClick = () => {
    navigate(path);
  };
  
  // Handle dragging
  const handleDragStart = (e: React.DragEvent) => {
    setDragSource(id);
  };
  
  // Handle dropping actions onto this slot
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragTarget(null);
    // Add drop logic here
  };
  
  // Only handle dragover if we're dragging something
  const handleDragOver = (e: React.DragEvent) => {
    if (dragSource !== null) {
      e.preventDefault();
      setDragTarget(id);
    }
  };
  
  const handleDragEnd = () => {
    setDragSource(null);
    setDragTarget(null);
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
      draggable
      className="impulse-quick-action relative group cursor-pointer"
      data-tooltip={tooltip}
    >
      {icon}
      
      {isHovered && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--impulse-secondary)] flex items-center justify-center text-white text-xs"
        >
          ×
        </button>
      )}
      
      {/* Tooltip */}
      <div className={cn(
        "absolute right-full mr-2 px-2 py-1 rounded bg-[var(--impulse-bg-overlay)] text-[var(--impulse-text-primary)] text-xs",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
        "pointer-events-none whitespace-nowrap"
      )}>
        {tooltip}
      </div>
    </motion.div>
  );
}

// Empty slot component for adding new actions
function EmptyActionSlot() {
  const [dragTarget, setDragTarget] = useAtom(dragTargetAtom);
  const [showActionSelector, setShowActionSelector] = React.useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragTarget('empty-slot');
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragTarget(null);
    // Handle adding the dropped item
  };
  
  const handleClick = () => {
    setShowActionSelector(true);
    // In a real implementation, this would show a menu of available actions to add
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "impulse-quick-action border-dashed cursor-pointer",
        dragTarget === 'empty-slot' ? "border-[var(--impulse-border-active)]" : "border-[var(--impulse-border-normal)]"
      )}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Plus className="w-5 h-5 text-[var(--impulse-text-secondary)]" />
    </motion.div>
  );
}

export function QuickActionBar() {
  const [pinnedActions, setPinnedActions] = useAtom(pinnedActionsAtom);
  
  const handleRemoveAction = (id: string) => {
    setPinnedActions(pinnedActions.filter(actionId => actionId !== id));
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50"
    >
      {pinnedActions.map(actionId => {
        const action = availableActions[actionId as keyof typeof availableActions];
        if (!action) return null;
        
        return (
          <QuickAction
            key={actionId}
            id={actionId}
            icon={action.icon}
            tooltip={action.tooltip}
            path={action.path}
            onRemove={() => handleRemoveAction(actionId)}
          />
        );
      })}
      
      <EmptyActionSlot />
    </motion.div>
  );
}
