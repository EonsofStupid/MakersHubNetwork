
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/admin/store/admin.store';
import { adminNavigationItems } from '@/admin/config/navigation.config';
import { useAtom } from 'jotai';
import { adminEditModeAtom, isDraggingAtom } from '@/admin/atoms/tools.atoms';
import { useToast } from '@/hooks/use-toast';
import { useDragAndDrop } from '@/admin/hooks/useDragAndDrop';
import { Card } from '@/components/ui/card';

export function DashboardShortcuts() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditMode] = useAtom(adminEditModeAtom);
  const [isDragging] = useAtom(isDraggingAtom);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  const { 
    dashboardShortcuts, 
    setDashboardShortcuts,
    isDashboardCollapsed,
    setDashboardCollapsed
  } = useAdminStore();

  // Use the draggable hook for the dashboard shortcuts
  const { registerDropZone } = useDragAndDrop({
    items: dashboardShortcuts,
    onReorder: setDashboardShortcuts,
    containerId: 'dashboard-shortcuts',
    acceptExternalItems: true
  });

  // Register the dashboard as a drop zone
  useEffect(() => {
    if (dropZoneRef.current) {
      return registerDropZone(dropZoneRef.current);
    }
  }, [registerDropZone]);
  
  // Get icons for the dashboard
  const shortcutItems = adminNavigationItems
    .filter(item => dashboardShortcuts.includes(item.id))
    .map(item => ({
      id: item.id,
      icon: item.icon,
      label: item.label,
      path: item.path
    }));
  
  const removeShortcut = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDashboardShortcuts(dashboardShortcuts.filter(item => item !== id));
    
    toast({
      title: "Removed from Dashboard",
      description: "Item has been removed from your dashboard shortcuts",
    });
  };
  
  const handleShortcutClick = (path: string) => {
    navigate(path);
  };
  
  const toggleCollapsed = () => {
    setDashboardCollapsed(!isDashboardCollapsed);
  };
  
  if (isDashboardCollapsed) {
    return (
      <div className="mb-6">
        <button 
          onClick={toggleCollapsed}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Show dashboard shortcuts</span>
        </button>
      </div>
    );
  }
  
  return (
    <Card className="p-4 mb-6 backdrop-blur-md bg-background/30 border border-border/30 glassmorphism">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Quick Access</h2>
        <button 
          onClick={toggleCollapsed}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <motion.div 
        ref={dropZoneRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn(
          "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3",
          isDragging && "ring-2 ring-dashed ring-primary/50 bg-primary/5 p-2 rounded-md",
          isEditMode && "ring-2 ring-dashed ring-primary/20 p-2 rounded-md"
        )}
        id="dashboard-shortcuts"
        data-container-id="dashboard-shortcuts"
      >
        <AnimatePresence mode="popLayout">
          {shortcutItems.length > 0 ? (
            shortcutItems.map((item) => (
              <motion.div
                key={item.id}
                layoutId={`dashboard-${item.id}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                className="relative"
                data-id={item.id}
              >
                <div
                  onClick={() => handleShortcutClick(item.path)}
                  className="flex flex-col items-center justify-center p-4 rounded-md 
                            bg-card/40 hover:bg-card/60 border border-border/30 
                            transition-all cursor-pointer h-24 electric-background"
                >
                  <div className="text-primary mb-2">
                    {item.icon}
                  </div>
                  <span className="text-sm">{item.label}</span>
                </div>
                
                {isEditMode && (
                  <button
                    onClick={(e) => removeShortcut(item.id, e)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 
                              text-white shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </motion.div>
            ))
          ) : (
            isEditMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-4 py-8 text-center text-muted-foreground"
              >
                <p className="mb-2">Drag items here from sidebar to create shortcuts</p>
                <p className="text-xs">These shortcuts will appear on your dashboard for quick access</p>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </motion.div>
      
      {isEditMode && shortcutItems.length > 0 && (
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Drag to reorder • Click the X to remove
        </p>
      )}
    </Card>
  );
}
