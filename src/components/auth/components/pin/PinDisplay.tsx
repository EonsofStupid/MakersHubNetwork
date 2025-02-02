import { motion } from "framer-motion";

interface PinDisplayProps {
  currentPin: string;
  className?: string;
}

export const PinDisplay = ({ currentPin, className = "" }: PinDisplayProps) => {
  const containerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const dotVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: (filled: boolean) => ({
      scale: filled ? [0.8, 1.2, 1] : 0.8,
      opacity: filled ? 1 : 0.3,
      transition: {
        scale: {
          duration: 0.3,
          ease: "easeOut"
        }
      }
    })
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`flex justify-center gap-4 mb-8 ${className}`}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          custom={!!currentPin[i]}
          variants={dotVariants}
          className="relative w-6 h-6"
        >
          <div className="absolute inset-0 rounded-full bg-[#41f0db] opacity-20" />
          <div className="absolute inset-0 rounded-full bg-[#41f0db]/30 backdrop-blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center">
            {currentPin[i] && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-3 h-3 rounded-full bg-[#41f0db]"
              />
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};