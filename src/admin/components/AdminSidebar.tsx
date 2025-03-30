
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { 
  Home, 
  ChevronLeft, 
  ChevronRight,
  Edit,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/admin/store/admin.store";
import { adminNavigationItems } from "@/admin/config/navigation.config";
import { useAdmin } from "@/admin/context/AdminContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

// Create a separate file for the component
interface SidebarIconProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
  active?: boolean;
  expanded?: boolean;
  onClick?: () => void;
  onDragStart?: () => void;
  isDraggable?: boolean;
  isEditMode?: boolean;
}

function DragDropIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M8 2v4"></path>
      <path d="M8 14v8"></path>
      <path d="M16 2v8"></path>
      <path d="M16 18v4"></path>
      <path d="M8 8h8"></path>
      <path d="M8 18h8"></path>
    </svg>
  );
}

function SidebarIcon({ 
  id, 
  icon, 
  label, 
  description,
  active = false, 
  expanded = true,
  onClick,
  onDragStart,
  isDraggable = false,
  isEditMode = false
}: SidebarIconProps) {
  const iconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const glowVariants = {
    inactive: { opacity: 0 },
    active: { 
      opacity: [0.4, 0.6, 0.4], 
      transition: { 
        repeat: Infinity, 
        duration: 3,
        ease: "easeInOut" 
      } 
    }
  };

  const dragControls = useDragControls();

  // Custom drag handler for framer-motion
  const handleDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    dragControls.start(event);
    if (onDragStart) {
      onDragStart();
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={cn(
              "flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg",
              "transition-all duration-300 relative overflow-hidden",
              isDraggable && "cursor-grab active:cursor-grabbing",
              active ? "bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-accent)]" : 
                      "text-[var(--impulse-text-secondary)] hover:bg-[rgba(0,240,255,0.1)]"
            )}
            drag={isDraggable && isEditMode}
            dragControls={dragControls}
            onPointerDown={handleDragStart}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            variants={iconVariants}
          >
            {isDraggable && isEditMode && (
              <span className="text-[var(--impulse-text-secondary)] cursor-grab">
                <DragDropIcon className="h-4 w-4" />
              </span>
            )}
            
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-[rgba(0,240,255,0.1)] relative z-10">
              {icon}
              
              {active && (
                <motion.div 
                  className="absolute inset-0 rounded-md bg-[var(--impulse-primary)]"
                  variants={glowVariants}
                  initial="inactive"
                  animate="active"
                  style={{ 
                    filter: "blur(8px)",
                    zIndex: -1
                  }}
                />
              )}
            </div>
            
            {expanded && (
              <span className="truncate relative z-10">{label}</span>
            )}
            
            {active && (
              <motion.div 
                layoutId="sidebar-active-indicator"
                className="absolute inset-0 bg-[var(--impulse-primary)] opacity-10 rounded-lg z-0" 
              />
            )}
          </motion.div>
        </TooltipTrigger>
        {!expanded && (
          <TooltipContent side="right" className="bg-[var(--impulse-bg-overlay)] border-[var(--impulse-border-normal)] text-[var(--impulse-text-primary)]">
            <div className="flex flex-col gap-1">
              <span className="font-semibold">{label}</span>
              {description && <span className="text-xs text-[var(--impulse-text-secondary)]">{description}</span>}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

interface AdminSidebarProps {
  collapsed?: boolean;
}

export function AdminSidebar({ collapsed = false }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { 
    sidebarExpanded, 
    toggleSidebar, 
    isEditMode, 
    toggleEditMode,
    setDragSource 
  } = useAdminStore();
  const { checkPermission } = useAdmin();
  
  const isCollapsed = collapsed ? collapsed : !sidebarExpanded;
  
  const currentPath = location.pathname.split('/').pop() || 'overview';
  const activeItem = currentPath;
  
  const handleIconClick = (path: string) => {
    navigate(path);
  };

  const handleDragStart = (id: string) => {
    setDragSource(id);
    
    // Create custom DOM for drag image
    const item = adminNavigationItems.find(item => item.id === id);
    if (item) {
      toast({
        title: "Dragging Item",
        description: `You're dragging ${item.label}. Drop it in a target area.`,
        duration: 3000,
      });
    }
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "h-full",
        "transition-all duration-300 ease-in-out overflow-hidden",
        "bg-[var(--impulse-bg-overlay)] backdrop-filter backdrop-blur-xl",
        "border border-[var(--impulse-border-normal)] rounded-lg shadow-sm",
        isCollapsed ? "w-[4.5rem]" : "w-full"
      )}
    >
      <div className="flex flex-col h-full p-3 gap-1">
        <div className="flex justify-between items-center mb-2">
          {!isCollapsed && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleEditMode}
              className={cn(
                "p-1 rounded-full text-[var(--impulse-text-secondary)]",
                isEditMode ? "bg-[rgba(0,240,255,0.2)]" : "hover:bg-[rgba(0,240,255,0.2)]"
              )}
            >
              {isEditMode ? (
                <X className="w-5 h-5" />
              ) : (
                <Edit className="w-5 h-5" />
              )}
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className={cn(
              "p-1 rounded-full hover:bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-secondary)]",
              !isCollapsed && "ml-auto"
            )}
          >
            {sidebarExpanded ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </motion.button>
        </div>
        
        <div className="space-y-1 overflow-y-auto scrollbar-thin flex-1">
          <AnimatePresence mode="popLayout">
            {adminNavigationItems.map(item => {
              if (!checkPermission(item.permission)) {
                return null;
              }
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <SidebarIcon
                    id={item.id}
                    icon={item.icon}
                    label={item.label}
                    description={item.description}
                    active={activeItem === item.id}
                    expanded={!isCollapsed}
                    onClick={() => handleIconClick(item.path)}
                    onDragStart={() => handleDragStart(item.id)}
                    isDraggable={true}
                    isEditMode={isEditMode}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {isEditMode && !isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 border border-dashed border-[var(--impulse-border-normal)] rounded-lg text-center"
            >
              <p className="text-xs text-[var(--impulse-text-secondary)] mb-2">
                Drag menu items to the top navigation or dashboard shortcuts
              </p>
              {isEditMode && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-[var(--impulse-primary)]"
                >
                  Edit mode active
                </motion.p>
              )}
            </motion.div>
          )}
        </div>
        
        <div className="mt-auto mb-4">
          <SidebarIcon
            id="backToSite"
            icon={<Home className="w-5 h-5" />}
            label="Back to Site"
            expanded={!isCollapsed}
            onClick={() => navigate('/')}
          />
        </div>
      </div>
    </motion.aside>
  );
}
