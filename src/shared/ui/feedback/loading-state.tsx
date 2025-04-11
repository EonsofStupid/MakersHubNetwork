
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/shared/ui/core/skeleton";

interface LoadingStateProps {
  message?: string;
  variant?: 'default' | 'skeleton' | 'spinner' | 'minimal';
  count?: number;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  variant = "default",
  count = 3,
  className,
}: LoadingStateProps) {
  
  // Skeleton loader variant
  if (variant === "skeleton") {
    return (
      <div className={className || "w-full space-y-2"}>
        {Array(count).fill(0).map((_, i) => (
          <Skeleton
            key={i}
            className="h-12 w-full"
          />
        ))}
      </div>
    );
  }
  
  // Spinner variant
  if (variant === "spinner") {
    return (
      <div className={className || "flex items-center justify-center p-4"}>
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  
  // Minimal variant - just the spinner
  if (variant === "minimal") {
    return (
      <Loader2 className={className || "h-4 w-4 animate-spin text-muted-foreground"} />
    );
  }
  
  // Default variant
  return (
    <div className={className || "flex flex-col items-center justify-center p-8 text-center"}>
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
