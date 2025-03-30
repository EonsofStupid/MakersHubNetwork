
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

export function DashboardShortcuts() {
  const navigate = useNavigate();
  const [editMode] = useAtom(adminEditModeAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const { dashboardShortcuts, setDashboardShortcuts } = useAdminStore();
  
  const { registerDropZone, isDragging, dragTargetId } = useDragAndDrop({
    items: dashboardShortcuts,
    onReorder: setDashboardShortcuts,
    containerId: 'dashboard-shortcuts'
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
        <h2 className="text-xl font-semibold text-[var(--impulse-text-primary)]">Dashboard Shortcuts</h2>
        {editMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full"
          >
            Edit Mode Active
          </motion.div>
        )}
      </div>

      <motion.div 
        ref={containerRef}
        className={cn(
          "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 min-h-[140px] rounded-xl bg-black/20 border border-border/30",
          isDragging && "ring-2 ring-primary/20 bg-primary/5"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground"
            >
              {editMode ? (
                <>
                  <p>Drag menu items here to add shortcuts</p>
                  <p className="text-xs mt-1 text-primary">Items from the sidebar can be dragged here</p>
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
