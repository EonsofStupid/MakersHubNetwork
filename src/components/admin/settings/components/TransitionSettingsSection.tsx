import React, { useState } from "react";
import { motion } from "framer-motion";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CSSEffectsControl } from "./CSSEffectsControl";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const TransitionSettingsSection = () => {
  const [settings, setSettings] = useState({
    pageTransition: 0.3,
    transitionType: "ease-out",
    hoverScale: 1.05,
    animationPreset: "fade"
  });

  const handleSettingChange = async (key: string, value: number | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    try {
      const { data, error } = await supabase.rpc('update_site_settings', {
        p_transition_duration: `${value}s`,
        p_hover_scale: value.toString()
      });

      if (error) throw error;
      
      toast.success("Transition settings updated");
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast.error("Failed to update settings");
    }
  };

  return (
    <AccordionItem value="transition-settings">
      <AccordionTrigger className="text-lg font-semibold text-white">
        <motion.div
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1, scale: 1.02 }}
          className="flex items-center gap-2"
        >
          Transitions & Motion
        </motion.div>
      </AccordionTrigger>
      <AccordionContent className="space-y-6 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CSSEffectsControl
            label="Page Transition Duration"
            type="slider"
            value={settings.pageTransition}
            min={0.1}
            max={1}
            step={0.1}
            onChange={(value) => handleSettingChange('pageTransition', value)}
            description="Duration of page transition animations"
            previewClass="animate-fade-in"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <CSSEffectsControl
            label="Element Transition Type"
            type="select"
            value={settings.transitionType}
            options={[
              { label: "Ease Out", value: "ease-out" },
              { label: "Ease In", value: "ease-in" },
              { label: "Linear", value: "linear" }
            ]}
            onChange={(value) => handleSettingChange('transitionType', value)}
            description="Default transition timing function"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <CSSEffectsControl
            label="Hover Scale Factor"
            type="slider"
            value={settings.hoverScale}
            min={1}
            max={1.2}
            step={0.01}
            onChange={(value) => handleSettingChange('hoverScale', value)}
            description="Scale factor for hover animations"
            previewClass="hover:scale-110"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <CSSEffectsControl
            label="Animation Preset"
            type="select"
            value={settings.animationPreset}
            options={[
              { label: "Fade", value: "fade" },
              { label: "Slide", value: "slide" },
              { label: "Scale", value: "scale" }
            ]}
            onChange={(value) => handleSettingChange('animationPreset', value)}
            description="Default animation preset for elements"
          />
        </motion.div>
      </AccordionContent>
    </AccordionItem>
  );
};