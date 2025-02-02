import React from "react";
import { Input } from "@/components/ui/input";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UseFormRegister, FormState } from "react-hook-form";
import { SettingsFormData } from "../types";

interface BasicSettingsSectionProps {
  register: UseFormRegister<SettingsFormData>;
  formState: FormState<SettingsFormData>;
}

export const BasicSettingsSection: React.FC<BasicSettingsSectionProps> = ({
  register,
  formState
}) => {
  return (
    <AccordionItem value="basic-settings">
      <AccordionTrigger className="text-lg font-semibold text-white">
        Basic Settings
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div>
          <label className="text-sm font-medium text-white">Site Title</label>
          <Input
            {...register("site_title")}
            className="mt-1 bg-gray-700/50 border-gray-600"
          />
          {formState.errors.site_title && (
            <p className="mt-1 text-sm text-red-500">
              {formState.errors.site_title.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-white">Tagline</label>
          <Input
            {...register("tagline")}
            className="mt-1 bg-gray-700/50 border-gray-600"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};