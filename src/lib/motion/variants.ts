import { Variants } from "framer-motion";

/**
 * Fade In / Out
 */
// export const fadeVariants: Variants = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1 },
//   exit: { opacity: 0 },
// };

export const fadeVariants = {
  hidden:  { opacity: 0,  transform: "translateZ(0)" },
  ready:   { opacity: 0, },
  visible: {
    opacity: 1,
    
    transition: { duration: 0.3, ease: "easeOut" },
  },
  // Only keep exit if you actually use <AnimatePresence> for unmounts.
  // exit: { opacity: 0, y: -8, transition: { duration: 0.28, ease: "easeIn" } },
} as const;


/**
 * Slide Up
 */
export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20 },
};

/**
 * Slide Right
 */
export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, x: 50 },
};

/**
 * Slide Left
 */
export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, x: -50 },
};

/**
 * Zoom In
 */
export const zoomInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.9 },
};

/**
 * Zoom Out
 */
export const zoomOutVariants: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, scale: 1.1 },
};

/**
 * Staggered list (parent controls child animations)
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
