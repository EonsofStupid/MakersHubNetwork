
import React from 'react';
import { useAtom } from 'jotai';
import { effectsPaletteVisibleAtom, selectedEffectAtom } from '@/admin/atoms/tools.atoms';

export function EffectsPalette() {
  const [isVisible] = useAtom(effectsPaletteVisibleAtom);
  const [selectedEffect, setSelectedEffect] = useAtom(selectedEffectAtom);
  
  if (!isVisible) {
    return null;
  }
  
  // Effects to be defined later
  const effects = [
    { id: 'pulse', name: 'Pulse', color: 'blue' },
    { id: 'glitch', name: 'Glitch', color: 'pink' },
    { id: 'cyber', name: 'Cyber', color: 'green' },
    { id: 'electric', name: 'Electric', color: 'yellow' },
  ];
  
  return (
    <div className="fixed bottom-4 left-4 p-2 rounded-md backdrop-blur-md bg-[var(--impulse-bg-overlay)] border border-[var(--impulse-border-normal)] z-50">
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-medium text-[var(--impulse-text-primary)]">Effects</h3>
        <div className="flex gap-2">
          {effects.map((effect) => (
            <button
              key={effect.id}
              onClick={() => setSelectedEffect(effect.id)}
              className={`w-6 h-6 rounded-full ${selectedEffect === effect.id ? 'ring-2 ring-[var(--impulse-primary)]' : ''}`}
              style={{ backgroundColor: effect.color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
