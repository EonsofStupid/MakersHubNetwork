
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import { AdminTooltip } from '@/admin/components/ui/AdminTooltip';
import { cn } from '@/lib/utils';
import { ChevronRight, GripVertical } from 'lucide-react';
import { 
  adminEditModeAtom, 
  dragSourceIdAtom, 
  isDraggingAtom 
} from '@/admin/atoms/tools.atoms';
import { useDragAndDrop } from '@/admin/hooks/useDragAndDrop';

interface NavigationItemProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  tooltipContent?: React.ReactNode;
  showTooltip?: boolean;
}

// Framer Motion variants
const itemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 400, damping: 30 } },
  exit: { opacity: 0, x: -20 },
  hover: { scale: 1.03, transition: { type: "spring", stiffness: 400, damping: 20 } },
  tap: { scale: 0.97 },
  drag: { scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }
};

const iconMotion = {
  rest: { scale: 1 },
  hover: { scale: 1.1, rotate: 5, transition: { type: "spring", stiffness: 400, damping: 17 } }
};

const glowMotion = {
  rest: { opacity: 0 },
  hover: { opacity: 0.7, transition: { duration: 0.3 } }
};

// Color palettes for randomization
const glowColors = [
  'rgba(0, 240, 255, 0.7)',    // Cyan
  'rgba(255, 45, 110, 0.7)',   // Pink
  'rgba(120, 220, 80, 0.7)',   // Green
  'rgba(255, 180, 0, 0.7)',    // Amber
  'rgba(140, 90, 255, 0.7)'    // Purple
];

export function NavigationItem({
  id,
  label,
  icon,
  description,
  isActive = false,
  onClick,
  className = '',
  tooltipContent,
  showTooltip = false,
}: NavigationItemProps) {
  const [editMode] = useAtom(adminEditModeAtom);
  const [isDragging, setIsDragging] = useAtom(isDraggingAtom);
  const [, setDragSourceId] = useAtom(dragSourceIdAtom);
  const itemRef = useRef<HTMLDivElement>(null);
  const [glowColor, setGlowColor] = useState('');
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Start idle timer
  useEffect(() => {
    const startIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      
      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true);
      }, 10000); // 10 seconds of inactivity
    };
    
    const resetIdleTimer = () => {
      setIsIdle(false);
      startIdleTimer();
    };
    
    // Set up global event listeners
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    
    // Start the initial timer
    startIdleTimer();
    
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
    };
  }, []);
  
  // Generate a random glow color on mount and hover
  useEffect(() => {
    setGlowColor(glowColors[Math.floor(Math.random() * glowColors.length)]);
  }, []);
  
  // Generate a color class based on the item ID for visual variety
  const getColorClass = () => {
    const colors = [
      "from-blue-500/10 to-cyan-500/20",
      "from-purple-500/10 to-pink-500/20",
      "from-emerald-500/10 to-teal-500/20",
      "from-amber-500/10 to-orange-500/20"
    ];
    
    // Create a simple hash from the ID
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Use our custom drag and drop hook
  const { makeDraggable } = useDragAndDrop({
    items: [id],
    containerId: 'admin-nav',
    dragOnlyInEditMode: true
  });

  // Enable drag and drop only in edit mode
  useEffect(() => {
    if (!itemRef.current) return;
    
    // Only make draggable if in edit mode
    if (editMode) {
      return makeDraggable(itemRef.current, id);
    }
  }, [editMode, id, makeDraggable]);

  const colorClass = getColorClass();
  const handleMouseEnter = () => {
    // Randomize glow color on hover
    setGlowColor(glowColors[Math.floor(Math.random() * glowColors.length)]);
  };
  
  // Generate random animation delay for idle state
  const idleAnimationDelay = `${Math.random() * 2}s`;
  
  const content = (
    <motion.div
      ref={itemRef}
      layout
      variants={itemVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      whileTap="tap"
      onMouseEnter={handleMouseEnter}
      className={cn(
        "nav-item relative overflow-hidden", 
        "flex items-center py-2 px-3 rounded-lg my-1 transition-all",
        "text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-text-primary)]",
        isActive ? "active bg-[var(--impulse-primary)]/10 text-[var(--impulse-primary)]" : "", 
        editMode ? "draggable cursor-grab active:cursor-grabbing" : "cursor-pointer",
        isIdle && "idle-flicker",
        className
      )}
      onClick={onClick}
      data-id={id}
      style={{
        "--glow-color": glowColor,
        animationDelay: idleAnimationDelay
      } as React.CSSProperties}
    >
      {/* Electric overlay */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-0"
        animate={isActive ? {
          opacity: [0.1, 0.3, 0.1],
          transition: { duration: 4, repeat: Infinity }
        } : {}}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--glow-color)] to-transparent opacity-20" />
      </motion.div>
      
      {/* Edit mode indicator */}
      {editMode && (
        <motion.div 
          className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
          animate={{ 
            scale: [1, 1.5, 1], 
            opacity: [0.5, 1, 0.5],
            boxShadow: [
              "0 0 0 rgba(0, 240, 255, 0.4)",
              "0 0 10px rgba(0, 240, 255, 0.7)",
              "0 0 0 rgba(0, 240, 255, 0.4)"
            ]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
      
      {/* Background effects */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-r ${colorClass} opacity-0`}
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 0.3 }
        }}
        initial="rest"
        animate={isActive ? "hover" : "rest"}
        whileHover="hover"
      />
      
      {/* Scanlines effect for active items */}
      {isActive && (
        <div className="absolute inset-0 bg-repeat-y pointer-events-none z-[-1]" 
             style={{
               backgroundImage: 'linear-gradient(0deg, transparent 50%, rgba(0, 240, 255, 0.03) 50%)',
               backgroundSize: '100% 4px'
             }}
        />
      )}
      
      {/* Drag handle in edit mode */}
      {editMode && (
        <motion.div 
          className="nav-item__drag-handle mr-2 text-[var(--impulse-text-secondary)]"
          variants={{
            rest: { x: -10, opacity: 0 },
            hover: { x: 0, opacity: 0.7 }
          }}
          initial="rest"
          whileHover="hover"
        >
          <GripVertical className="w-4 h-4" />
        </motion.div>
      )}
      
      {/* Icon with glow effect */}
      {icon && (
        <motion.div 
          className="nav-item__icon relative flex-shrink-0 mr-3"
          variants={iconMotion}
          initial="rest"
          whileHover="hover"
          animate={isActive ? "hover" : "rest"}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            {icon}
          </div>
          <motion.div 
            className="nav-item__icon-glow absolute inset-0 rounded-full filter blur-md"
            variants={glowMotion}
            initial="rest"
            whileHover="hover"
            animate={isActive ? "hover" : "rest"}
            style={{ 
              backgroundColor: "var(--glow-color)",
              opacity: 0
            }}
          />
        </motion.div>
      )}
      
      {/* Label */}
      <span className="nav-item__label font-medium truncate">{label}</span>
      
      {/* Active indicator */}
      {isActive && (
        <motion.span
          className="ml-auto"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -5 }}
        >
          <ChevronRight className="h-4 w-4 text-primary" />
        </motion.span>
      )}
      
      {/* Cyber glitch effect (subtle) */}
      {isActive && (
        <motion.div 
          className="absolute inset-0 bg-primary/5 pointer-events-none"
          animate={{ 
            clipPath: [
              "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
              "polygon(0 5%, 100% 0, 100% 95%, 0 100%)",
              "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        />
      )}
      
      {/* Electric border for active items */}
      {isActive && (
        <div className="absolute inset-0 electric-border pointer-events-none"></div>
      )}
    </motion.div>
  );

  if (tooltipContent && showTooltip) {
    return (
      <AdminTooltip content={tooltipContent} side="right">
        {content}
      </AdminTooltip>
    );
  }

  return content;
}
