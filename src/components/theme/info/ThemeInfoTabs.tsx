import { Info, Palette, Box, Zap } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeInfoTab } from "./ThemeInfoTab";
import { ThemeColorSystem } from "../ThemeColorSystem";
import { ThemeComponentPreview } from "../ThemeComponentPreview";
import { EffectsPreview } from "../EffectsPreview";
import { Theme } from "@/types/theme";
import { useTokenConverters } from "@/hooks/useTokenConverters";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ThemeInfoTabsProps {
  currentTheme: Theme;
  onTabChange: (value: string) => void;
}

const TAB_ITEMS = [
  { value: "info", icon: Info, label: "Info" },
  { value: "colors", icon: Palette, label: "Colors" },
  { value: "components", icon: Box, label: "Components" },
  { value: "effects", icon: Zap, label: "Effects" },
] as const;

export function ThemeInfoTabs({ currentTheme, onTabChange }: ThemeInfoTabsProps) {
  const { convertComponentTokensToArray } = useTokenConverters();
  const [activeTab, setActiveTab] = useState("info");
  const [colorTokens, setColorTokens] = useState([]);

  useEffect(() => {
    const fetchColorTokens = async () => {
      const { data, error } = await supabase
        .from('theme_tokens')
        .select('*')
        .eq('theme_id', currentTheme.id)
        .eq('category', 'colors');

      if (error) {
        console.error('Error fetching color tokens:', error);
        return;
      }

      console.log('Fetched color tokens:', data);
      setColorTokens(data || []);
    };

    if (currentTheme?.id) {
      fetchColorTokens();
    }
  }, [currentTheme?.id]);

  // Enhanced tab transition variants
  const tabVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    }),
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const [[page, direction], setPage] = useState([0, 0]);

  const handleTabChange = (value: string) => {
    const newIndex = TAB_ITEMS.findIndex(item => item.value === value);
    const oldIndex = TAB_ITEMS.findIndex(item => item.value === activeTab);
    setPage([newIndex, oldIndex < newIndex ? 1 : -1]);
    setActiveTab(value);
    onTabChange(value);
  };

  return (
    <Tabs defaultValue="info" className="w-full relative z-10" onValueChange={handleTabChange}>
      <TabsList className="w-full justify-start mb-6 bg-background/40 border border-primary/20">
        {TAB_ITEMS.map(({ value, icon: Icon, label }) => (
          <TabsTrigger 
            key={value} 
            value={value} 
            className="data-[state=active]:bg-primary/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Icon className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10">{label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="relative overflow-hidden">
        <AnimatePresence
          initial={false}
          custom={direction}
          mode="wait"
        >
          <motion.div
            key={activeTab}
            custom={direction}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }}
          >
            <TabsContent value="info" className="mb-0">
              <ThemeInfoTab currentTheme={currentTheme} />
            </TabsContent>

            <TabsContent value="colors" className="space-y-4 mb-0">
              <ThemeColorSystem tokens={colorTokens} />
            </TabsContent>

            <TabsContent value="components" className="space-y-4 mb-0">
              <ThemeComponentPreview 
                componentTokens={convertComponentTokensToArray(currentTheme.component_tokens)} 
              />
            </TabsContent>

            <TabsContent value="effects" className="space-y-4 mb-0">
              <EffectsPreview />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </div>
    </Tabs>
  );
}