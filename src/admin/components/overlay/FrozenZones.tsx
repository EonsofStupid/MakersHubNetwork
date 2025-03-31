
import React from 'react';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { X, Lock, Unlock } from 'lucide-react';
import { frozenZonesAtom, adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FrozenZone } from '@/admin/types/tools.types';

export function FrozenZones() {
  const [frozenZones, setFrozenZones] = useAtom(frozenZonesAtom);
  const [isEditMode] = useAtom(adminEditModeAtom);
  
  // This component is only shown in edit mode
  if (!isEditMode || frozenZones.length === 0) {
    return null;
  }
  
  const toggleZoneLock = (id: string) => {
    setFrozenZones(prev => {
      return prev.filter(zone => zone !== id);
    });
  };
  
  return (
    <div className="fixed top-16 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--impulse-bg-overlay)] backdrop-blur-md border border-[var(--impulse-border-normal)] rounded-lg p-3 shadow-lg"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-[var(--impulse-text-primary)]">
            Frozen Areas
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={() => setFrozenZones([])}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {frozenZones.map((zone, index) => (
            <div key={`frozen-${index}`} className="flex items-center justify-between text-xs p-1.5 bg-[var(--impulse-bg-card)] rounded">
              <span className="truncate max-w-[150px] text-[var(--impulse-text-secondary)]">
                {zone}
              </span>
              <Button 
                variant="ghost" 
                size="xs" 
                className="h-5 w-5 p-0 text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-primary)]"
                onClick={() => toggleZoneLock(zone)}
              >
                <Unlock className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
