
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import { X, Wand2 } from 'lucide-react';
import { effectsPaletteVisibleAtom, selectedEffectAtom } from '@/admin/atoms/tools.atoms';
import { cyberEffectVariantsAtom, cyberColorVariantsAtom } from '@/admin/atoms';
import { CyberEffect } from '@/admin/types/tools.types';

export function EffectsPalette() {
  const [isVisible, setIsVisible] = useAtom(effectsPaletteVisibleAtom);
  const [selectedEffect, setSelectedEffect] = useAtom(selectedEffectAtom);
  const [effectVariants] = useAtom(cyberEffectVariantsAtom);
  const [colorVariants] = useAtom(cyberColorVariantsAtom);
  
  if (!isVisible) return null;
  
  // Create a CyberEffect object for the selected effect
  const handleSelectEffect = (effectName: string) => {
    const effect: CyberEffect = {
      id: effectName,
      name: effectName,
      css: `cyber-effect-${effectName}`,
    };
    setSelectedEffect(effect);
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--impulse-bg-overlay)] backdrop-blur-xl p-4 rounded-lg border border-[var(--impulse-border-normal)] shadow-lg w-96"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-[var(--impulse-primary)]" />
            <h3 className="text-base font-medium text-[var(--impulse-text-primary)]">
              Effect Palette
            </h3>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-full hover:bg-[var(--impulse-bg-hover)] text-[var(--impulse-text-secondary)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm text-[var(--impulse-text-secondary)] mb-2">Effects</h4>
            <div className="grid grid-cols-3 gap-2">
              {effectVariants.map(effect => (
                <button
                  key={effect}
                  onClick={() => handleSelectEffect(effect)}
                  className={`
                    p-2 rounded border text-sm
                    ${selectedEffect?.id === effect 
                      ? 'bg-[var(--impulse-primary)]/20 border-[var(--impulse-primary)] text-[var(--impulse-primary)]' 
                      : 'border-[var(--impulse-border-normal)] hover:border-[var(--impulse-border-hover)] text-[var(--impulse-text-primary)]'}
                  `}
                >
                  {effect}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm text-[var(--impulse-text-secondary)] mb-2">Colors</h4>
            <div className="flex flex-wrap gap-2">
              {colorVariants.map(color => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-full border border-[var(--impulse-border-normal)] hover:border-white transition-colors"
                  style={{ backgroundColor: color }}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
