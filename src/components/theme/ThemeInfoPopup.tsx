import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeColorSystem } from "./ThemeColorSystem";
import { ThemeComponentPreview } from "./ThemeComponentPreview";
import { ThemeDataStream } from "./ThemeDataStream";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function ThemeInfoPopup() {
  const [activeSection, setActiveSection] = useState<'colors' | 'components' | 'info'>('info');
  const { currentTheme, themeTokens, themeComponents } = useTheme();

  if (!currentTheme) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className={cn(
        "w-[600px] max-w-[90vw] rounded-lg overflow-hidden",
        "bg-background/20 backdrop-blur-xl",
        "border border-primary/30",
        "shadow-[0_8px_32px_0_rgba(0,240,255,0.2)]",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-b before:from-primary/5 before:to-transparent",
        "before:pointer-events-none",
        "relative z-50"
      )}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      <ThemeDataStream className="absolute inset-0 pointer-events-none opacity-20" />
      
      <div className="relative z-10 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <motion.h3 
            className="text-xl font-bold text-primary"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {currentTheme.name}
          </motion.h3>
          <div className="flex items-center space-x-2">
            <motion.span 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className={cn(
                "px-2 py-1 text-xs rounded-full",
                "bg-secondary/20 text-secondary",
                "border border-secondary/30",
                "animate-pulse"
              )}
            >
              v{currentTheme.version}
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className={cn(
                "px-2 py-1 text-xs rounded-full",
                "bg-primary/20 text-primary",
                "border border-primary/30"
              )}
            >
              {currentTheme.status}
            </motion.span>
          </div>
        </div>

        <nav className="flex space-x-2">
          {(['info', 'colors', 'components'] as const).map((section, index) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "relative",
                  activeSection === section && "text-primary",
                  "mad-scientist-hover"
                )}
                onClick={() => setActiveSection(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </Button>
            </motion.div>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, rotateX: -10 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0, rotateX: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {activeSection === 'colors' && (
              <ThemeColorSystem tokens={themeTokens} />
            )}
            {activeSection === 'components' && (
              <ThemeComponentPreview components={themeComponents} />
            )}
            {activeSection === 'info' && (
              <div className="space-y-4">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-sm text-muted-foreground">
                    Last Updated: {new Date(currentTheme.updated_at || '').toLocaleDateString()}
                  </p>
                  {currentTheme.description && (
                    <p className="text-sm">{currentTheme.description}</p>
                  )}
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}