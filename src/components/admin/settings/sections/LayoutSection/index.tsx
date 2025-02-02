import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormData } from "../../types";
import { CSSEffectsControl } from "../../components/CSSEffectsControl";

interface LayoutSectionProps {
  form: UseFormReturn<SettingsFormData>;
}

export const LayoutSection: React.FC<LayoutSectionProps> = ({ form }) => {
  return (
    <AccordionItem value="layout">
      <AccordionTrigger className="text-lg font-semibold text-white">
        Layout & Spacing
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div className="grid gap-4">
          <CSSEffectsControl
            label="Border Radius"
            type="input"
            value={form.watch("border_radius")}
            onChange={(value) => form.setValue("border_radius", value)}
            description="Border radius for UI elements (e.g., 0.5rem)"
          />
          
          <CSSEffectsControl
            label="Spacing Unit"
            type="input"
            value={form.watch("spacing_unit")}
            onChange={(value) => form.setValue("spacing_unit", value)}
            description="Base spacing unit for layout (e.g., 1rem)"
          />
          
          <CSSEffectsControl
            label="Transition Duration"
            type="slider"
            value={parseFloat(form.watch("transition_duration"))}
            min={0.1}
            max={1}
            step={0.1}
            onChange={(value) => form.setValue("transition_duration", value.toString())}
            description="Duration for animations (in seconds)"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};