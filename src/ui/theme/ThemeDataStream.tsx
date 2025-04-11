
import React, { useEffect, useState } from 'react';
import { useSiteTheme } from '@/app/components/theme/SiteThemeProvider';
import { cn } from '@/lib/utils';

export interface ThemeDataStreamProps {
  className?: string;
  speed?: number;
  size?: 'sm' | 'md' | 'lg';
  colors?: string[];
  content?: string;
}

/**
 * ThemeDataStream
 * 
 * A visual effect that mimics a data stream with animated text
 */
export const ThemeDataStream: React.FC<ThemeDataStreamProps> = ({
  className,
  speed = 20,
  size = 'md',
  colors = ['text-primary', 'text-secondary', 'text-accent', 'text-muted-foreground'],
  content = "01001001 01110100 00100111 01110011 00100000 01100001 01101100 01101001 01110110 01100101 00100001"
}) => {
  const { variables } = useSiteTheme();
  const [stream, setStream] = useState<string[]>([]);
  
  // Generate random binary stream
  useEffect(() => {
    const streamArray = content.split(' ');
    setStream(streamArray);
  }, [content]);
  
  // Set size class
  const sizeClass = {
    sm: 'text-xs tracking-tight',
    md: 'text-sm tracking-normal',
    lg: 'text-base tracking-wide',
  }[size];
  
  // Log info for debugging
  useEffect(() => {
    console.log('ThemeDataStream variables:', variables);
  }, [variables]);
  
  return (
    <div className={cn("overflow-hidden font-mono", className)}>
      <div className="animate-stream flex flex-wrap gap-1">
        {stream.map((binary, index) => (
          <span
            key={index}
            className={cn(
              sizeClass,
              colors[index % colors.length],
              `animate-pulse-${(index % 5) + 1}`
            )}
          >
            {binary}
          </span>
        ))}
      </div>
    </div>
  );
};
