
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/admin/store/admin.store";
import { adminNavigationItems, defaultDashboardShortcuts } from "@/admin/config/navigation.config";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import "@/admin/styles/dashboard-shortcuts.css";

export function DashboardShortcuts() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    hasPermission, 
    pinnedDashboardItems, 
    setPinnedDashboardItems, 
    dragSource,
    dragTarget, 
    setDragTarget,
    setDragSource,
    isEditMode
  } = useAdminStore();
  
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);
  
  // Initialize with default shortcuts if not set
  useEffect(() => {
    if (!pinnedDashboardItems || pinnedDashboardItems.length === 0) {
      setPinnedDashboardItems(defaultDashboardShortcuts);
    }
  }, [pinnedDashboardItems, setPinnedDashboardItems]);
  
  // Extract shortcuts from navigation items
  const shortcuts = adminNavigationItems
    .filter(item => pinnedDashboardItems.includes(item.id) && hasPermission(item.permission))
    .map(item => ({
      id: item.id,
      name: item.label,
      description: item.description || "",
      icon: getCyberIcon(item.id, item.icon),
      path: item.path,
      permission: item.permission,
      color: getRandomColor(item.id)
    }));
  
  // Empty slots to fill the grid
  const emptySlots = Math.max(0, 6 - shortcuts.length);
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  const removeShortcut = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedDashboardItems(pinnedDashboardItems.filter(item => item !== id));
    toast({
      title: "Shortcut removed",
      description: "The shortcut has been removed from your dashboard",
    });
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDraggingOver) {
      setIsDraggingOver(true);
    }
    setDragTarget('dashboard');
  };
  
  const handleDragLeave = () => {
    setIsDraggingOver(false);
    setDragTarget(null);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    const itemId = e.dataTransfer.getData('text/plain');
    
    // If it's not already in the pinned items, add it
    if (itemId && !pinnedDashboardItems.includes(itemId)) {
      setPinnedDashboardItems([...pinnedDashboardItems, itemId]);
      
      const item = adminNavigationItems.find(nav => nav.id === itemId);
      if (item) {
        toast({
          title: "Added to dashboard",
          description: `${item.label} has been added to your dashboard`,
        });
      }
    }
    
    setDragTarget(null);
    setDragSource(null); // Clear drag source when dropped
  };
  
  return (
    <div className="relative mb-10">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-4"
      >
        <h2 className="text-xl font-semibold">Quick Access</h2>
      </motion.div>
      
      <motion.div 
        className={cn(
          "admin-dashboard-shortcuts grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4",
          (isDraggingOver || dragTarget === 'dashboard') 
            ? "ring-2 ring-[var(--impulse-primary)] bg-[var(--impulse-primary)]/5 rounded-lg p-2" 
            : "p-2",
          dragSource && "drag-target-highlight transition-all duration-300"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="popLayout">
          {shortcuts.map((shortcut) => (
            <motion.div
              key={shortcut.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className={cn(
                  "dashboard-shortcut group cursor-pointer h-full",
                  getCyberEffect(shortcut.id),
                  shortcut.color
                )}
                onClick={() => handleNavigate(shortcut.path)}
              >
                <div className="dashboard-shortcut__icon">
                  {shortcut.icon}
                </div>
                
                <h3 className="dashboard-shortcut__title">{shortcut.name}</h3>
                
                {shortcut.description && (
                  <p className="dashboard-shortcut__description">{shortcut.description}</p>
                )}
                
                {isEditMode && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    onClick={(e) => removeShortcut(shortcut.id, e)}
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                )}
              </Card>
            </motion.div>
          ))}
          
          {isEditMode && Array.from({ length: emptySlots }).map((_, i) => (
            <motion.div
              key={`empty-${i}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card 
                className="dashboard-shortcut dashboard-shortcut--empty border-dashed border-[var(--impulse-border-normal)] flex flex-col items-center justify-center h-full opacity-60 hover:opacity-100"
              >
                <Plus className="w-8 h-8 text-[var(--impulse-text-secondary)]" />
                <p className="text-xs text-[var(--impulse-text-secondary)] mt-2">Add Shortcut</p>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 text-center text-sm text-[var(--impulse-text-secondary)]"
        >
          <p>Drag items from the sidebar to add them as shortcuts</p>
        </motion.div>
      )}
    </div>
  );
}

// Helper function to get consistent random color based on ID
function getRandomColor(id: string): string {
  // Create a hash from the id string
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Get a value between 0 and 5 to select one of the predefined colors
  const colorIndex = Math.abs(hash) % 5;
  
  const colors = [
    "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "bg-green-500/10 text-green-500 border-green-500/20",
    "bg-purple-500/10 text-purple-500 border-purple-500/20",
    "bg-pink-500/10 text-pink-500 border-pink-500/20",
    "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
  ];
  
  return colors[colorIndex];
}

// Helper function to apply a cyber effect based on ID
function getCyberEffect(id: string): string {
  // Create a hash from the id
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Get a value between 0 and 2 to select one of the predefined effects
  const effectIndex = Math.abs(hash) % 3;
  
  const effects = [
    "cyber-effect-1",
    "cyber-effect-2",
    "cyber-effect-3"
  ];
  
  return effects[effectIndex];
}

// Helper function to wrap icons with their cyber effects
function getCyberIcon(id: string, icon: React.ReactNode): React.ReactNode {
  // Create a hash from the id
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return React.cloneElement(icon as React.ReactElement, {
    className: "w-6 h-6" // Ensure consistent sizing
  });
}
