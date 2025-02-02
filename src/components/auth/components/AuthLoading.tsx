import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface AuthLoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const AuthLoading = ({ 
  message = "Loading...", 
  size = "md",
  className = "" 
}: AuthLoadingProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  const containerVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }
  };

  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.3
      }
    },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={containerVariants}
      className={`flex items-center justify-center min-h-[200px] ${className}`}
    >
      <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-[#41f0db]`} />
        <motion.p 
          variants={textVariants}
          className="text-white/80 text-sm animate-pulse"
        >
          {message}
        </motion.p>
      </div>
    </motion.div>
  );
};