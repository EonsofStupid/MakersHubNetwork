export const menuVariants = {
  hidden: { 
    opacity: 0,
    y: -5,
    scale: 0.95,
    filter: "blur(8px)"
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -5,
    scale: 0.95,
    filter: "blur(8px)",
    transition: {
      duration: 0.15,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};