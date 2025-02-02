import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface AvatarLoadingStateProps {
  size: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AvatarLoadingState = ({ size, className }: AvatarLoadingStateProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  return (
    <div className="relative">
      <Skeleton className={cn(sizeClasses[size], "rounded-full", className)} />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
    </div>
  );
};