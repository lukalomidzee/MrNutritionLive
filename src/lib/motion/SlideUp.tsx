"use client";

import type { Variants } from "framer-motion";
import type { ReactNode } from "react";
import MotionBase from "./MotionBase";
import { slideUpVariants } from "./variants";

interface SlideUpProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}

export default function SlideUp({
  children,
  className,
  variants = slideUpVariants,
}: SlideUpProps) {
  return (
    <MotionBase variants={variants} className={className}>
      {children}
    </MotionBase>
  );
}
