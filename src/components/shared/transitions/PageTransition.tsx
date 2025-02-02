import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

// Pool of trendy transitions
const transitions = [
  {
    initial: { opacity: 0, scale: 0.95, filter: "blur(8px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 1.05, filter: "blur(8px)" },
  },
  {
    initial: { opacity: 0, x: -100, rotateY: -30 },
    animate: { opacity: 1, x: 0, rotateY: 0 },
    exit: { opacity: 0, x: 100, rotateY: 30 },
  },
  {
    initial: { opacity: 0, y: 50, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -50, scale: 0.9 },
  },
  {
    initial: { opacity: 0, scale: 1.1, filter: "saturate(0)" },
    animate: { opacity: 1, scale: 1, filter: "saturate(1)" },
    exit: { opacity: 0, scale: 0.9, filter: "saturate(0)" },
  },
  {
    initial: { opacity: 0, rotate: -5, y: 30 },
    animate: { opacity: 1, rotate: 0, y: 0 },
    exit: { opacity: 0, rotate: 5, y: -30 },
  },
];

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const transition = transitions[Math.floor(Math.random() * transitions.length)];

  return (
    <motion.div
      key={location.pathname}
      initial={transition.initial}
      animate={transition.animate}
      exit={transition.exit}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};