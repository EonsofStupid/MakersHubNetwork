import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function ThemeLoadingState() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 text-center bg-background/20 backdrop-blur-xl rounded-lg shadow-lg"
    >
      <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
      <p className="mt-2 text-muted-foreground animate-pulse">Loading theme data...</p>
    </motion.div>
  );
} 