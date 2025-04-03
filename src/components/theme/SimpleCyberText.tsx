
import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleCyberTextProps {
  text: string;
  className?: string;
  glitchEffect?: boolean;
  glowEffect?: boolean;
  scanlineEffect?: boolean;
}

export function SimpleCyberText({
  text,
  className,
  glitchEffect = true,
  glowEffect = true,
  scanlineEffect = false
}: SimpleCyberTextProps) {
  return (
    <span
      className={cn(
        'relative inline-block',
        glitchEffect && 'cyber-glitch',
        glowEffect && 'cyber-glow',
        scanlineEffect && 'cyber-scanlines',
        className
      )}
      data-text={text}
    >
      {text}
      {scanlineEffect && (
        <span className="absolute inset-0 overflow-hidden pointer-events-none">
          <span className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent opacity-30 animate-scan-line" />
        </span>
      )}
    </span>
  );
}
