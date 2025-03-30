
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { pinnedActionsAtom, dragTargetAtom, dragSourceAtom } from "@/admin/atoms";
import { UserPlus, Database, Palette, Settings, Plus, Package, BarChart, FileText, Users, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { QuickAction } from "@/admin/types/tools.types";
import { useToast } from "@/hooks/use-toast";
import { useAdminStore } from "@/admin/store/admin.store";

// Define the available quick actions with paths
const availableActions: Record<string, QuickAction> = {
  users: { 
    id: "users",
    icon: "Users",
    tooltip: "User Management",
    path: "/admin/users"
  },
  builds: { 
    id: "builds",
    icon: "Package", 
    tooltip: "Build Manager",
    path: "/admin/builds"
  },
  reviews: { 
    id: "reviews",
    icon: "MessageSquare", 
    tooltip: "Review Management",
    path: "/admin/reviews"
  },
  database: { 
    id: "database",
    icon: "Database", 
    tooltip: "Database",
    path: "/admin/data"
  },
  themes: { 
    id: "themes",
    icon: "Palette", 
    tooltip: "Themes",
    path: "/admin/themes"
  },
  analytics: { 
    id: "analytics",
    icon: "BarChart", 
    tooltip: "Analytics",
    path: "/admin/analytics" 
  },
  settings: { 
    id: "settings",
    icon: "Settings", 
    tooltip: "Settings",
    path: "/admin/settings"
  },
  content: {
    id: "content",
    icon: "FileText",
    tooltip: "Content Management",
    path: "/admin/content"
  }
};

// Get the icon component by name
const getIconByName = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    Users: <Users className="w-5 h-5" />,
    Package: <Package className="w-5 h-5" />,
    Database: <Database className="w-5 h-5" />,
    Palette: <Palette className="w-5 h-5" />,
    BarChart: <BarChart className="w-5 h-5" />,
    Settings: <Settings className="w-5 h-5" />,
    FileText: <FileText className="w-5 h-5" />,
    UserPlus: <UserPlus className="w-5 h-5" />,
    MessageSquare: <MessageSquare className="w-5 h-5" />
  };
  
  return iconMap[iconName] || <Settings className="w-5 h-5" />;
};

// QuickActionItem component
function QuickActionItem({ 
  id, 
  icon, 
  tooltip, 
  path,
  onRemove 
}: { 
  id: string; 
  icon: string; 
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
  
  // HTML Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', id);
    setDragSource(id);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragSource !== null && dragSource !== id) {
      setDragTarget(id);
    }
  };
  
  const handleDragLeave = () => {
    if (dragTarget === id) {
      setDragTarget(null);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragTarget(null);
    // Add drop logic here for reordering
  };
  
  const handleDragEnd = () => {
    setDragSource(null);
    setDragTarget(null);
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Inner div to handle HTML drag and drop operations */}
      <div 
        className={cn(
          "impulse-quick-action",
          dragTarget === id ? "ring-2 ring-[var(--impulse-primary)]" : ""
        )}
        data-tooltip={tooltip}
        draggable="true"
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {getIconByName(icon)}
      </div>
      
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
  const { toast } = useToast();
  const { dragSource } = useAdminStore();
  const [pinnedActions, setPinnedActions] = useAtom(pinnedActionsAtom);
  const [dragTarget, setDragTarget] = useAtom(dragTargetAtom);
  const [showActionSelector, setShowActionSelector] = React.useState(false);
  
  // HTML Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    if (dragSource) {
      e.preventDefault();
      setDragTarget('empty-slot');
    }
  };
  
  const handleDragLeave = () => {
    if (dragTarget === 'empty-slot') {
      setDragTarget(null);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedItemId = e.dataTransfer.getData('text/plain');
    
    if (droppedItemId && !pinnedActions.includes(droppedItemId) && availableActions[droppedItemId]) {
      setPinnedActions([...pinnedActions, droppedItemId]);
      toast({
        title: "Action Added",
        description: `${availableActions[droppedItemId].tooltip} has been added to your quick actions`,
      });
    }
    
    setDragTarget(null);
  };
  
  const handleClick = () => {
    setShowActionSelector(true);
    // In a real implementation, this would show a menu of available actions to add
    toast({
      title: "Adding actions",
      description: "Drag items from the sidebar to add them here",
    });
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Inner div to handle HTML drag and drop operations */}
      <div
        className={cn(
          "impulse-quick-action border-dashed cursor-pointer",
          dragTarget === 'empty-slot' || (dragSource && !dragTarget)
            ? "ring-2 ring-[var(--impulse-primary)] border-[var(--impulse-border-active)] bg-[var(--impulse-primary)]/10"
            : "border-[var(--impulse-border-normal)]"
        )}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Plus className="w-5 h-5 text-[var(--impulse-text-secondary)]" />
      </div>
    </motion.div>
  );
}

export function QuickActionBar() {
  const { toast } = useToast();
  const [pinnedActions, setPinnedActions] = useAtom(pinnedActionsAtom);
  
  const handleRemoveAction = (id: string) => {
    setPinnedActions(pinnedActions.filter(actionId => actionId !== id));
    toast({
      title: "Action removed",
      description: `${availableActions[id]?.tooltip || "Action"} has been removed`,
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50"
    >
      <AnimatePresence mode="popLayout">
        {pinnedActions.map(actionId => {
          const action = availableActions[actionId];
          if (!action) return null;
          
          return (
            <motion.div
              key={actionId}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <QuickActionItem
                id={action.id}
                icon={action.icon}
                tooltip={action.tooltip}
                path={action.path}
                onRemove={() => handleRemoveAction(actionId)}
              />
            </motion.div>
          );
        })}
        
        <motion.div layout key="empty-slot">
          <EmptyActionSlot />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
