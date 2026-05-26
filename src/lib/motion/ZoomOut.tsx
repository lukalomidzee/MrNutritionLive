"use client";

import type { Variants } from "framer-motion";
import type { ReactNode } from "react";
import MotionBase from "./MotionBase";
import { zoomOutVariants } from "./variants";

interface ZoomOutProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}

export default function ZoomOut({
  children,
  className,
  variants = zoomOutVariants,
}: ZoomOutProps) {
  return (
    <MotionBase variants={variants} className={className}>
      {children}
    </MotionBase>
  );
}
