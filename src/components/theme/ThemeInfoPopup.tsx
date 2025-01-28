import { useState, useEffect } from "react";
import { useThemeStore } from "@/stores/theme/store";
import { motion } from "framer-motion";
import { ThemeDataStream } from "./ThemeDataStream";
import { ThemeLoadingState } from "./info/ThemeLoadingState";
import { ThemeErrorState } from "./info/ThemeErrorState";
import { ThemeInfoTabs } from "./info/ThemeInfoTabs";
import { AdaptivePopup } from "@/components/ui/adaptive-popup/AdaptivePopup";

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
        className="relative"
      >
        <ThemeDataStream className="opacity-10" />
        <ThemeInfoTabs currentTheme={currentTheme} onTabChange={setActiveTab} />
      </motion.div>
    </AdaptivePopup>
  );
}