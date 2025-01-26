import { useState } from "react";
import { useThemeStore } from "@/stores/theme/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeColorSystem } from "./ThemeColorSystem";
import { ThemeComponentPreview } from "./ThemeComponentPreview";
import { ThemeDataStream } from "./ThemeDataStream";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ThemeInfoPopupProps {
  onClose?: () => void;
}

export function ThemeInfoPopup({ onClose }: ThemeInfoPopupProps) {
  const [activeSection, setActiveSection] = useState<'colors' | 'components' | 'info'>('info');
  const { currentTheme, themeTokens, themeComponents, isLoading, error } = useThemeStore();

  const popupVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20,
      rotateX: -15,
      perspective: 1000
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1.5
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      y: 20,
      rotateX: 15,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const contentVariants = {
    initial: { opacity: 0, x: -20, rotateY: -90 },
    animate: { 
      opacity: 1, 
      x: 0,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      x: 20, 
      rotateY: 90,
      transition: {
        duration: 0.2
      }
    }
  };

  if (error) {
    return (
      <motion.div
        variants={popupVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="p-6 text-center"
      >
        <p className="text-destructive">Error loading theme data. Please try again.</p>
        {onClose && (
          <Button onClick={onClose} variant="ghost" className="mt-4">
            Close
          </Button>
        )}
      </motion.div>
    );
  }

  if (isLoading || !currentTheme) {
    return (
      <motion.div
        variants={popupVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="p-6 text-center"
      >
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-muted-foreground">Loading theme data...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={popupVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        "w-[600px] max-w-[90vw] rounded-lg overflow-hidden",
        "bg-background/20 backdrop-blur-xl",
        "border border-primary/30",
        "shadow-[0_8px_32px_0_rgba(0,240,255,0.2)]",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-b before:from-primary/5 before:to-transparent",
        "before:pointer-events-none",
        "relative z-50 perspective-1000"
      )}
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
                  "relative transition-all duration-300",
                  activeSection === section && "text-primary bg-primary/10",
                  "hover:bg-primary/5 hover:text-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
                )}
                onClick={() => setActiveSection(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
                {activeSection === section && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="activeSection"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </Button>
            </motion.div>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
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