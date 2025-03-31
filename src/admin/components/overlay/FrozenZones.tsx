
import React from 'react';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { frozenZonesAtom } from '@/admin/atoms/tools.atoms';
import { Button } from '@/admin/components/ui/Button';

export const FrozenZones: React.FC = () => {
  const [frozenZones, setFrozenZones] = useAtom(frozenZonesAtom);

  if (!frozenZones || frozenZones.length === 0) {
    return null;
  }

  const removeFrozenZone = (id: string) => {
    setFrozenZones(frozenZones.filter(zone => zone !== id));
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 backdrop-blur-md bg-[var(--impulse-bg-card)]/80 border border-[var(--impulse-border-light)] rounded-lg shadow-lg"
      >
        <div className="text-sm font-medium mb-2">Protected Areas</div>
        <div className="space-y-2">
          {frozenZones.map((zone) => (
            <div key={zone} className="flex items-center justify-between">
              <span className="text-xs text-[var(--impulse-text-secondary)]">
                {zone}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeFrozenZone(zone)}
                className="h-6 px-2 text-xs"
              >
                Unprotect
              </Button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
