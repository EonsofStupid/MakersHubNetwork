import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { settingsSchema, type SettingsFormData, type Settings } from "./types";
import { useSettingsForm } from "./hooks/useSettingsForm";
import { useTheme } from "@/components/theme/ThemeContext";
import { SettingsPreview } from "./components/SettingsPreview";
import { ResetDialog } from "./components/ResetDialog";
import { SettingsFormHeader } from "./components/SettingsFormHeader";
import { SavingIndicator } from "./components/SavingIndicator";
import { ColorSection } from "./sections/ColorSection";
import { TextStylesSection } from "./sections/TextStylesSection";
import { LayoutSection } from "./sections/LayoutSection";
import { AnimationsSection } from "./sections/AnimationsSection";
import { AdvancedEffectsSection } from "./sections/AdvancedEffectsSection";
import { TransitionConfigSection } from "./sections/TransitionConfigSection";
import { ThemeImportSection } from "./sections/ThemeImportSection";
import { toast } from "sonner";

export const SettingsForm = () => {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetConfirmation, setResetConfirmation] = useState("");
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { theme, updateTheme } = useTheme();

  const {
    settings,
    isLoading,
    isSaving,
    logoFile,
    faviconFile,
    handleLogoUpload,
    handleFaviconUpload,
    handleSettingsUpdate,
    handleResetToDefault,
  } = useSettingsForm();

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      site_title: settings?.site_title || "MakersImpulse",
      tagline: settings?.tagline || "Create, Share, Inspire",
      primary_color: settings?.primary_color || "#7FFFD4",
      secondary_color: settings?.secondary_color || "#FFB6C1",
      accent_color: settings?.accent_color || "#E6E6FA",
      neon_cyan: settings?.neon_cyan || "#41f0db",
      neon_pink: settings?.neon_pink || "#ff0abe",
      neon_purple: settings?.neon_purple || "#8000ff",
      text_primary_color: settings?.text_primary_color || "#FFFFFF",
      text_secondary_color: settings?.text_secondary_color || "#A1A1AA",
      text_link_color: settings?.text_link_color || "#3B82F6",
      text_heading_color: settings?.text_heading_color || "#FFFFFF",
      border_radius: settings?.border_radius || "0.5rem",
      spacing_unit: settings?.spacing_unit || "1rem",
      transition_duration: settings?.transition_duration || "0.3s",
      shadow_color: settings?.shadow_color || "#000000",
      hover_scale: settings?.hover_scale || "1.05",
      font_family_heading: settings?.font_family_heading || "Inter",
      font_family_body: settings?.font_family_body || "Inter",
      font_size_base: settings?.font_size_base || "16px",
      font_weight_normal: settings?.font_weight_normal || "400",
      font_weight_bold: settings?.font_weight_bold || "700",
      line_height_base: settings?.line_height_base || "1.5",
      letter_spacing: settings?.letter_spacing || "normal",
      box_shadow: settings?.box_shadow || "none",
      backdrop_blur: settings?.backdrop_blur || "0",
      transition_type: settings?.transition_type || "fade",
      menu_animation_type: settings?.menu_animation_type || "fade",
    },
  });

  // Watch all form fields for changes
  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === "change") {
        const formValues = form.getValues();
        handleSettingsUpdate(formValues as Settings);
        updateTheme(formValues as Settings);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, handleSettingsUpdate, updateTheme]);

  const handleReset = async () => {
    if (resetConfirmation.toUpperCase() !== "IMPULSE" || !confirmCheckbox) {
      toast.error("Please type IMPULSE and check the confirmation box");
      return;
    }

    setIsResetting(true);
    toast.loading("Resetting settings to default...");

    try {
      await handleResetToDefault();
      toast.success("Settings reset successfully");
      setShowResetDialog(false);
      setResetConfirmation("");
      setConfirmCheckbox(false);
      form.reset(settings || undefined);
    } catch (error) {
      toast.error("Failed to reset settings");
    } finally {
      setIsResetting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleReset();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-[5%] min-h-[calc(100vh-4rem)]">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <Card className="p-6 bg-gray-800/50 border border-white/10 backdrop-blur-sm">
          <SettingsFormHeader 
            onResetClick={() => setShowResetDialog(true)}
            isSaving={isSaving}
          />

          <form className="space-y-6">
            <SavingIndicator isSaving={isSaving} />
            <Accordion type="single" collapsible className="space-y-4">
              <ThemeImportSection form={form} />
              <ColorSection form={form} />
              <TextStylesSection form={form} />
              <LayoutSection form={form} />
              <TransitionConfigSection form={form} />
              <AnimationsSection form={form} />
              <AdvancedEffectsSection form={form} />
            </Accordion>
          </form>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 bg-gray-800/50 border border-white/10 backdrop-blur-sm sticky top-4">
          <h3 className="text-lg font-medium text-white mb-4">Preview</h3>
          <SettingsPreview
            settings={{
              ...settings,
              ...form.watch(),
              logo_url: logoFile ? URL.createObjectURL(logoFile) : settings?.logo_url,
              favicon_url: faviconFile ? URL.createObjectURL(faviconFile) : settings?.favicon_url,
            }}
          />
        </Card>
      </motion.div>

      <ResetDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        onReset={handleReset}
        isResetting={isResetting}
        resetConfirmation={resetConfirmation}
        onResetConfirmationChange={setResetConfirmation}
        confirmCheckbox={confirmCheckbox}
        onConfirmCheckboxChange={setConfirmCheckbox}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};
