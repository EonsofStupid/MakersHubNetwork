
import React from "react";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { pinnedActionsAtom, dragTargetAtom } from "@/admin/atoms/ui.atoms";
import { UserPlus, Database, Palette, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the available quick actions
const availableActions = {
  users: { icon: <UserPlus className="w-5 h-5" />, tooltip: "User Management" },
  database: { icon: <Database className="w-5 h-5" />, tooltip: "Database" },
  themes: { icon: <Palette className="w-5 h-5" />, tooltip: "Themes" },
  settings: { icon: <Settings className="w-5 h-5" />, tooltip: "Settings" },
};

// QuickAction component
function QuickAction({ 
  id, 
  icon, 
  tooltip, 
  onRemove 
}: { 
  id: string; 
  icon: React.ReactNode; 
  tooltip: string; 
  onRemove?: () => void; 
}) {
  const [dragTarget, setDragTarget] = useAtom(dragTargetAtom);
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Handle dropping actions onto this slot
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragTarget(null);
    // Add drop logic here
  };
  
  // Only handle dragover if we're dragging something
  const handleDragOver = (e: React.DragEvent) => {
    if (dragTarget !== null) {
      e.preventDefault();
      setDragTarget(id);
    }
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="impulse-quick-action relative group"
      data-tooltip={tooltip}
    >
      {icon}
      
      {isHovered && onRemove && (
        <button
          onClick={onRemove}
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

// Empty slot component
function EmptyActionSlot() {
  const [dragTarget, setDragTarget] = useAtom(dragTargetAtom);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragTarget('empty-slot');
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragTarget(null);
    // Handle adding the dropped item
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={cn(
        "impulse-quick-action border-dashed",
        dragTarget === 'empty-slot' ? "border-[var(--impulse-border-active)]" : "border-[var(--impulse-border-normal)]"
      )}
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
      className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20"
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
            onRemove={() => handleRemoveAction(actionId)}
          />
        );
      })}
      
      <EmptyActionSlot />
    </motion.div>
  );
}
