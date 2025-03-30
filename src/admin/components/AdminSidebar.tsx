
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, 
  ChevronLeft, 
  ChevronRight,
  Edit,
  Plus,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/admin/store/admin.store";
import { adminNavigationItems } from "@/admin/config/navigation.config";
import { useAdmin } from "@/admin/context/AdminContext";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarIconProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
  active?: boolean;
  expanded?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (onDragStart) {
      onDragStart(e, id);
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
            draggable={isDraggable}
            onDragStart={handleDragStart}
            onClick={onClick}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
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
  const { sidebarExpanded, toggleSidebar, setDragSource } = useAdminStore();
  const { checkPermission } = useAdmin();
  const [isEditMode, setIsEditMode] = useState(false);
  
  const isCollapsed = collapsed ? collapsed : !sidebarExpanded;
  
  const currentPath = location.pathname;
  const activeItem = currentPath.split('/').pop() || 'overview';
  
  const handleIconClick = (path: string) => {
    navigate(path);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', id);
      e.dataTransfer.effectAllowed = 'move';
      setDragSource(id);

      const dragPreview = document.createElement('div');
      dragPreview.className = 'bg-[var(--impulse-bg-overlay)] backdrop-blur-lg p-2 rounded shadow-lg border border-[var(--impulse-primary)]';
      
      const item = adminNavigationItems.find(item => item.id === id);
      if (item) {
        dragPreview.textContent = item.label;
        document.body.appendChild(dragPreview);
        e.dataTransfer.setDragImage(dragPreview, 20, 20);
        setTimeout(() => {
          document.body.removeChild(dragPreview);
        }, 0);
      }
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
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
              className="p-1 rounded-full hover:bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-secondary)]"
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
          {adminNavigationItems.map(item => {
            if (!checkPermission(item.permission)) {
              return null;
            }
            
            return (
              <SidebarIcon
                key={item.id}
                id={item.id}
                icon={item.icon}
                label={item.label}
                description={item.description}
                active={activeItem === item.id}
                expanded={!isCollapsed}
                onClick={() => handleIconClick(item.path)}
                onDragStart={handleDragStart}
                isDraggable={isEditMode}
                isEditMode={isEditMode}
              />
            );
          })}
          
          {isEditMode && !isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 border border-dashed border-[var(--impulse-border-normal)] rounded-lg text-center"
            >
              <p className="text-xs text-[var(--impulse-text-secondary)] mb-2">
                Drag menu items to the top navigation or dashboard shortcuts
              </p>
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 py-1 px-2 bg-[var(--impulse-bg-overlay)] text-[var(--impulse-text-primary)] rounded-md text-xs"
                >
                  <Plus className="w-3 h-3" />
                  Add Custom Link
                </motion.button>
              </div>
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
