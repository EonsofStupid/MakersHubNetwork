
import { AlertCircle } from "lucide-react";
import { Button } from "@/ui/core/button";
import { Alert, AlertTitle, AlertDescription } from "@/ui/core/alert";

interface ThemeErrorStateProps {
  message: string;
  subMessage: string;
  onRetry?: () => void;
}

export function ThemeErrorState({ 
  message = "Failed to load theme", 
  subMessage = "There was an error loading the theme configuration.", 
  onRetry 
}: ThemeErrorStateProps) {
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{message}</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>{subMessage}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="self-start">
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
