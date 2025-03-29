
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  Home, 
  Plus,
  Edit,
  X
} from "lucide-react";
import { useAdminStore } from "@/admin/store/admin.store";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { adminNavigationItems, defaultTopNavShortcuts } from "@/admin/config/navigation.config";
import "@/admin/styles/admin-topnav.css";

interface TopNavShortcutProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  isEditMode?: boolean;
  onRemove?: (id: string) => void;
}

function TopNavShortcut({ id, label, icon, path, isEditMode, onRemove }: TopNavShortcutProps) {
  const navigate = useNavigate();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  
  const handleClick = () => {
    navigate(path);
  };
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(id);
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
        <TooltipTrigger asChild>
          <motion.div
            className="admin-shortcut"
            onClick={handleClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
          >
            <div className="admin-shortcut__icon">
              {icon}
            </div>
            
            {isEditMode && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
                onClick={handleRemove}
              >
                <X className="w-3 h-3" />
              </motion.button>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-[var(--impulse-bg-overlay)] border-[var(--impulse-border-normal)] backdrop-blur-xl">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface AdminTopNavProps {
  title?: string;
}

export function AdminTopNav({ title = "Admin Dashboard" }: AdminTopNavProps) {
  const navigate = useNavigate();
  const { 
    toggleSidebar, 
    pinnedTopNavItems,
    setPinnedTopNavItems,
    dragSource,
    setDragTarget,
    dragTarget 
  } = useAdminStore();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  
  // Initialize pinned items on component mount if they're empty
  useEffect(() => {
    if (!pinnedTopNavItems || pinnedTopNavItems.length === 0) {
      setPinnedTopNavItems(defaultTopNavShortcuts);
    }
  }, [pinnedTopNavItems, setPinnedTopNavItems]);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDraggingOver) {
      setIsDraggingOver(true);
    }
    setDragTarget('topnav');
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
    if (itemId && !pinnedTopNavItems.includes(itemId)) {
      setPinnedTopNavItems([...pinnedTopNavItems, itemId]);
    }
    
    setDragTarget(null);
  };
  
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };
  
  const removeShortcut = (id: string) => {
    setPinnedTopNavItems(pinnedTopNavItems.filter(item => item !== id));
  };
  
  const shortcuts = adminNavigationItems.filter(item => 
    pinnedTopNavItems.includes(item.id)
  );
  
  const dropzoneStyles = cn(
    "admin-topnav__dropzone",
    {
      "active": isDraggingOver || dragTarget === 'topnav',
      "dropzone-pulse": isEditMode && !isDraggingOver
    }
  );
  
  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="admin-topnav"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSidebar}
        className="p-2 rounded-full hover:bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-secondary)]"
      >
        <Menu className="w-5 h-5" />
      </motion.button>
      
      <h1 className="admin-topnav__title ml-3">
        <span>{title}</span>
      </h1>
      
      <div
        ref={dropzoneRef}
        className={dropzoneStyles}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="admin-topnav__shortcuts">
          <AnimatePresence mode="popLayout">
            {shortcuts.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
              >
                <TopNavShortcut
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  path={item.path}
                  isEditMode={isEditMode}
                  onRemove={removeShortcut}
                />
              </motion.div>
            ))}
            
            {isEditMode && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-full w-6 h-6 bg-[var(--impulse-primary)] flex items-center justify-center"
              >
                <Plus className="w-4 h-4 text-[var(--impulse-bg-overlay)]" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="ml-auto flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleEditMode}
          className={cn(
            "p-2 rounded-full transition-colors",
            isEditMode 
              ? "bg-[var(--impulse-primary)] text-[var(--impulse-bg-overlay)]" 
              : "text-[var(--impulse-text-secondary)] hover:bg-[rgba(0,240,255,0.2)]"
          )}
        >
          {isEditMode ? <X className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-secondary)]"
        >
          <Search className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-secondary)]"
        >
          <Bell className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-secondary)]"
        >
          <Settings className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(0,240,255,0.1)] text-[var(--impulse-text-primary)] hover:bg-[rgba(0,240,255,0.2)]"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm">Exit Admin</span>
        </motion.button>
      </div>
    </motion.header>
  );
}
