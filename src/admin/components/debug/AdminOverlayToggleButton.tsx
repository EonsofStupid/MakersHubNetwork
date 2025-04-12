
import React from 'react';
import { useDebugStore } from '@/shared/stores/debug/debug.store';
import { Bug } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminOverlayToggleButton({ className }: { className?: string }) {
  const toggle = useDebugStore((s) => s.toggleAdminOverlay);
  const active = useDebugStore((s) => s.showAdminOverlay);

  return (
    <button
      className={cn(
        'p-2 rounded transition-all',
        active 
          ? 'bg-yellow-400 text-black hover:bg-yellow-300' 
          : 'bg-gray-700 text-white hover:bg-gray-600',
        className
      )}
      onClick={toggle}
      title="Toggle Admin Overlay"
    >
      <Bug className="w-4 h-4" />
    </button>
  );
}
