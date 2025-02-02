import React from "react";
import { CSSEffectsControl } from "./CSSEffectsControl";
import { Card } from "@/components/ui/card";

const ANIMATION_PRESETS = {
  fade: [
    { label: "Fade In", value: "fade-in" },
    { label: "Fade Out", value: "fade-out" }
  ],
  slide: [
    { label: "Slide In Right", value: "slide-in-right" },
    { label: "Slide Out Right", value: "slide-out-right" }
  ],
  scale: [
    { label: "Scale In", value: "scale-in" },
    { label: "Scale Out", value: "scale-out" }
  ]
};

export const AnimationsSection = () => {
  const handleAnimationChange = (key: string, value: any) => {
    console.log(`Animation ${key} changed to:`, value);
    // Here we'll implement the actual CSS variable update
  };

  return (
    <Card className="p-6 space-y-6 bg-gray-800/50 border border-white/10">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Page Transitions</h3>
        <CSSEffectsControl
          label="Transition Type"
          type="select"
          value="fade-in"
          options={[
            { label: "Fade", value: "fade" },
            { label: "Slide", value: "slide" },
            { label: "Scale", value: "scale" }
          ]}
          onChange={(value) => handleAnimationChange("transitionType", value)}
          description="Select the type of transition between pages"
        />
        <CSSEffectsControl
          label="Duration"
          type="slider"
          value={0.3}
          min={0.1}
          max={1}
          step={0.1}
          onChange={(value) => handleAnimationChange("duration", value)}
          description="Adjust the duration of the transition in seconds"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Element Animations</h3>
        <CSSEffectsControl
          label="Hover Scale"
          type="slider"
          value={1.05}
          min={1}
          max={1.2}
          step={0.01}
          onChange={(value) => handleAnimationChange("hoverScale", value)}
          description="Scale factor when hovering over interactive elements"
          previewClass="hover:scale-[var(--hover-scale)]"
        />
        <CSSEffectsControl
          label="Neon Glow Intensity"
          type="slider"
          value={1}
          min={0}
          max={2}
          step={0.1}
          onChange={(value) => handleAnimationChange("neonGlow", value)}
          description="Adjust the intensity of neon glow effects"
          previewClass="animate-neon-pulse"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Loading States</h3>
        <CSSEffectsControl
          label="Spinner Speed"
          type="slider"
          value={0.75}
          min={0.5}
          max={2}
          step={0.25}
          onChange={(value) => handleAnimationChange("spinnerSpeed", value)}
          description="Adjust the speed of loading spinners"
        />
      </div>
    </Card>
  );
};