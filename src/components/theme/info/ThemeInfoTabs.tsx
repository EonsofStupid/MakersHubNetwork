import { Info, Palette, Box, Zap } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeInfoTab } from "./ThemeInfoTab";
import { ThemeColorSystem } from "../ThemeColorSystem";
import { ThemeComponentPreview } from "../ThemeComponentPreview";
import { EffectsPreview } from "../EffectsPreview";
import { Theme, ThemeToken, ComponentTokens } from "@/types/theme";
import { useTokenConverters } from "@/hooks/useTokenConverters";
import { useState } from "react";

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
  const { convertDesignTokensToArray, convertComponentTokensToArray } = useTokenConverters();
  const [activeTab, setActiveTab] = useState("info");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange(value);
  };

  return (
    <Tabs defaultValue="info" className="w-full relative z-10" onValueChange={handleTabChange}>
      <TabsList className="w-full justify-start mb-6 bg-background/40 border border-primary/20">
        {TAB_ITEMS.map(({ value, icon: Icon, label }) => (
          <TabsTrigger key={value} value={value} className="data-[state=active]:bg-primary/20">
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <TabsContent value="info">
            <ThemeInfoTab currentTheme={currentTheme} />
          </TabsContent>

          <TabsContent value="colors" className="space-y-4">
            <ThemeColorSystem tokens={convertDesignTokensToArray(currentTheme?.design_tokens)} />
          </TabsContent>

          <TabsContent value="components" className="space-y-4">
            <ThemeComponentPreview componentTokens={convertComponentTokensToArray(currentTheme?.component_tokens)} />
          </TabsContent>

          <TabsContent value="effects" className="space-y-4">
            <EffectsPreview />
          </TabsContent>
        </motion.div>
      </AnimatePresence>
    </Tabs>
  );
} 