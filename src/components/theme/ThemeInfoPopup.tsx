import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeColorSystem } from "./ThemeColorSystem";
import { ThemeComponentPreview } from "./ThemeComponentPreview";
import { ThemeDataStream } from "./ThemeDataStream";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeInfoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, themeTokens, themeComponents } = useTheme();
  const [activeSection, setActiveSection] = useState<'colors' | 'components' | 'info'>('info');

  if (!currentTheme) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={cn(
          "fixed bottom-24 right-4 w-96 rounded-lg",
          "bg-background/20 backdrop-blur-xl",
          "border border-primary/30",
          "shadow-[0_8px_32px_0_rgba(0,240,255,0.2)]",
          "before:absolute before:inset-0",
          "before:bg-gradient-to-b before:from-primary/5 before:to-transparent",
          "before:pointer-events-none",
          "overflow-hidden"
        )}
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
      >
        <ThemeDataStream className="absolute inset-0 pointer-events-none" />
        
        <div className="relative z-10 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-primary glitch">
              {currentTheme.name}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={cn(
                "px-2 py-1 text-xs rounded-full",
                "bg-secondary/20 text-secondary",
                "border border-secondary/30",
                "animate-pulse"
              )}>
                v{currentTheme.version}
              </span>
              <span className={cn(
                "px-2 py-1 text-xs rounded-full",
                "bg-primary/20 text-primary",
                "border border-primary/30"
              )}>
                {currentTheme.status}
              </span>
            </div>
          </div>

          <nav className="flex space-x-2">
            {(['info', 'colors', 'components'] as const).map((section) => (
              <Button
                key={section}
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
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Last Updated: {new Date(currentTheme.updated_at || '').toLocaleDateString()}
                    </p>
                    {currentTheme.description && (
                      <p className="text-sm">{currentTheme.description}</p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}