
import React from 'react';
import { useAtom } from 'jotai';
import { frozenZonesAtom } from '@/admin/atoms/tools.atoms';

export function FrozenZones() {
  const [frozenZones] = useAtom(frozenZonesAtom);
  
  // No frozen zones defined yet, render nothing
  if (!frozenZones || frozenZones.length === 0) {
    return null;
  }
  
  return (
    <div className="frozen-zones">
      {frozenZones.map((zone, index) => (
        <div key={index} className="frozen-zone">
          {/* Frozen zone content will be implemented later */}
        </div>
      ))}
    </div>
  );
}
