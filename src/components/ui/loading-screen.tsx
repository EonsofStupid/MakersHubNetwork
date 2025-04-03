
import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <h2 className="text-xl font-semibold text-primary">Loading...</h2>
        <p className="text-muted-foreground max-w-md">
          Please wait while we prepare your experience
        </p>
      </div>
    </div>
  );
}
