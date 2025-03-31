
import React from 'react';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { frozenZonesAtom } from '@/admin/atoms/tools.atoms';

export function FrozenZones() {
  const [frozenZones] = useAtom(frozenZonesAtom);
  
  if (!frozenZones.length) return null;
  
  return (
    <>
      {frozenZones.map((zone, index) => (
        <motion.div
          key={`frozen-zone-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="fixed inset-0 bg-black/50 pointer-events-none z-50"
          style={{
            clipPath: `polygon(${zone})`
          }}
        />
      ))}
    </>
  );
}
