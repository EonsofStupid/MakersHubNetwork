
// Re-export avatar components
import React from 'react';

// Define types for avatar components
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Avatar({ className, ...props }: AvatarProps) {
  return <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`} {...props} />;
}

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export function AvatarImage({ className, alt = "", ...props }: AvatarImageProps) {
  return <img className={`aspect-square h-full w-full ${className}`} alt={alt} {...props} />;
}

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

export function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return <span className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`} {...props} />;
}
