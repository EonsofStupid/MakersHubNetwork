
import React from 'react';

export function FrozenZones() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      <div className="border-2 border-dashed border-primary/20 absolute top-16 left-64 right-0 h-16 bg-primary/5 flex items-center justify-center">
        <span className="text-primary/70 text-xs font-medium">Header Area (Fixed)</span>
      </div>
      <div className="border-2 border-dashed border-primary/20 absolute top-0 left-0 w-64 h-screen bg-primary/5 flex items-center justify-center">
        <span className="text-primary/70 text-xs font-medium transform rotate-90">Sidebar Area (Fixed)</span>
      </div>
    </div>
  );
}
