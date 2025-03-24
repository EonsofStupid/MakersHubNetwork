
import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { motion, AnimatePresence } from "framer-motion";
import { X, Code, Paintbrush, Info } from "lucide-react";
import { 
  inspectorVisibleAtom, 
  inspectorPositionAtom,
  inspectorComponentAtom,
  inspectorTabAtom,
  altKeyPressedAtom
} from "@/admin/store/atoms/inspector.atoms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export function AdminInspector() {
  const [isVisible, setIsVisible] = useAtom(inspectorVisibleAtom);
  const [position, setPosition] = useAtom(inspectorPositionAtom);
  const [componentId, setComponentId] = useAtom(inspectorComponentAtom);
  const [activeTab, setActiveTab] = useAtom(inspectorTabAtom);
  const [altPressed, setAltPressed] = useAtom(altKeyPressedAtom);
  const [isDragging, setIsDragging] = useState(false);

  // Track Alt key for inspector activation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setAltPressed(true);
        // Add special cursor to show inspector is ready
        document.body.classList.add('inspector-ready');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setAltPressed(false);
        // Remove special cursor
        document.body.classList.remove('inspector-ready');
      }
    };

    // Handle window blur to prevent stuck alt state
    const handleBlur = () => {
      setAltPressed(false);
      document.body.classList.remove('inspector-ready');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      document.body.classList.remove('inspector-ready');
    };
  }, [setAltPressed]);

  // Set up click handler for components when Alt is pressed
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!altPressed) return;
      
      // Find closest element with data-component-id
      let target = e.target as HTMLElement;
      let componentEl = null;
      
      while (target && target !== document.body) {
        if (target.hasAttribute('data-component-id')) {
          componentEl = target;
          break;
        }
        target = target.parentElement as HTMLElement;
      }
      
      if (componentEl) {
        e.preventDefault();
        e.stopPropagation();
        
        const rect = componentEl.getBoundingClientRect();
        const id = componentEl.getAttribute('data-component-id');
        
        setComponentId(id);
        setPosition({ 
          x: rect.right + 10, 
          y: rect.top 
        });
        setIsVisible(true);
      }
    };
    
    if (altPressed) {
      document.addEventListener('click', handleClick);
    }
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [altPressed, setComponentId, setIsVisible, setPosition]);

  const handleClose = () => {
    setIsVisible(false);
    setComponentId(null);
  };

  if (!isVisible || !componentId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="impulse-overlay fixed z-50"
        style={{
          left: position.x,
          top: position.y,
          width: 320,
          maxWidth: "calc(100vw - 40px)",
        }}
        drag
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        <div className="impulse-panel p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">Component Inspector</h3>
            <Button 
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-xs text-[var(--impulse-text-secondary)] mb-4">
            Component ID: <span className="font-mono">{componentId}</span>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={(val) => setActiveTab(val as any)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="styles" className="text-xs">
                <Paintbrush className="h-3 w-3 mr-1" />
                Styles
              </TabsTrigger>
              <TabsTrigger value="data" className="text-xs">
                <Code className="h-3 w-3 mr-1" />
                Data
              </TabsTrigger>
              <TabsTrigger value="rules" className="text-xs">
                <Info className="h-3 w-3 mr-1" />
                Rules
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="styles" className="p-2 text-xs">
              <div className="h-[200px] overflow-y-auto">
                Styling information will appear here
              </div>
            </TabsContent>
            
            <TabsContent value="data" className="p-2 text-xs">
              <div className="h-[200px] overflow-y-auto">
                Component data will appear here
              </div>
            </TabsContent>
            
            <TabsContent value="rules" className="p-2 text-xs">
              <div className="h-[200px] overflow-y-auto">
                Composition rules will appear here
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
