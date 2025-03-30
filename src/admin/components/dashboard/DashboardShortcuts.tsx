
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { DashboardShortcut } from '@/admin/components/dashboard/DashboardShortcut';
import { useDragAndDrop } from '@/admin/hooks/useDragAndDrop';
import { DragIndicator } from '@/admin/components/ui/DragIndicator';
import { adminNavigationItems } from '@/admin/config/navigation.config';
import { useAdminStore } from '@/admin/store/admin.store';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MoveHorizontal, Plus } from 'lucide-react';

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.1 
    }
  }
};

export function DashboardShortcuts() {
  const navigate = useNavigate();
  const [editMode] = useAtom(adminEditModeAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const { dashboardShortcuts, setDashboardShortcuts } = useAdminStore();
  
  const { registerDropZone, isDragging, dragTargetId } = useDragAndDrop({
    items: dashboardShortcuts,
    onReorder: setDashboardShortcuts,
    containerId: 'dashboard-shortcuts',
    acceptExternalItems: true
  });

  // Register the container as a drop zone
  useEffect(() => {
    if (containerRef.current) {
      return registerDropZone(containerRef.current);
    }
  }, [registerDropZone]);

  // Filter navigation items to only include those in dashboardShortcuts
  const shortcutItems = adminNavigationItems.filter(item => 
    dashboardShortcuts.includes(item.id)
  );
  
  const handleShortcutClick = (path: string) => {
    navigate(path);
  };
  
  const handleRemoveShortcut = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDashboardShortcuts(dashboardShortcuts.filter(itemId => itemId !== id));
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[var(--impulse-text-primary)] flex items-center gap-2">
          <span>Dashboard Shortcuts</span>
          {editMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full flex items-center gap-1"
            >
              <MoveHorizontal className="w-3 h-3" />
              <span>Drag to add</span>
            </motion.div>
          )}
        </h2>
      </div>

      <motion.div 
        ref={containerRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 min-h-[140px] rounded-xl",
          "border transition-all duration-300",
          isDragging 
            ? "ring-2 ring-primary/50 bg-primary/5 border-primary/30" 
            : "bg-black/20 border-border/30",
          editMode && "border-dashed"
        )}
        id="dashboard-shortcuts"
      >
        <AnimatePresence mode="popLayout">
          {shortcutItems.length > 0 ? (
            shortcutItems.map((item) => (
              <DashboardShortcut
                key={item.id}
                id={item.id}
                title={item.label}
                icon={item.icon}
                description={item.description}
                onClick={() => handleShortcutClick(item.path)}
                onRemove={editMode ? (e) => handleRemoveShortcut(item.id, e) : undefined}
                isEditMode={editMode}
              />
            ))
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground min-h-[200px]"
            >
              {editMode ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Plus className="w-8 h-8 text-primary/70" />
                  </div>
                  <p className="text-sm">Drag items here from the sidebar to create shortcuts</p>
                  <p className="text-xs mt-2 text-primary/70">
                    Tip: Any item from the left navigation can be dragged here
                  </p>
                </>
              ) : (
                <p>No shortcuts added yet. Enter edit mode to customize your dashboard.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Drag indicator for visual feedback */}
      <DragIndicator />
    </div>
  );
}
