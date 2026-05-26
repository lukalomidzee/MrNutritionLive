import type { Variants } from "framer-motion";
import type { ReactNode } from "react";
import MotionBase from "./MotionBase";
import { slideLeftVariants } from "./variants";

interface SlideLeftProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}

export default function SlideLeft({
  children,
  className,
  variants = slideLeftVariants,
}: SlideLeftProps) {
  return (
    <MotionBase variants={variants} className={className}>
      {children}
    </MotionBase>
  );
}
