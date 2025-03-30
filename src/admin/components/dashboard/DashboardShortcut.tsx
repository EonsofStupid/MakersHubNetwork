
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminTooltip } from '../ui/AdminTooltip';

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

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
  hover: { y: -5, transition: { type: "spring", stiffness: 400, damping: 10 } },
  tap: { scale: 0.97, transition: { duration: 0.1 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
};

const glowVariants = {
  initial: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.3 } }
};

const iconVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1, rotate: 5, transition: { type: "spring", stiffness: 400, damping: 10 } },
  tap: { scale: 0.9, rotate: 0, transition: { duration: 0.1 } }
};

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
      "from-blue-500/10 to-cyan-500/20 border-blue-500/30 text-blue-500",
      "from-purple-500/10 to-pink-500/20 border-purple-500/30 text-purple-500",
      "from-emerald-500/10 to-teal-500/20 border-emerald-500/30 text-emerald-500",
      "from-amber-500/10 to-orange-500/20 border-amber-500/30 text-amber-500"
    ];
    
    return colors[colorIndex];
  };
  
  const effectClass = getEffectClass();
  const colorClass = getColorClass();
  
  return (
    <AdminTooltip 
      content={description || title}
      side="bottom"
      delay={500}
    >
      <motion.div
        layoutId={`dashboard-${id}`}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover="hover"
        whileTap="tap"
        data-id={id}
        className={cn(
          "dashboard-shortcut relative aspect-square cursor-pointer p-4 flex flex-col items-center justify-center",
          "rounded-xl backdrop-blur-md border overflow-hidden",
          `bg-gradient-to-br ${colorClass}`,
          isEditMode && "ring-2 ring-primary/30",
          className
        )}
        onClick={onClick}
      >
        {/* Main icon */}
        <motion.div 
          className="dashboard-shortcut__icon flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-white/10 relative z-10"
          variants={iconVariants}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            variants={glowVariants}
            initial="initial"
            whileHover="hover"
            animate={isEditMode ? "hover" : "initial"}
            transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
          />
          {icon}
        </motion.div>
        
        {/* Title */}
        <h3 className="dashboard-shortcut__title text-center font-medium">{title}</h3>
        
        {/* Brief description if available */}
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
          
          {/* Scan line effect */}
          <motion.div
            className="absolute w-full h-10 bg-white/5 -left-full"
            animate={{ 
              left: ["100%", "-100%"],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 1
            }}
          />
          
          {/* Horizontal lines */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i}
                className="w-full h-[1px] bg-white/50"
                style={{ top: `${i * 10}%` }}
              />
            ))}
          </div>
        </div>
        
        {/* Remove button in edit mode */}
        {isEditMode && onRemove && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center z-20"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(e);
            }}
          >
            <X className="w-3 h-3" />
          </motion.button>
        )}
        
        {/* Edit mode indicator */}
        {isEditMode && (
          <motion.div 
            className="absolute bottom-2 right-2 w-2 h-2 bg-primary rounded-full"
            animate={{ 
              scale: [1, 1.5, 1], 
              opacity: [0.5, 1, 0.5] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity 
            }}
          />
        )}
      </motion.div>
    </AdminTooltip>
  );
}
