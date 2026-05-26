"use client";

import type { Variants } from "framer-motion";
import type { ReactNode } from "react";
import MotionBase from "./MotionBase";
import { slideRightVariants } from "./variants";

interface SlideRightProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}

export default function SlideRight({
  children,
  className,
  variants = slideRightVariants,
}: SlideRightProps) {
  return (
    <MotionBase variants={variants} className={className}>
      {children}
    </MotionBase>
  );
}
