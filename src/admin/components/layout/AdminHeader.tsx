
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import { useThemeEffects } from "@/hooks/useThemeEffects";
import { EffectRenderer } from "@/components/theme/effects/EffectRenderer";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminPreferences } from "@/admin/store/adminPreferences.store";
import { Tooltip } from "@/components/ui/tooltip";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import styles from "./styles/AdminHeader.module.css";
import { AdminShortcutItem } from "./AdminShortcutItem";

interface AdminHeaderProps {
  title: string;
  collapsed?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  title,
  collapsed = false
}) => {
  const navigate = useNavigate();
  const { applyRandomEffect, getEffectForElement } = useThemeEffects({
    maxActiveEffects: 2,
    debounceDelay: 100
  });
  
  const { 
    shortcuts, 
    setShortcuts, 
    isIconOnly, 
    toggleIconOnly 
  } = useAdminPreferences();

  const handleTitleClick = () => {
    applyRandomEffect('admin-title', {
      types: ['glitch', 'cyber'],
      duration: 2000
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(shortcuts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setShortcuts(items);
  };

  const titleEffect = getEffectForElement('admin-title');

  return (
    <header className={styles.adminHeader}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.leftSection}>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/")}
              className={styles.backButton}
            >
              <ArrowLeft className={styles.backIcon} />
            </Button>
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleTitleClick}
            >
              <h1 className={styles.title}>
                <EffectRenderer
                  elementId="admin-title"
                  effect={titleEffect}
                >
                  {title}
                </EffectRenderer>
              </h1>
            </motion.div>
          </div>

          <div className={styles.rightSection}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleIconOnly}
              className={styles.backButton}
            >
              <LayoutGrid className={styles.backIcon} />
            </Button>

            <div className={styles.divider} />

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="shortcuts" direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={styles.shortcutsContainer}
                  >
                    <AnimatePresence>
                      {shortcuts.map((shortcut, index) => (
                        <AdminShortcutItem
                          key={shortcut.id}
                          shortcut={shortcut}
                          index={index}
                          isIconOnly={isIconOnly}
                        />
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
    </header>
  );
};
