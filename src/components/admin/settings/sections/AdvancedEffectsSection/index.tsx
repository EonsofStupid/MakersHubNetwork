import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormData } from "../../types";
import { CSSEffectsControl } from "../../components/CSSEffectsControl";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface AdvancedEffectsSectionProps {
  form: UseFormReturn<SettingsFormData>;
}

export const AdvancedEffectsSection: React.FC<AdvancedEffectsSectionProps> = ({ form }) => {
  const [previewKey, setPreviewKey] = React.useState(0);

  const triggerPreview = () => {
    setPreviewKey(prev => prev + 1);
  };

  return (
    <AccordionItem value="advanced-effects">
      <AccordionTrigger className="text-lg font-semibold text-white">
        Advanced Effects
      </AccordionTrigger>
      <AccordionContent className="space-y-6 pt-4">
        <div className="grid gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">Transition Effects</h3>
            <CSSEffectsControl
              label="Box Shadow"
              type="select"
              value={form.watch("box_shadow") || "none"}
              options={[
                { label: "None", value: "none" },
                { label: "Small", value: "sm" },
                { label: "Medium", value: "md" },
                { label: "Large", value: "lg" }
              ]}
              onChange={(value) => {
                form.setValue("box_shadow", value);
                triggerPreview();
              }}
              description="Shadow depth for elements"
            />
            <CSSEffectsControl
              label="Backdrop Blur"
              type="slider"
              value={parseInt(form.watch("backdrop_blur") || "0")}
              min={0}
              max={20}
              step={1}
              onChange={(value) => {
                form.setValue("backdrop_blur", value.toString());
                triggerPreview();
              }}
              description="Blur effect for backdrop elements (in pixels)"
            />
          </div>

          <Card className="p-4 bg-gray-800/50 border border-white/10">
            <h3 className="text-sm font-medium text-white mb-4">Preview</h3>
            <div className="grid gap-4">
              <motion.div
                key={`preview-${previewKey}`}
                className={`
                  p-4 rounded-lg bg-primary/10 backdrop-blur-[var(--backdrop-blur)]
                  ${form.watch("box_shadow") === "sm" ? "shadow-sm" : ""}
                  ${form.watch("box_shadow") === "md" ? "shadow-md" : ""}
                  ${form.watch("box_shadow") === "lg" ? "shadow-lg" : ""}
                `}
              >
                <p className="text-primary">Advanced Effects Preview</p>
              </motion.div>
            </div>
          </Card>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};