
import { Skeleton } from "@/ui/core/skeleton";

export function ThemeLoadingState() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="space-y-4 w-full max-w-md">
        <Skeleton className="h-6 w-3/4 mx-auto" />
        <Skeleton className="h-32 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </div>
  );
}
