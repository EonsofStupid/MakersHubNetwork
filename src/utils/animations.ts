import { Variants } from "framer-motion";

export const getWarpInVariants = (duration: number): Variants => ({
  hidden: {
    opacity: 0,
    scale: 0.7,
    y: -100,
    rotateX: 45,
    filter: "blur(10px)",
    transformOrigin: "50% 0%",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transformOrigin: "50% 50%",
    transition: {
      duration,
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
});

export const getWarpOutVariants = (duration: number): Variants => ({
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transformOrigin: "50% 50%",
  },
  hidden: {
    opacity: 0,
    scale: 0.7,
    y: -100,
    rotateX: 45,
    filter: "blur(10px)",
    transformOrigin: "50% 100%",
    transition: {
      duration,
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
});

export const cardVariants = {
  offscreen: {
    y: 300,
    rotate: -10,
    scale: 0.8,
    opacity: 0,
  },
  onscreen: (direction: number) => ({
    y: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  }),
};

export const calculateAnimationDuration = (scrollVelocity: number): number => {
  const baseDuration = 0.8;
  const velocityFactor = Math.min(scrollVelocity / 100, 1);
  return baseDuration - (velocityFactor * 0.5);
};