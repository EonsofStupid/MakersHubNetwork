
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/admin/store/admin.store";
import { adminNavigationItems, defaultDashboardShortcuts } from "@/admin/config/navigation.config";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardShortcut } from "./DashboardShortcut";

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
      icon: item.icon,
      path: item.path,
      permission: item.permission
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
        {isEditMode && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-[var(--impulse-primary)]"
          >
            Edit Mode Active
          </motion.span>
        )}
      </motion.div>
      
      <motion.div 
        className={cn(
          "admin-dashboard-shortcuts grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4",
          (isDraggingOver || dragTarget === 'dashboard') 
            ? "drag-target-highlight" 
            : "p-2",
          dragSource && "transition-all duration-300"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="popLayout">
          {shortcuts.map((shortcut) => (
            <DashboardShortcut
              key={shortcut.id}
              id={shortcut.id}
              title={shortcut.name}
              description={shortcut.description}
              icon={shortcut.icon}
              onClick={() => handleNavigate(shortcut.path)}
              onRemove={isEditMode ? (e) => removeShortcut(shortcut.id, e) : undefined}
              isEditMode={isEditMode}
            />
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
