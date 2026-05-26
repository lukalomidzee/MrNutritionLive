// "use client";

// import {
//   motion,
//   type Variants,
//   type TargetAndTransition,
//   type VariantLabels,
//   type Transition,
// } from "framer-motion";
// import type { ReactNode } from "react";

// interface AnimateOnViewProps {
//   children: ReactNode;

//   initial?: boolean | TargetAndTransition | VariantLabels;
//   whileInView?: TargetAndTransition | VariantLabels;

//   transition?: Transition;

//   variants?: Variants;

//   className?: string;

//   viewport?: {
//     once?: boolean;
//     amount?: "some" | "all" | number;
//     margin?: string;
//   };

//   exit?: TargetAndTransition | VariantLabels;
// }

// export default function AnimateOnView({
//   children,
//   initial = { opacity: 0, y: 20 },
//   whileInView = { opacity: 1, y: 0 },
//   exit,
//   transition = { duration: 0.3, ease: "easeOut" },
//   variants,
//   className,
//   viewport = { once: true, amount: 0.2 },
// }: AnimateOnViewProps) {
//   return (
//     <motion.div
//       variants={variants}
//       initial={variants ? undefined : initial}
//       whileInView={variants ? undefined : whileInView}
//       exit={exit}
//       transition={transition}
//       viewport={viewport}
//       className={className}
//     >
//       {children}
//     </motion.div>
//   );
// }

"use client";

import type { Variants } from "framer-motion";
import type { ReactNode } from "react";
import MotionBase from "./MotionBase";

const defaultInView: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface AnimateOnViewProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}

export default function AnimateOnView({
  children,
  className,
  variants = defaultInView,
}: AnimateOnViewProps) {
  return (
    <MotionBase variants={variants} className={className}>
      {children}
    </MotionBase>
  );
}
