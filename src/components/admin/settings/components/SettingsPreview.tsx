import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ColorPreview } from "./preview/ColorPreview";
import { TextPreview } from "./preview/TextPreview";
import { AnimationPreview } from "./preview/AnimationPreview";
import { AdvancedCSSEditor } from "./AdvancedCSSEditor";

interface SettingsPreviewProps {
  settings: {
    site_title: string;
    tagline?: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    neon_cyan?: string;
    neon_pink?: string;
    neon_purple?: string;
    logo_url?: string;
    favicon_url?: string;
  };
}

export const SettingsPreview: React.FC<SettingsPreviewProps> = ({ settings }) => {
  console.log("SettingsPreview rendered with settings:", settings);

  React.useEffect(() => {
    toast.success("Preview updated with new colors");
  }, [settings.primary_color, settings.secondary_color, settings.accent_color]);

  return (
    <AnimatePresence mode="wait">
      <div className="space-y-6">
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          key={settings.primary_color}
        >
          {settings.logo_url && (
            <img
              src={settings.logo_url}
              alt="Logo"
              className="w-12 h-12 object-contain rounded"
            />
          )}
          <div>
            <h2 className="text-xl font-bold" style={{ color: settings.primary_color }}>
              {settings.site_title}
            </h2>
            {settings.tagline && (
              <p className="text-sm" style={{ color: settings.secondary_color }}>
                {settings.tagline}
              </p>
            )}
          </div>
        </motion.div>

        <div className="space-y-4">
          <ColorPreview colors={settings} />
          <TextPreview colors={settings} />
          <AnimationPreview colors={settings} />
        </div>

        {settings.favicon_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-gray-400 mb-2">Favicon Preview:</p>
            <img
              src={settings.favicon_url}
              alt="Favicon"
              className="w-8 h-8 object-contain"
            />
          </motion.div>
        )}

        <AdvancedCSSEditor
          currentCSS={`/* Current Theme CSS Variables */
:root {
  --primary: ${settings.primary_color};
  --secondary: ${settings.secondary_color};
  --accent: ${settings.accent_color};
  --neon-cyan: ${settings.neon_cyan};
  --neon-pink: ${settings.neon_pink};
  --neon-purple: ${settings.neon_purple};
  /* ... other variables */
}`}
          onSave={(css) => {
            const styleSheet = new CSSStyleSheet();
            styleSheet.replaceSync(css);
            document.adoptedStyleSheets = [styleSheet];
            toast.success("CSS updated successfully");
          }}
          onReset={() => {
            document.adoptedStyleSheets = [];
            toast.success("CSS reset to default");
          }}
        />
      </div>
    </AnimatePresence>
  );
};
