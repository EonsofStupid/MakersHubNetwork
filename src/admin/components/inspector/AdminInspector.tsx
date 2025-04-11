
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/admin/store/admin.store";
import { X, Code, LayoutPanelLeft, Terminal, Eye, EyeOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Component tree item interface
interface ComponentTreeItem {
  id: string;
  name: string;
  type: string;
  children?: ComponentTreeItem[];
  props?: Record<string, any>;
  state?: Record<string, any>;
}

export function AdminInspector() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 320, height: 400 });
  const [tab, setTab] = useState("tree");
  const [isHighlighting, setIsHighlighting] = useState(false);
  
  // Mock component tree for demonstration
  const mockComponentTree: ComponentTreeItem[] = [
    {
      id: "root",
      name: "App",
      type: "component",
      children: [
        {
          id: "header",
          name: "MainNav",
          type: "component",
          props: {
            title: "MakersImpulse",
            isExpanded: true
          }
        },
        {
          id: "main",
          name: "AdminLayout",
          type: "component",
          children: [
            {
              id: "sidebar",
              name: "AdminSidebar",
              type: "component",
              props: {
                collapsed: false
              }
            },
            {
              id: "content",
              name: "AdminContent",
              type: "component",
              children: [
                {
                  id: "dashboard",
                  name: "Dashboard",
                  type: "component",
                  state: {
                    isLoading: false,
                    stats: {
                      users: 1245,
                      builds: 386,
                      activeMakers: 89
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
  
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  
  // Alt+I keyboard shortcut to toggle inspector
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "i") {
        toggleVisibility();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);
  
  // Reset position when opened
  useEffect(() => {
    if (isVisible) {
      setPosition({ 
        x: window.innerWidth - size.width - 20, 
        y: 100 
      });
    }
  }, [isVisible, size]);
  
  // Toggle component highlighting
  const toggleHighlighting = () => {
    setIsHighlighting(!isHighlighting);
    
    // Add/remove highlight class to body
    if (!isHighlighting) {
      document.body.classList.add("impulse-inspector-active");
    } else {
      document.body.classList.remove("impulse-inspector-active");
    }
  };
  
  const renderComponentTree = (items: ComponentTreeItem[], depth: number = 0) => {
    return (
      <ul className={cn(
        "text-xs",
        depth > 0 && "ml-4 border-l border-[var(--impulse-border-normal)] pl-2"
      )}>
        {items.map((item) => (
          <li key={item.id} className="mb-1">
            <div className={cn(
              "flex items-center py-1 px-2 rounded cursor-pointer",
              "hover:bg-[rgba(0,240,255,0.1)]"
            )}>
              <span className="text-[var(--impulse-text-accent)]">{item.name}</span>
              <span className="ml-1 text-[var(--impulse-text-secondary)]">
                {item.props && Object.keys(item.props).length > 0 && " 📦"}
                {item.state && Object.keys(item.state).length > 0 && " 🔄"}
              </span>
            </div>
            
            {item.children && item.children.length > 0 && (
              renderComponentTree(item.children, depth + 1)
            )}
          </li>
        ))}
      </ul>
    );
  };
  
  // For the fixed toggle button
  const fixedButtonStyles = {
    position: "fixed",
    bottom: "100px",
    right: "20px",
    zIndex: 1000,
  } as React.CSSProperties;
  
  if (!isVisible) {
    return (
      <Button 
        onClick={toggleVisibility} 
        style={fixedButtonStyles}
        size="sm"
        className="bg-[var(--impulse-bg-card)] hover:bg-[var(--impulse-border-hover)] border border-[var(--impulse-border-normal)] rounded-full p-2 shadow-[var(--impulse-glow-primary)]"
      >
        <Code className="h-4 w-4 text-[var(--impulse-text-accent)]" />
      </Button>
    );
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20 }}
          style={{ 
            width: size.width,
            height: size.height,
            left: position.x,
            top: position.y
          }}
          drag
          dragConstraints={{ left: 0, right: window.innerWidth - size.width, top: 0, bottom: window.innerHeight - size.height }}
          onDrag={(_, info) => {
            setPosition({
              x: position.x + info.delta.x,
              y: position.y + info.delta.y
            });
          }}
          className={cn(
            "impulse-overlay absolute z-50", 
            "bg-[var(--impulse-bg-overlay)] backdrop-blur-lg", 
            "rounded-lg border border-[var(--impulse-border-normal)]", 
            "shadow-[var(--impulse-glow-primary)]"
          )}
        >
          {/* Header */}
          <div className={cn(
            "flex items-center justify-between px-4 py-2",
            "border-b border-[var(--impulse-border-normal)]",
            "bg-[rgba(0,240,255,0.1)]"
          )}>
            <div className="flex items-center">
              <Code className="h-4 w-4 text-[var(--impulse-primary)] mr-2" />
              <h3 className="text-sm font-medium text-[var(--impulse-text-accent)]">
                Admin Inspector
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleHighlighting}
                className="h-6 w-6"
              >
                {isHighlighting ? (
                  <EyeOff className="h-4 w-4 text-[var(--impulse-secondary)]" />
                ) : (
                  <Eye className="h-4 w-4 text-[var(--impulse-text-secondary)]" />
                )}
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleVisibility}
                className="h-6 w-6"
              >
                <X className="h-4 w-4 text-[var(--impulse-text-secondary)]" />
              </Button>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="tree" value={tab} onValueChange={setTab}>
            <TabsList className="w-full rounded-none bg-[rgba(0,0,0,0.2)] border-b border-[var(--impulse-border-normal)]">
              <TabsTrigger value="tree" className="text-xs">
                <LayoutPanelLeft className="h-3 w-3 mr-1" /> Component Tree
              </TabsTrigger>
              <TabsTrigger value="console" className="text-xs">
                <Terminal className="h-3 w-3 mr-1" /> Console
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tree" className="m-0">
              <ScrollArea className="h-[calc(100%-80px)] p-3">
                {renderComponentTree(mockComponentTree)}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="console" className="m-0">
              <ScrollArea className="h-[calc(100%-80px)] p-3">
                <div className="font-mono text-xs text-[var(--impulse-text-secondary)]">
                  <div className="mb-1">&gt; Admin inspector console ready</div>
                  <div className="mb-1 text-[var(--impulse-text-accent)]">&gt; Component selection active</div>
                  <div className="mb-1">&gt; Alt+Click to inspect a component</div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
          
          {/* Status Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-[rgba(0,0,0,0.3)] text-xs text-[var(--impulse-text-secondary)] px-3 flex items-center">
            {isHighlighting ? "Highlighting active (Alt+Click to select)" : "Impulse Inspector v1.0"}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
