
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { NavigationItem } from '@/admin/components/navigation/NavigationItem';
import { useDragAndDrop } from '@/admin/hooks/useDragAndDrop';
import { DragIndicator } from '@/admin/components/ui/DragIndicator';
import { adminNavigationItems } from '@/admin/config/navigation.config';
import { useAdminStore } from '@/admin/store/admin.store';

export function DashboardShortcuts() {
  const [editMode] = useAtom(adminEditModeAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const { dashboardShortcuts, setDashboardShortcuts } = useAdminStore();
  
  const { registerDropZone } = useDragAndDrop({
    items: dashboardShortcuts,
    onReorder: setDashboardShortcuts,
    containerId: 'dashboard-shortcuts'
  });

  // Register the container as a drop zone
  useEffect(() => {
    if (editMode && containerRef.current) {
      return registerDropZone(containerRef.current);
    }
  }, [editMode, registerDropZone]);

  // Filter navigation items to only include those in dashboardShortcuts
  const shortcutItems = adminNavigationItems.filter(item => 
    dashboardShortcuts.includes(item.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Dashboard Shortcuts</h2>
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
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        id="dashboard-shortcuts"
      >
        {shortcutItems.map((item) => (
          <NavigationItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            tooltipContent={item.description}
            className="dashboard-shortcut"
          />
        ))}
      </motion.div>

      {/* Drag indicator for visual feedback */}
      <DragIndicator />
    </div>
  );
}
