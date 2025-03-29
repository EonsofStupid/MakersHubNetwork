
import React, { useState } from "react";
import { useAtom } from "jotai";
import { effectsPaletteVisibleAtom, selectedEffectAtom } from "@/admin/atoms/tools.atoms";
import { SmartOverlay } from "./SmartOverlay";
import { cn } from "@/lib/utils";
import { Sparkles, Zap, RefreshCw, Waves, Flame, Droplet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// Define our available effects
const effects = [
  { id: "glow", name: "Glow", icon: Sparkles, class: "impulse-glow", description: "Soft neon glow effect" },
  { id: "pulse", name: "Pulse", icon: Zap, class: "impulse-pulse", description: "Pulsating animation" },
  { id: "shimmer", name: "Shimmer", icon: Waves, class: "impulse-shimmer", description: "Horizontal shimmer sweep" },
  { id: "rotate", name: "Rotate", icon: RefreshCw, class: "impulse-rotate", description: "Slow rotation animation" },
  { id: "burn", name: "Burn", icon: Flame, class: "impulse-burn", description: "Fiery glow effect" },
  { id: "liquid", name: "Liquid", icon: Droplet, class: "impulse-liquid", description: "Wavy liquid animation" },
];

export function EffectsPalette() {
  const [, setEffectsPaletteVisible] = useAtom(effectsPaletteVisibleAtom);
  const [selectedEffect, setSelectedEffect] = useAtom(selectedEffectAtom);
  const [draggedEffect, setDraggedEffect] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleSelectEffect = (effectId: string) => {
    setSelectedEffect(effectId);
    toast({
      title: "Effect Selected",
      description: `"${effects.find(e => e.id === effectId)?.name}" effect is ready to apply`
    });
  };
  
  const handleDragStart = (effectId: string, e: React.DragEvent) => {
    setDraggedEffect(effectId);
    
    // Set drag data
    if (e.dataTransfer) {
      e.dataTransfer.setData("application/x-impulse-effect", effectId);
      e.dataTransfer.effectAllowed = "copy";
      
      // Create a custom drag image
      const dragPreview = document.createElement("div");
      dragPreview.className = cn(
        "bg-[var(--impulse-bg-card)] p-2 rounded border border-[var(--impulse-border-active)]",
        "text-[var(--impulse-text-primary)] shadow-[var(--impulse-glow-primary)]"
      );
      dragPreview.textContent = effects.find(e => e.id === effectId)?.name || "";
      
      document.body.appendChild(dragPreview);
      e.dataTransfer.setDragImage(dragPreview, 15, 15);
      
      // Remove the element after drag starts
      setTimeout(() => {
        document.body.removeChild(dragPreview);
      }, 0);
    }
  };
  
  const handleDragEnd = () => {
    setDraggedEffect(null);
  };
  
  const applyEffectToSelection = () => {
    if (!selectedEffect) {
      toast({
        title: "No Effect Selected",
        description: "Please select an effect first",
        variant: "destructive"
      });
      return;
    }
    
    const effect = effects.find(e => e.id === selectedEffect);
    
    toast({
      title: "Effect Applied",
      description: `"${effect?.name}" effect applied to selected element`
    });
  };
  
  return (
    <SmartOverlay
      id="effects-palette"
      title="Impulse Effects Palette"
      initialPosition={{ x: 150, y: 150 }}
      width={320}
      height={480}
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--impulse-text-secondary)]">
          Drag effects onto page elements or select and apply to the current selection.
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {effects.map((effect) => (
            <div
              key={effect.id}
              draggable
              onDragStart={(e) => handleDragStart(effect.id, e)}
              onDragEnd={handleDragEnd}
              onClick={() => handleSelectEffect(effect.id)}
              className={cn(
                "impulse-effect-card flex flex-col items-center p-3 rounded",
                "border border-[var(--impulse-border-normal)] cursor-grab",
                "bg-[rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200",
                "hover:border-[var(--impulse-border-hover)] hover:bg-[rgba(0,0,0,0.4)]",
                selectedEffect === effect.id && "ring-1 ring-[var(--impulse-primary)] border-[var(--impulse-border-active)]"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full mb-2 flex items-center justify-center",
                "bg-[rgba(0,240,255,0.1)]",
                effect.class
              )}>
                <effect.icon className="w-6 h-6 text-[var(--impulse-primary)]" />
              </div>
              <span className="text-sm font-medium text-[var(--impulse-text-primary)]">
                {effect.name}
              </span>
              <span className="text-xs text-[var(--impulse-text-secondary)] text-center mt-1">
                {effect.description}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 space-y-3">
          <Button 
            className="w-full impulse-button"
            onClick={applyEffectToSelection}
            disabled={!selectedEffect}
          >
            Apply to Selection
          </Button>
          
          <p className="text-xs text-[var(--impulse-text-secondary)]">
            Tip: For best results, apply effects to containers rather than text elements.
          </p>
        </div>
      </div>
    </SmartOverlay>
  );
}
