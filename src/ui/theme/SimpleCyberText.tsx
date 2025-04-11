
import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleCyberTextProps {
  text: string;
  className?: string;
  glitch?: boolean;
  color?: 'default' | 'primary' | 'secondary' | 'accent';
  glow?: boolean;
}

export function SimpleCyberText({ 
  text, 
  className, 
  glitch = false, 
  color = 'primary',
  glow = true 
}: SimpleCyberTextProps) {
  const colorClasses = {
    default: 'text-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
  };

  return (
    <span 
      className={cn(
        'font-mono tracking-wider uppercase font-bold',
        colorClasses[color],
        glow && 'drop-shadow-[0_0_5px_currentColor]',
        glitch && 'relative',
        className
      )}
      data-text={glitch ? text : undefined}
    >
      {text}
      {glitch && (
        <>
          <span className="absolute left-[2px] top-0 w-full h-full opacity-70 text-red-500 filter blur-[0.5px]">{text}</span>
          <span className="absolute left-[-2px] top-0 w-full h-full opacity-70 text-cyan-500 filter blur-[0.5px]">{text}</span>
        </>
      )}
    </span>
  );
}
