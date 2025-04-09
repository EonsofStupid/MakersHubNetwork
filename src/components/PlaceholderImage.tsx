
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface PlaceholderImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  fallbackColor?: string;
}

export function PlaceholderImage({
  src,
  alt,
  className,
  fallbackText,
  fallbackColor = 'bg-muted',
  ...props
}: PlaceholderImageProps) {
  const [hasError, setHasError] = useState(false);
  const displayText = fallbackText || alt?.charAt(0) || '?';
  
  return hasError ? (
    <div 
      className={cn(
        "flex items-center justify-center", 
        fallbackColor,
        className
      )}
      {...props}
    >
      <span className="text-xl font-bold text-muted-foreground">
        {displayText}
      </span>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
