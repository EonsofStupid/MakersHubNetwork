import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ColorPicker } from "./ColorPicker";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormData } from "../types";

interface NeonColorsSectionProps {
  form: UseFormReturn<SettingsFormData>;
}

export const NeonColorsSection: React.FC<NeonColorsSectionProps> = ({ form }) => {
  return (
    <AccordionItem value="neon-colors">
      <AccordionTrigger className="text-lg font-semibold text-white">
        Neon Effects
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div className="grid gap-4">
          <ColorPicker
            label="Neon Cyan"
            cssVar="--neon-cyan"
            value={form.watch("neon_cyan")}
            onChange={(color) => form.setValue("neon_cyan", color)}
          />
          <ColorPicker
            label="Neon Pink"
            cssVar="--neon-pink"
            value={form.watch("neon_pink")}
            onChange={(color) => form.setValue("neon_pink", color)}
          />
          <ColorPicker
            label="Neon Purple"
            cssVar="--neon-purple"
            value={form.watch("neon_purple")}
            onChange={(color) => form.setValue("neon_purple", color)}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};