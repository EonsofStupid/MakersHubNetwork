
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardShortcutProps {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  onClick: () => void;
  onRemove?: (e: React.MouseEvent) => void;
  isEditMode?: boolean;
  className?: string;
}

export function DashboardShortcut({
  id,
  title,
  description,
  icon,
  onClick,
  onRemove,
  isEditMode = false,
  className
}: DashboardShortcutProps) {
  // Generate a consistent effect class based on the ID
  const getEffectClass = () => {
    // Create a simple hash from the id string
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Get effect index based on hash
    const effectIndex = Math.abs(hash) % 3;
    return `cyber-effect-${effectIndex + 1}`;
  };
  
  // Generate a color class based on the ID
  const getColorClass = () => {
    // Create a hash from the id string
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Get a value between 0 and 3 to select one of the predefined colors
    const colorIndex = Math.abs(hash) % 4;
    
    const colors = [
      "text-blue-500 bg-blue-500/10 hover:bg-blue-500/20",
      "text-green-500 bg-green-500/10 hover:bg-green-500/20",
      "text-purple-500 bg-purple-500/10 hover:bg-purple-500/20",
      "text-pink-500 bg-pink-500/10 hover:bg-pink-500/20"
    ];
    
    return colors[colorIndex];
  };
  
  const effectClass = getEffectClass();
  const colorClass = getColorClass();
  
  return (
    <motion.div
      layoutId={`dashboard-${id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -5 }}
      className={cn(
        "dashboard-shortcut relative aspect-square cursor-pointer p-4 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm border overflow-hidden",
        colorClass,
        effectClass,
        className
      )}
      onClick={onClick}
    >
      <div className="dashboard-shortcut__icon flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-white/10 relative z-10">
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ 
            boxShadow: ["0 0 0px rgba(var(--color-primary), 0.4)", "0 0 10px rgba(var(--color-primary), 0.7)", "0 0 0px rgba(var(--color-primary), 0.4)"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {icon}
      </div>
      
      <h3 className="dashboard-shortcut__title text-center font-medium">{title}</h3>
      
      {description && (
        <p className="dashboard-shortcut__description text-xs text-center mt-1 opacity-70">{description}</p>
      )}
      
      {/* CyberGlitch effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-30" />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0"
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"]
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
        />
      </div>
      
      {isEditMode && onRemove && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center z-20"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(e);
          }}
        >
          <X className="w-3 h-3" />
        </motion.button>
      )}
    </motion.div>
  );
}
