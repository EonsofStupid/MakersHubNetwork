import React from 'react';
import { motion } from 'framer-motion';
import { useAdminSidebar } from './sidebar/AdminSidebarContext';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { toast } from 'sonner';

export const AdminNav = () => {
  const { shortcuts, addShortcut, removeShortcut } = useAdminSidebar();
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const itemId = e.dataTransfer.getData('text/plain');
    if (!shortcuts.includes(itemId)) {
      addShortcut(itemId);
      toast.success(`Added ${itemId} to shortcuts`);
    }
  };

  return (
    <motion.div
      className="admin-topnav"
      onMouseMove={handleMouseMove}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div 
        className={`h-full flex items-center px-4 max-w-7xl mx-auto relative z-50 shortcut-drop-zone ${
          isDraggingOver ? 'dragging-over' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex-1 flex items-center gap-4">
          {shortcuts.map((shortcut) => (
            <motion.div
              key={shortcut}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group"
            >
              <Link
                to={`/admin/${shortcut.toLowerCase()}`}
                className="admin-topnav-item"
              >
                {shortcut}
              </Link>
              <button
                onClick={() => {
                  removeShortcut(shortcut);
                  toast.success(`Removed ${shortcut} from shortcuts`);
                }}
                className="absolute -top-2 -right-2 p-1 rounded-full bg-[#151A24]/20 
                           hover:bg-[#151A24]/40 backdrop-blur-sm opacity-0 
                           group-hover:opacity-100 transition-all duration-300"
              >
                <X className="w-3 h-3 text-white/80" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};