import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormData } from "../../types";
import { CSSEffectsControl } from "../../components/CSSEffectsControl";

interface TextStylesSectionProps {
  form: UseFormReturn<SettingsFormData>;
}

export const TextStylesSection: React.FC<TextStylesSectionProps> = ({ form }) => {
  return (
    <AccordionItem value="text-styles">
      <AccordionTrigger className="text-lg font-semibold text-white">
        Text & Typography
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div className="grid gap-4">
          <CSSEffectsControl
            label="Heading Font Family"
            type="select"
            value={form.watch("font_family_heading")}
            options={[
              { label: "Inter", value: "Inter" },
              { label: "System UI", value: "system-ui" },
              { label: "Roboto", value: "Roboto" },
              { label: "Helvetica", value: "Helvetica" }
            ]}
            onChange={(value) => form.setValue("font_family_heading", value)}
            description="Font family for headings"
          />
          <CSSEffectsControl
            label="Body Font Family"
            type="select"
            value={form.watch("font_family_body")}
            options={[
              { label: "Inter", value: "Inter" },
              { label: "System UI", value: "system-ui" },
              { label: "Roboto", value: "Roboto" },
              { label: "Helvetica", value: "Helvetica" }
            ]}
            onChange={(value) => form.setValue("font_family_body", value)}
            description="Font family for body text"
          />
          <CSSEffectsControl
            label="Base Font Size"
            type="input"
            value={form.watch("font_size_base")}
            onChange={(value) => form.setValue("font_size_base", value)}
            description="Base font size (e.g., 16px)"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};