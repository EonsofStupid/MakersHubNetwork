import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormData } from "../../types";
import { CSSEffectsControl } from "../../components/CSSEffectsControl";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface AnimationsSectionProps {
  form: UseFormReturn<SettingsFormData>;
}

export const AnimationsSection: React.FC<AnimationsSectionProps> = ({ form }) => {
  const [previewKey, setPreviewKey] = React.useState(0);

  const triggerPreview = () => {
    setPreviewKey(prev => prev + 1);
  };

  return (
    <AccordionItem value="animations">
      <AccordionTrigger className="text-lg font-semibold text-white">
        Animations & Transitions
      </AccordionTrigger>
      <AccordionContent className="space-y-6 pt-4">
        <div className="grid gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">Page Transitions</h3>
            <CSSEffectsControl
              label="Transition Type"
              type="select"
              value={form.watch("transition_type") || "fade"}
              options={[
                { label: "Fade", value: "fade" },
                { label: "Slide", value: "slide" },
                { label: "Scale", value: "scale" }
              ]}
              onChange={(value) => {
                form.setValue("transition_type", value);
                triggerPreview();
              }}
              description="Select the type of transition between pages"
            />
            <CSSEffectsControl
              label="Duration"
              type="slider"
              value={parseFloat(form.watch("transition_duration"))}
              min={0.1}
              max={1}
              step={0.1}
              onChange={(value) => {
                form.setValue("transition_duration", value.toString());
                triggerPreview();
              }}
              description="Adjust the duration of transitions in seconds"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">Element Animations</h3>
            <CSSEffectsControl
              label="Hover Scale"
              type="slider"
              value={parseFloat(form.watch("hover_scale"))}
              min={1}
              max={1.2}
              step={0.01}
              onChange={(value) => {
                form.setValue("hover_scale", value.toString());
                triggerPreview();
              }}
              description="Scale factor when hovering over elements"
            />
          </div>

          <Card className="p-4 bg-gray-800/50 border border-white/10">
            <h3 className="text-sm font-medium text-white mb-4">Preview</h3>
            <div className="grid gap-4">
              <motion.div
                key={`preview-${previewKey}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: parseFloat(form.watch("transition_duration")),
                  ease: "easeOut"
                }}
                className="bg-primary/10 p-4 rounded-lg"
              >
                <p className="text-primary">Transition Preview</p>
              </motion.div>

              <motion.button
                whileHover={{ 
                  scale: parseFloat(form.watch("hover_scale")),
                  transition: { duration: 0.2 }
                }}
                className="bg-secondary/20 p-3 rounded-lg text-secondary w-full"
              >
                Hover Scale Preview
              </motion.button>
            </div>
          </Card>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};