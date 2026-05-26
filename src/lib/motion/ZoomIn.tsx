"use client";

import type { Variants } from "framer-motion";
import type { ReactNode } from "react";
import MotionBase from "./MotionBase";
import { zoomInVariants } from "./variants";

interface ZoomInProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}

export default function ZoomIn({
  children,
  className,
  variants = zoomInVariants,
}: ZoomInProps) {
  return (
    <MotionBase variants={variants} className={className}>
      {children}
    </MotionBase>
  );
}
