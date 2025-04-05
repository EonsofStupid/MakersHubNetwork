
import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Code, Eye, EyeOff, Cpu, Wrench, 
  Layout, Layers, PanelLeft, Ruler 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  adminEditModeAtom, 
  adminDebugModeAtom,
  selectedComponentAtom,
  effectsPaletteVisibleAtom
} from "@/admin/atoms/tools.atoms";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { useToast } from "@/hooks/use-toast";

export function AdminDebugPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [isEditMode, setEditMode] = useAtom(adminEditModeAtom);
  const [isDebugMode, setDebugMode] = useAtom(adminDebugModeAtom);
  const [selectedComponent, setSelectedComponent] = useAtom(selectedComponentAtom);
  const [isEffectsPaletteVisible, setEffectsPaletteVisible] = useAtom(effectsPaletteVisibleAtom);
  const { theme } = useTheme();
  const { toast } = useToast();
  
  const tools = [
    { 
      id: 'edit-mode', 
      name: 'Edit Mode', 
      icon: isEditMode ? Eye : EyeOff, 
      active: isEditMode,
      onClick: () => toggleEditMode()
    },
    { 
      id: 'debug-mode', 
      name: 'Debug Mode', 
      icon: Cpu,
      active: isDebugMode,
      onClick: () => toggleDebugMode()
    },
    { 
      id: 'component-tree', 
      name: 'Component Tree', 
      icon: Layout,
      active: false,
      onClick: () => openComponentTree()
    },
    { 
      id: 'layers', 
      name: 'Layers', 
      icon: Layers,
      active: false,
      onClick: () => openLayersPanel()
    },
    { 
      id: 'effects', 
      name: 'Effects', 
      icon: Wrench,
      active: isEffectsPaletteVisible,
      onClick: () => toggleEffectsPalette()
    },
    { 
      id: 'inspect', 
      name: 'Inspect', 
      icon: Ruler,
      active: false,
      onClick: () => toggleInspector()
    },
    { 
      id: 'code', 
      name: 'Code', 
      icon: Code,
      active: false,
      onClick: () => openCodePanel()
    }
  ];
  
  // Toggle debug panel visibility
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  
  // Handle tool clicks
  const toggleEditMode = () => {
    setEditMode(!isEditMode);
    toast({
      title: isEditMode ? "Edit Mode Disabled" : "Edit Mode Enabled",
      description: isEditMode ? 
        "Component editing is now disabled" : 
        "You can now edit components on the page"
    });
  };
  
  const toggleDebugMode = () => {
    setDebugMode(!isDebugMode);
    toast({
      title: isDebugMode ? "Debug Mode Disabled" : "Debug Mode Enabled",
      description: isDebugMode ? 
        "Debug information is now hidden" : 
        "Debug information will be shown for components"
    });
  };
  
  const openComponentTree = () => {
    toast({
      title: "Component Tree",
      description: "Component tree view will be available soon",
      variant: "default"
    });
  };
  
  const openLayersPanel = () => {
    toast({
      title: "Layers Panel",
      description: "Layers panel will be available soon",
      variant: "default"
    });
  };
  
  const toggleEffectsPalette = () => {
    setEffectsPaletteVisible(!isEffectsPaletteVisible);
  };
  
  const toggleInspector = () => {
    toast({
      title: "Inspector Tool",
      description: "Inspector will be available soon",
      variant: "default"
    });
  };
  
  const openCodePanel = () => {
    toast({
      title: "Code Panel",
      description: "Code panel will be available soon",
      variant: "default"
    });
  };
  
  // Register keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+E for edit mode
      if (e.altKey && e.key === 'e') {
        e.preventDefault();
        toggleEditMode();
      }
      
      // Alt+D for debug mode
      if (e.altKey && e.key === 'd') {
        e.preventDefault();
        toggleDebugMode();
      }
      
      // Alt+W for toggling the panel itself
      if (e.altKey && e.key === 'w') {
        e.preventDefault();
        toggleVisibility();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditMode, isDebugMode, isVisible]);

  return (
    <>
      <div className="fixed bottom-4 left-4 z-[100]">
        <Button
          onClick={toggleVisibility}
          className="rounded-full w-12 h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg flex items-center justify-center"
        >
          <Wrench className="w-5 h-5" />
        </Button>
      </div>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed bottom-20 left-4 p-4 rounded-lg shadow-lg z-[100]",
              "bg-background/80 backdrop-blur-md border border-primary/30",
              "min-w-[250px] max-w-md"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Page Builder Tools</h3>
              <Button
                onClick={toggleVisibility}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {tools.map((tool) => (
                <Button
                  key={tool.id}
                  onClick={tool.onClick}
                  variant={tool.active ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "flex flex-col items-center justify-center py-3 px-2 gap-1 h-auto",
                    tool.active && "bg-primary text-primary-foreground"
                  )}
                >
                  <tool.icon className="h-4 w-4" />
                  <span className="text-xs">{tool.name}</span>
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Indicator when in edit mode */}
      {isEditMode && (
        <div className="fixed top-16 left-0 w-full bg-primary/80 text-primary-foreground py-1 px-4 text-xs text-center z-50">
          Edit Mode Active - Click on components to edit them
        </div>
      )}
    </>
  );
}
