
import { cn } from "@/shared/utils/cn";

interface SkeletonProps {
  className?: string;
}

/**
 * Skeleton UI component for loading states
 */
function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted", 
        className
      )}
    />
  );
}

export { Skeleton };
