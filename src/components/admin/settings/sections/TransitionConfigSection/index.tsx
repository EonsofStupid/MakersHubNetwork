import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormData } from "../../types";
import { CSSEffectsControl } from "../../components/CSSEffectsControl";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface TransitionConfigSectionProps {
  form: UseFormReturn<SettingsFormData>;
}

export const TransitionConfigSection: React.FC<TransitionConfigSectionProps> = ({ form }) => {
  const [previewKey, setPreviewKey] = React.useState(0);

  const handleTransitionChange = (value: any) => {
    setPreviewKey(prev => prev + 1);
    toast.success("Transition updated", {
      description: "Your changes have been applied"
    });
  };

  return (
    <AccordionItem value="transition-config">
      <AccordionTrigger className="text-lg font-semibold text-white">
        Transition Configuration
      </AccordionTrigger>
      <AccordionContent className="space-y-6 pt-4">
        <div className="grid gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">Global Transitions</h3>
            <CSSEffectsControl
              label="Default Transition Type"
              type="select"
              value={form.watch("transition_type")}
              options={[
                { label: "Fade", value: "fade" },
                { label: "Slide", value: "slide" },
                { label: "Scale", value: "scale" },
                { label: "Blur", value: "blur" }
              ]}
              onChange={(value) => {
                form.setValue("transition_type", value);
                handleTransitionChange(value);
              }}
              description="Select the default transition style for page changes"
            />
            <CSSEffectsControl
              label="Transition Duration"
              type="slider"
              value={parseFloat(form.watch("transition_duration"))}
              min={0.1}
              max={1}
              step={0.1}
              onChange={(value) => {
                form.setValue("transition_duration", value.toString());
                handleTransitionChange(value);
              }}
              description="Adjust the duration of transitions in seconds"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">Menu Transitions</h3>
            <CSSEffectsControl
              label="Menu Animation Style"
              type="select"
              value={form.watch("menu_animation_type") || "fade"}
              options={[
                { label: "Fade", value: "fade" },
                { label: "Slide Down", value: "slide-down" },
                { label: "Scale", value: "scale" },
                { label: "Blur", value: "blur" }
              ]}
              onChange={(value) => {
                form.setValue("menu_animation_type", value);
                handleTransitionChange(value);
              }}
              description="Select how menus and dropdowns animate"
            />
          </div>

          <Card className="p-4 bg-gray-800/50 border border-white/10">
            <h3 className="text-sm font-medium text-white mb-4">Preview</h3>
            <div className="grid gap-4">
              <motion.div
                key={`preview-${previewKey}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: parseFloat(form.watch("transition_duration")),
                  ease: "easeOut"
                }}
                className="bg-primary/10 p-4 rounded-lg"
              >
                <p className="text-primary">Transition Preview</p>
              </motion.div>
            </div>
          </Card>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};