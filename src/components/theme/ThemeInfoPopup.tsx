import { useState, useEffect } from "react";
import { useThemeStore } from "@/stores/theme/store";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeDataStream } from "./ThemeDataStream";
import { ThemeLoadingState } from "./info/ThemeLoadingState";
import { ThemeErrorState } from "./info/ThemeErrorState";
import { ThemeInfoTabs } from "./info/ThemeInfoTabs";
import { AdaptivePopup } from "@/components/ui/adaptive-popup/AdaptivePopup";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ThemeInfoPopupProps {
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ThemeInfoPopup({ onClose, open, onOpenChange }: ThemeInfoPopupProps) {
  const { currentTheme, isLoading, error, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState("info");
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  useEffect(() => {
    if (!hasAttemptedLoad) {
      setTheme("");
      setHasAttemptedLoad(true);
    }
  }, [setTheme, hasAttemptedLoad]);

  if (error) {
    return <ThemeErrorState error={error} onClose={onClose} />;
  }

  if (isLoading || !currentTheme) {
    return <ThemeLoadingState />;
  }

  return (
    <AdaptivePopup
      open={open}
      onOpenChange={onOpenChange}
      title="Theme Information"
      className="w-[800px] max-w-[90vw]"
      contentClassName="bg-background/20 backdrop-blur-xl border border-primary/20 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
    >
      <DialogTitle className="sr-only">Theme Information: {currentTheme.name}</DialogTitle>
      <DialogDescription className="sr-only">
        Detailed information about the {currentTheme.name} theme, including its design tokens, components, and effects.
      </DialogDescription>

      <motion.div 
        initial={{ opacity: 0, y: 20, rotateX: "15deg" }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          rotateX: "0deg",
          transition: {
            duration: 0.5,
            ease: [0.19, 1.0, 0.22, 1.0]
          }
        }}
        exit={{ opacity: 0, y: -20, rotateX: "-15deg" }}
        className="relative perspective-1000"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 rounded-lg opacity-50" />
        <ThemeDataStream className="absolute inset-0 opacity-10" />
        
        <div className="relative z-10 p-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              transition: { delay: 0.2, duration: 0.3 }
            }}
            className="mb-4"
          >
            <h2 className="text-2xl font-bold text-primary glitch">
              {currentTheme.name}
            </h2>
            <p className="text-muted-foreground">
              {currentTheme.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              transition: { delay: 0.3, duration: 0.4 }
            }}
          >
            <ThemeInfoTabs currentTheme={currentTheme} onTabChange={setActiveTab} />
          </motion.div>
        </div>
      </motion.div>
    </AdaptivePopup>
  );
}