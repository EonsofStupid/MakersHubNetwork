
import React from 'react';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { X, Copy, Sparkles, Wand2 } from 'lucide-react';
import { 
  effectsPaletteVisibleAtom, 
  selectedEffectAtom,
  adminEditModeAtom 
} from '@/admin/atoms/tools.atoms';
import { Button } from '@/components/ui/button';
import { SimpleCyberText } from '@/components/theme/SimpleCyberText';

// Sample effect definitions
const cyberEffects = [
  { id: 'cyber-glow', name: 'Cyber Glow', cssClass: 'cyber-glow' },
  { id: 'electric-border', name: 'Electric Border', cssClass: 'electric-border' },
  { id: 'cyber-pulse', name: 'Cyber Pulse', cssClass: 'electric-pulse' },
  { id: 'hover-glow', name: 'Hover Glow', cssClass: 'hover-glow' },
  { id: 'electric-text', name: 'Electric Text', cssClass: 'electric-text' },
  { id: 'mouse-glow', name: 'Mouse Glow', cssClass: 'mouse-glow' },
  { id: 'electric-border-animated', name: 'Animated Border', cssClass: 'electric-border-animated' },
];

export function EffectsPalette() {
  const [isVisible, setIsVisible] = useAtom(effectsPaletteVisibleAtom);
  const [selectedEffect, setSelectedEffect] = useAtom(selectedEffectAtom);
  const [isEditMode] = useAtom(adminEditModeAtom);

  if (!isVisible || !isEditMode) {
    return null;
  }

  const copyEffectClass = (className: string) => {
    navigator.clipboard.writeText(className);
    setSelectedEffect(className);
    
    // Show a brief highlight effect and reset after a second
    setTimeout(() => {
      setSelectedEffect(null);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed bottom-4 left-4 z-50 w-64 bg-[var(--impulse-bg-overlay)] backdrop-blur-md border border-[var(--impulse-border-normal)] rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between p-3 border-b border-[var(--impulse-border-normal)]">
        <h3 className="text-sm font-medium flex items-center gap-1 text-[var(--impulse-text-primary)]">
          <Wand2 className="h-4 w-4 text-[var(--impulse-primary)]" />
          <SimpleCyberText text="Effect Styles" glitch />
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <div className="p-3 max-h-[300px] overflow-y-auto">
        <p className="text-xs text-[var(--impulse-text-secondary)] mb-3">
          Click an effect to copy its CSS class name:
        </p>
        <div className="space-y-2">
          {cyberEffects.map((effect) => (
            <motion.button
              key={effect.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left flex items-center justify-between p-2 rounded-md text-xs ${
                selectedEffect === effect.cssClass 
                  ? "bg-[var(--impulse-primary)]/20 text-[var(--impulse-primary)]" 
                  : "bg-[var(--impulse-bg-card)] text-[var(--impulse-text-primary)] hover:bg-[var(--impulse-bg-hover)]"
              } ${effect.cssClass}`}
              onClick={() => copyEffectClass(effect.cssClass)}
            >
              <span>{effect.name}</span>
              <Copy className="h-3 w-3 opacity-60" />
            </motion.button>
          ))}
        </div>
      </div>
      
      <div className="border-t border-[var(--impulse-border-normal)] p-3">
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs w-full flex items-center gap-1.5 cyber-glow"
            onClick={() => setIsVisible(false)}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Close Palette</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
