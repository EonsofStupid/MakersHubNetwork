
import React from 'react';
import { GripVertical } from 'lucide-react';

interface DragIndicatorProps {
  className?: string;
}

export function DragIndicator({ className = '' }: DragIndicatorProps) {
  return (
    <div className={`cursor-grab active:cursor-grabbing ${className}`}>
      <GripVertical className="h-5 w-5 text-[var(--impulse-text-muted)]" />
    </div>
  );
}
