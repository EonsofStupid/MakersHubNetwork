
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ThemeErrorStateProps {
  error: Error;
  onRetry?: () => void;
  onClose?: () => void;
}

export function ThemeErrorState({ error, onRetry, onClose }: ThemeErrorStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="p-6 text-center bg-background/20 backdrop-blur-xl border border-destructive/20 rounded-lg shadow-lg"
    >
      <p className="text-destructive">Error loading theme: {error.message}</p>
      <div className="mt-4 flex space-x-2 justify-center">
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="border-primary/30">
            Retry
          </Button>
        )}
        {onClose && (
          <Button onClick={onClose} variant="ghost">
            Close
          </Button>
        )}
      </div>
    </motion.div>
  );
}
