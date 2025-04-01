
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAdminStore } from '@/admin/store/admin.store';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { adminNavigationItems } from '@/admin/config/navigation.config';
import { useDragAndDrop } from '@/admin/hooks/useDragAndDrop';
import { DashboardShortcut } from './DashboardShortcut';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardShortcutsProps {
  className?: string;
}

export function DashboardShortcuts({ className = '' }: DashboardShortcutsProps) {
  const shortcutsRef = useRef<HTMLDivElement>(null);
  const [isEditMode] = useAtom(adminEditModeAtom);
  const { dashboardItems, setDashboardItems, savePreferences } = useAdminStore();
  const navigate = useNavigate();
  
  // Set up drag and drop
  const { registerDropZone, isDragging } = useDragAndDrop({
    items: dashboardItems,
    onReorder: (newItems) => {
      setDashboardItems(newItems);
      savePreferences();
    },
    containerId: 'dashboard-shortcuts',
    dragOnlyInEditMode: true,
    acceptExternalItems: true
  });
  
  // Register the shortcuts container as a drop zone
  useEffect(() => {
    if (shortcutsRef.current) {
      return registerDropZone(shortcutsRef.current);
    }
  }, [registerDropZone]);
  
  // Handle navigation when a shortcut is clicked
  const handleShortcutClick = (id: string) => {
    const item = adminNavigationItems.find(item => item.id === id);
    if (item) {
      navigate(item.path);
    }
  };
  
  // Handle removing an item from shortcuts
  const handleRemoveItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newShortcuts = dashboardItems.filter(item => item !== id);
    setDashboardItems(newShortcuts);
    savePreferences();
  };
  
  // Filter shortcuts to only show items that exist in navigation config
  const visibleShortcuts = dashboardItems.filter(id => 
    adminNavigationItems.some(item => item.id === id)
  );
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle>Quick Access</CardTitle>
        <CardDescription>
          {isEditMode 
            ? "Drag items here from the sidebar for quick access" 
            : "Your most important tools in one place"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          ref={shortcutsRef}
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 ${
            isEditMode ? 'edit-mode-highlight border border-dashed border-primary/50 rounded-lg p-4' : ''
          } ${isDragging ? 'bg-primary/5 rounded-lg' : ''}`}
          data-container-id="dashboard-shortcuts"
        >
          <AnimatePresence mode="popLayout">
            {visibleShortcuts.length > 0 ? (
              visibleShortcuts.map(id => {
                const item = adminNavigationItems.find(navItem => navItem.id === id);
                if (!item) return null;
                
                return (
                  <DashboardShortcut
                    key={id}
                    id={id}
                    icon={item.icon}
                    label={item.label}
                    onClick={() => handleShortcutClick(id)}
                    onRemove={isEditMode ? (e) => handleRemoveItem(id, e) : undefined}
                    isEditMode={isEditMode}
                  />
                );
              })
            ) : (
              isEditMode && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full flex flex-col items-center justify-center h-24 text-muted-foreground"
                >
                  <Plus className="w-8 h-8 mb-2 text-primary/50" />
                  <span>Drag items here from the sidebar</span>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
