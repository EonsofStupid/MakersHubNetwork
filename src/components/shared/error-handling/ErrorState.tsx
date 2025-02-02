import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = ({
  title = "Error",
  message = "Something went wrong. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Alert variant="destructive" className="max-w-xl mx-auto bg-destructive/5 border-destructive/20">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2">
          <div className="text-sm text-destructive/90 mb-4">{message}</div>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              className="bg-background/50 hover:bg-background/80"
              onClick={onRetry}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};