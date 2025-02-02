import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

export const scaleIn: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

export const slideIn: Variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
};

export const toolbarAnimation: Variants = {
  hidden: { y: -100 },
  visible: {
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};